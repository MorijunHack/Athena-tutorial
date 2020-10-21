import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AthenaStack } from '../lib/AthenaStack';

const account = 'AWS_ID';
const app = new cdk.App();

new AthenaStack(app, 'AthenaStack', {tags: {stage: 'dev'}, env: {region: 'ap-northeast-1', account}}); // stg環境をデプロイする際のCloudFormationパッケージ