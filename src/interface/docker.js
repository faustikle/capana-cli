const util = require('util');
const exec = util.promisify(require('child_process').exec);

const getServiceConfig = (serviceName, capanaConfig) => {
  const serviceConfig = capanaConfig.services.find(service => service.name === serviceName);
  
  if (!serviceConfig) {
    throw new Error(`Serviço [${serviceConfig.dockerName}] não encontrado no arquivo de configurações.`);
  }

  return serviceConfig;
}

const stopContainer = async (containerName, workspacePath) => {
  try {
    console.log(`Parando serviço ${containerName}`);
    await exec(`docker-compose stop ${containerName}`, {cwd: workspacePath, shell: '/bin/bash'});
  } catch (error) {
    throw new Error(`Não foi possivel parar o container '${containerName}'`);
  }
}

const restartContainer = async (containerName, workspacePath) => {
  try {
    console.log(`Reiniciando serviço ${containerName}`);
    await exec(`docker-compose restart ${containerName}`, {cwd: workspacePath, shell: '/bin/bash'});
  } catch (error) {
    throw new Error(`Não foi possivel reiniciar o container '${containerName}'`);
  }
}

const runContainer = async (containerName, workspacePath) => {
  try {
    console.log(`Iniciando serviço ${containerName}`);
    await exec(`docker-compose up -d ${containerName}`, {cwd: workspacePath, shell: '/bin/bash'});
  } catch (error) {
    throw new Error(`Não foi possivel iniciar o container '${containerName}'`);
  }
}

exports.stopService = serviceName => async capanaConfig => {
  const serviceConfig = getServiceConfig(serviceName, capanaConfig);
  
  if (serviceConfig.database) {
    await stopContainer(serviceConfig.database.dockerName, capanaConfig.workspacePath);
  }

  stopContainer(serviceConfig.dockerName, capanaConfig.workspacePath);
}

exports.restartService = serviceName => async capanaConfig => {
  const serviceConfig = getServiceConfig(serviceName, capanaConfig);
  
  if (serviceConfig.database) {
    await restartContainer(serviceConfig.database.dockerName, capanaConfig.workspacePath);
  }

  restartContainer(serviceConfig.dockerName, capanaConfig.workspacePath);
}

exports.runContainer = serviceName => async capanaConfig => {
  const serviceConfig = getServiceConfig(serviceName, capanaConfig);
  
  if (serviceConfig.database) {
    await runContainer(serviceConfig.database.dockerName, capanaConfig.workspacePath);
  }

  runContainer(serviceConfig.dockerName, capanaConfig.workspacePath);
}