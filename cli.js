const inquirer = require('inquirer');
const git = require('./src/shell/git');
const docker = require('./src/shell/docker');
const config = require('./src/config/config');

const capanaConfig = config.get();

const ServicePipeline = serviceName => async config => {
  const stopService = docker.stopService(serviceName);
  const updateService = git.update(serviceName);
  const runService = docker.runContainer(serviceName);
  
  await stopService(config);
  const hasDatabaseUpdate = await updateService(config);
  // await runService(config);
}

const pipelineToConfig = ServicePipeline('proposta')

pipelineToConfig(capanaConfig)
  .then(() => console.log('pipeline finalizada!'))
  .catch(console.log);;