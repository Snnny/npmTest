var inquirer = require('inquirer');
const { execSync } = require('child_process');
var { logger } = require('./logger');
(() => {
  // let data = execSync(`git tag --sort=-v:refname`)
  // .toString()
  // .split('\n')
  // .filter(_=> _!== '')
  inquirer.prompt([
    {
      name: 'version',
      type: 'list',
      message: '版本号',
      choices: ['major', 'minor', 'patch'],
    },
    {
      name: 'description',
      message: '请输入描述信息',
      type: 'input',
    },
  ]).then(({version, description})=> {
    execSync(`git commit -a -m '${description}' `)
    let data =  execSync(`npm version ${version}`)
    execSync(`git push origin ${data}`)
    execSync('git push')
  })
})();

function tag(version = 'patch', description, isClean) {
  return new Promise((res, rej) => {
    let data
    try {
      if(isClean) {
        data = execSync(`npm version ${version}`)
        logger.info(`版本号为: ${data}`)
      } else {
        execSync('git add .')
        execSync(`git commit -m '${description}' `)
        data = execSync(`npm version ${version}`)
      }
      execSync(`git push origin ${data}`)
      execSync('git push')
      res(data)
    } catch (error) {
      logger.error(error)
      rej(error)
    }
  })
}

function isClean() {
  return new Promise((resolve, reject) => {
    let status = execSync('git status').toString();
    if (status.indexOf('working tree clean') > -1) {
      console.log('\x1B[32m%s\x1b[0m', 'nothing to commit, working tree clean');
      resolve(true);
    } else {
      resolve(false);
    }
  });
}

