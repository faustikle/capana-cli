const util = require('util');
const exec = util.promisify(require('child_process').exec);

const hasDatabaseUpdate = stdout => {
  return stdout.search(/ddl/) >= 0;
}

exports.update = serviceName => async capanaConfig => {
  console.log(`Atualizando repositório do serviço ${serviceName}`);
  const serviceConfig = capanaConfig.services.find(service => service.name === serviceName);

  if (!serviceConfig) {
    throw new Error(`Serviço [${serviceName}] não encontrado no arquivo de configurações.`);
  }

  const serviceFolder = `${capanaConfig.workspacePath}/${serviceConfig.folder}`;
  const defaultBrach = serviceConfig.defaultBranch;

  try {
    await exec(`git checkout ${defaultBrach}`, {cwd: serviceFolder, shell: '/bin/bash'});
    const { stdout, stderr } = await exec(`git pull origin ${defaultBrach}`, {cwd: serviceFolder, shell: '/bin/bash'});

    return hasDatabaseUpdate(stdout);
  } catch(e) {
    throw new Error(`Não foi possivel atualizar o serviço ${serviceName}`);
  }
}