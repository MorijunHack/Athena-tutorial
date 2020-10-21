import * as aws from 'aws-sdk';

const glue = new aws.Glue({
    region: 'ap-northeast-1'
});

const crawlerConfig = { Name: 'athena_tutorial' }

export async function startCrawler(): Promise<void> {
    await glue.startCrawler(crawlerConfig).promise();
}

export async function waitForCrawler(): Promise<string> {
    let state = (await glue.getCrawler(crawlerConfig).promise()).Crawler?.State;

    // if (!state) throw new Error('no crawler');

    let i = 0;
    while (state != 'STOPPING') {
        i++
        console.log('running:', i);
        await sleep(1000);

        state = (await glue.getCrawler(crawlerConfig).promise()).Crawler?.State;
    }
    i = 0;
    while (state == 'STOPPING') {
        i++
        console.log('stopping:', i);
        await sleep(1000);

        state = (await glue.getCrawler(crawlerConfig).promise()).Crawler?.State;
    }

    if (!state) throw new Error('no crawler');
    return state;
}


function sleep (msec: number) {
    return new Promise(resolve => setTimeout(resolve, msec));
}