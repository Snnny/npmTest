
const weblog = require('webpack-log');
const colors = require('colors');
const log = weblog({name:'yangtuo'});

exports.logger = {
  info(msg){
    log.info(`[Info] ${colors.green(msg)}`);
  },
  warn(msg){
    log.warn(`[Warn] ${colors.yellow(msg)}`);
  },
  error(msg){
    log.error(`[Error] ${colors.red(msg)}`);
  }
};
