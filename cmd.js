var inquirer = require('inquirer');
const { execSync } = require('child_process');
var { logger } = require('./logger');
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
    {
      name: 'description',
      message: '请输入描述信息',
      type: 'input',
    },
  ]).then(({version, CustomVersion, description})=> {
    // execSync(`npm version ${version}`)  {version, CustomVersion, description}
    try {
      console.log(version, CustomVersion, description, execSync)
      logger.info('执行提交', version, 'end')
      // execSync(`npm version ${version}`)
      tag(version === 'CustomVersion' ? CustomVersion : version);
    } catch(e) {
      logger.error(e)
    }
  })
})();

function tag(version = 'patch') {
  return new Promise((res, rej) => {
    try {
      const data = execSync(`npm version ${version}`)
      logger.info(`版本号为: ${data}`)
      execSync('git add package.json')
      execSync("git commit -m 'Publish' ")
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

