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
      try {
        console.log(version, CustomVersion, description, execSync)
        logger.info('执行提交', version, 'end')
        // execSync(`npm version ${version}`)
        tag(version === 'CustomVersion' ? CustomVersion : version, description, clean);
      } catch(e) {
        logger.error(e)
      }
    })
    // execSync(`npm version ${version}`)  {version, CustomVersion, description}
  
  })
})();

function tag(version = 'patch', description, isClean) {
  console.log('clean', isClean)
  return new Promise((res, rej) => {
    try {
     
      // execSync(`git tag -a ${data} -m "${description}" `)
      // execSync(`git push origi n --tags`)
      let data
      // 未提交直接运行
      if (isClean) {
        data = execSync(`npm version ${version}`)
        logger.info(`版本号为: ${data}`)
        execSync(`git push origin ${data}`)
        execSync('git push')
      } else {
        execSync('git add .')
        execSync(`git commit -m '${description}' `)
        data = execSync(`npm version ${version}`)
        logger.info(`版本号为: ${data}`)
        execSync(`git push origin ${data}`)
        execSync('git push')
      }
    

      // 提交之后更新


      // execSync('git add .')
      // execSync('git status')
      // execSync("git commit -m 'Publish' ")
      // execSync(`git tag ${data}`)
      // execSync(`git push origin ${data}`)
      // execSync('git push')
      res(data)
    } catch (error) {
      logger.error(error)
      rej(error)
    }
  })
}

function isClean() {
  return new Promise((resolve, reject) => {
    let status = execSync('git status');
    if (status.find(item => /working tree clean/.test(item))) {
      console.log('\x1B[32m%s\x1b[0m', 'nothing to commit, working tree clean');
      resolve(true);
    } else {
      resolve(false);
    }
  });
}

