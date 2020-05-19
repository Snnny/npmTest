var inquirer = require('inquirer');

var { logger } = require('./logger');
console.log('llll', logger, logger.error);
(() => {
  inquirer.prompt([
    {
      name: 'version',
      type: 'list',
      message: '版本号',
      choices: ['major', 'minor', 'patch', 'CustomVersion'],
    },
    {
      name: 'customVersion',
      message: '请输入版本号',
      when: ({ version }) => version === 'CustomVersion',
    },
  ]).then(({version, CustomVersion})=> {
    logger.info(version === 'CustomVersion' ? CustomVersion : version);
  })
})();

function tag(version = 'patch') {
  return new Promise((res, rej) => {
    try {
      const data = execSync(`npm version ${version}`)
      logger(`版本号为: ${data}`)
      execSync('git add package.json')
      execSync('git commit -m "Publish"')
      execSync(`git tag ${data}`)
      execSync(`git push origin ${data}`)
      execSync('git push')
      res(data)
    } catch (error) {
      logger.error(error)
      rej(error)
    }
  })
}
