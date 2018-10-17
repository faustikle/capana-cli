const git = require('./src/interface/git');
const docker = require('./src/interface/docker');

/**
 * Em desenvolvimento.
 */

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