const localConfig = require('./local-config');

exports.load = () => {
  return localConfig.get();
}

exports.getEnvironmentConfig = (configs, environment) => {
  const config = configs.ambientes.find(config => config.nome === environment);

  if (!config) {
    throw new Error(`Ambiente [${environment}] não encontrado nas configurações.`);
  }

  return config;
};

exports.getServiceConfig = (environmentConfig, service) => {
  const config = environmentConfig.services.find(config => config.nome === service);

  if (!config) {
    throw new Error(`Serviço [${service}] não encontrado no ambiente.`);
  }

  return config;
};
