const chalk = require("chalk");// 变色
// const webpack = require("webpack");
const ProgressPlugin = require("webpack").ProgressPlugin;// 获取编译状态
const BLOCK_CHAR = "\u2588"; // 文字块
const ansiEscapes = require('ansi-escapes');
const wrapAnsi = require('wrap-ansi');
let running = false;

// 开始时间
let startTime;
// node输出流
const stream = process.stderr;
// 标准颜色
const colorize = (color) => {
  if (color[0] === "#") {
    return chalk.hex(color);
  }
  return chalk[color] || chalk.keyword(color);
};
 
const originalWrite = Symbol("webpackbarWrite");
// 单行输出log
class LogUpdate {
  constructor() {
    // 记录已输出的行数 用于清除
    this.prevLineCount = 0;
    this.listening = false;
    this.extraLines = "";
    this._onData = this._onData.bind(this);
    this._streams = [process.stdout, process.stderr];
  }
  render(lines) {
    this.listen();
    const wrappedLines = wrapAnsi(lines, this.columns, {
      trim: false,
      hard: true,
      wordWrap: false
    });
    const data = ansiEscapes.eraseLines(this.prevLineCount) + wrappedLines + "\n" + this.extraLines;
    this.write(data);
    this.prevLineCount = data.split("\n").length;
  }
  get columns() {
    return (process.stderr.columns || 80) - 2;
  }
  write(data) {
    const stream = process.stderr;
    // 如果存在被保存的上个输出流 继续用其输出
    if (stream.write[originalWrite]) {
      stream.write[originalWrite].call(stream, data, "utf-8");
    } else {
      stream.write(data, "utf-8");
    }
  }
  clear() {
    this.done();
    this.write(ansiEscapes.eraseLines(this.prevLineCount));
  }
  done() {
    this.stopListen();
    this.prevLineCount = 0;
    this.extraLines = "";
  }
  _onData(data) {
    const str = String(data);
    const lines = str.split("\n").length - 1;
    if (lines > 0) {
      this.prevLineCount += lines;
      this.extraLines += data;
    }
  }
  listen() {
    if (this.listening) {
      return;
    }
    for (const stream of this._streams) {
      if (stream.write[originalWrite]) {
        continue;
      }
      const write = (data, ...args) => {
        if (!stream.write[originalWrite]) {
          return stream.write(data, ...args);
        }
        this._onData(data);
        return stream.write[originalWrite].call(stream, data, ...args);
      };
      write[originalWrite] = stream.write;
      stream.write = write;
    }
    this.listening = true;
  }
  stopListen() {
    for (const stream of this._streams) {
      if (stream.write[originalWrite]) {
        stream.write = stream.write[originalWrite];
      }
    }
    this.listening = false;
  }
}
const logUpdate = new LogUpdate();
class BarPlugin extends ProgressPlugin {
  constructor(options={}) {
    
    super({ activeModules: true });
 
    this.color = colorize(options.color || "#65f3ba");
    
    this.length = options.length || 30;
    
    const bg = chalk.white(BLOCK_CHAR);

    const fg =this.color(BLOCK_CHAR);


    this.handler = (percent, message) => {

      if(!running){
        startTime = new Date;
        running = true
      }

      const len = this.length;
      
      const w = Math.floor(percent * len);
      
      const barText = [...Array(len).keys()].map((i) => (i < w ? fg : bg)).join("");

      const cmdText = chalk.yellow("编译进度") + 
                      chalk.green((100 * percent).toFixed(2) + "% ") +
                      barText + 
                      (message?chalk.yellow("编译状态") + chalk.blue(message):'');
      
      logUpdate.render("\n" + cmdText + "\n")

      if(percent == 1){
        const buildTime = (new Date - startTime) / 1000 + 's';
        stream.write('\n'+chalk.blue.bold('编译完成,总共花费' + buildTime + '\n\n'));
      }
    };
  }
}

module.exports = BarPlugin;
