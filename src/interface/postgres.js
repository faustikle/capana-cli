const { Client } = require('pg');
const config = require('../config/config');

const createClient = (environmentConfig, service) => {
  const serviceConfig = config.getServiceConfig(environmentConfig, service);
  const user = environmentConfig.usuarioBanco;
  const password = environmentConfig.senhaBanco;

  const connectionString = serviceConfig.stringConexao;

  return new Client({
    user: user,
    password: password,
    connectionString: connectionString,
  });
};

exports.run = async (configs, script, service, environment) => {
  const environmentConfig = config.getEnvironmentConfig(configs, environment);
  const client = createClient(environmentConfig, service);

  await client.connect()
  const response = await client.query(script);
  await client.end();

  return response;
};
