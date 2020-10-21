import * as cdk from '@aws-cdk/core';
import * as glue from '@aws-cdk/aws-glue';
import * as s3 from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam';

export class AthenaStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const bucket = s3.Bucket.fromBucketArn(this, 'AthenaTestBucket', 'arn:aws:s3:::{作成したS3バケット}');

        const role = new iam.Role(this, 'AthenaTutorialrole', {
            assumedBy: new iam.ServicePrincipal('glue.amazonaws.com')
        });
        role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole'))
        bucket.grantRead(role);
        bucket.grantPut(role);

        new glue.Database(this, 'athena_tutorial', {
            databaseName: 'athena_tutorial_db'
        });

        new glue.CfnCrawler(this, 'athenatutorialcrawler', {
            targets: {
                s3Targets: [{path: 's3://{作成したS3バケット}/test-input'}]
            },
            role: role.roleArn,
            databaseName: 'athena_tutorial_db',
            name: 'athena_tutorial',
        });
    }
}