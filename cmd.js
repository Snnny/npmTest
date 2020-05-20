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

    isClean()
    .then(clean => {
      console.log(clean)
      // try {
      //   console.log(version, CustomVersion, description, execSync)
      //   logger.info('执行提交', version, 'end')
      //   // execSync(`npm version ${version}`)
        tag(version === 'CustomVersion' ? CustomVersion : version, description, clean);
      // } catch(e) {
      //   logger.error(e)
      // }
    })
    // execSync(`npm version ${version}`)  {version, CustomVersion, description}
  
  })
})();

function tag(version = 'patch', description, isClean) {
  console.log('clean', isClean)
  return new Promise((res, rej) => {
    let data
    try {
      
      // execSync('git add .')
      // execSync(`git commit -m '${description}' `)
      // data = execSync(`npm version ${version}`)
      // logger.info(`版本号为: ${data}`)
      // execSync(`git push origin ${data}`)
      // execSync('git push')

    

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
    // console.log('检查代码更新', status)
    if (status.indexOf('working tree clean') > -1) {
      console.log('\x1B[32m%s\x1b[0m', 'nothing to commit, working tree clean');
      resolve(true);
    } else {
      resolve(false);
    }
  });
}

