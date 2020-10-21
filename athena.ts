import * as AWS from 'aws-sdk';
import { Athena } from 'aws-sdk';

const athena = new AWS.Athena({
    region: 'ap-northeast-1'
});

export async function query(queryString: string): Promise<any> {
    const id = await startQuery(queryString);
    if (!id) throw new Error('cannot get the QueryExecutionId.')
    await waitForComp(id);
    return await getResult(id);
}

async function startQuery(queryString: string): Promise<Athena.QueryExecutionId | undefined> {
    const data = await athena.startQueryExecution({
        QueryString: queryString,
        ResultConfiguration: {
            OutputLocation: 's3://{作成したS3バケット}/queried'
        }
    }).promise();

    return data.QueryExecutionId;
}

async function waitForComp(id: Athena.QueryExecutionId): Promise<void> {
    let status = await athena.getQueryExecution({
        QueryExecutionId: id
    }).promise();

    while(status.QueryExecution?.Status?.State != 'SUCCEEDED') {
        await sleep(100);
        status = await athena.getQueryExecution({
            QueryExecutionId: id
        }).promise();
    }
}

async function getResult(id: Athena.QueryExecutionId): Promise<any> {
    const data = await athena.getQueryResults({
        QueryExecutionId: id
    }).promise();

    let res: any[] = [];
    let keys: any[] = [];

    if (!data.ResultSet?.Rows) return res;

    for (let i = 0; i < data.ResultSet.Rows.length; i++) {
        let items = [];
    
        const rowData = data.ResultSet.Rows[i].Data;
        if (rowData == undefined) continue;
        for (const d of rowData) {
            if (i == 0) keys.push(d.VarCharValue);
            else items.push(d.VarCharValue);
        }
        if (i == 0) continue;

        const item = items.reduce((result: any, current, index: number) => {
            result[keys[index]] = current;
            return result;
        }, {});

        res.push(item);
    }

    return res;
}


function sleep (msec: number) {
    return new Promise(resolve => setTimeout(resolve, msec));
}
