
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'groupcounseling',
  applicationName: 'groupcounseling-app',
  appUid: 'tS1kcqz63PhQnMdvVn',
  orgUid: '844d5c57-dee4-42b2-b2ce-312bc766d0c2',
  deploymentUid: 'dac410b0-55ed-48b2-9244-6898f9ae8cc1',
  serviceName: 'GroupCounseling-app',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'dev',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '5.5.1',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'GroupCounseling-app-dev-user_test', timeout: 6 };

try {
  const userHandler = require('./testcase/user_test.js');
  module.exports.handler = serverlessSDK.handler(userHandler.user_test, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}