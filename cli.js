const config = require('./src/config/config');
const inquirer = require('inquirer');
const commander = require('commander');
const colors = require('colors');
const version = require('./package.json').version;

const capanaConfig = config.load();

const tasks = {
  'script': require('./src/task/script').execute,
  'build': require('./src/task/script').execute,
  'deploy': require('./src/task/script').execute,
};

// capana-cli -a homologacao -s proposta script 'select * from teste'
// capana-cli -a homologacao -s proposta script-file ~/scripts/teste.sql

// envs
// CAPANA_WORKSPACE=/home/faustikle/Dev/javascript/cli/capana
// CAPANA_DB_USER=capana
// CAPANA_DB_PASSWORD=capana

const parseAmbiente = ambiente => {
  return ambiente || 'local';
};

commander
  .version(version)
  .arguments('<task> [parametro]')
  .option('-s, --servico [servico]', 'Serviço em que será executado a task.')
  .option('-a, --ambiente [ambiente]', 'Ambiente que o script será executado. Default: local')
  .action((task, param, options) => {
    if (!(task in tasks)) {
      console.log(colors.red('Comando inválido.'));
      return;
    }
    
    options.ambiente = parseAmbiente(options.ambiente);
    tasks[task](capanaConfig, param, options);
  });

  commander.on('--help', function(){
    const tasksNames = Object.keys(tasks).map(taskName => `  ${taskName}`);

    console.log('')
    console.log('Tasks disponíveis:');
    console.log(colors.blue(tasksNames.join('\n')));
  });
 
  commander.parse(process.argv)