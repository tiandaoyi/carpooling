const pluginName = 'FileListWebpackPlugin';

class FileListWebpackPlugin {
  constructor(options = {}) {
    this.filename = options.filename || 'fileList.md'
  }

  apply(compiler) {
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('webpack 构建正在启动！');
    });
    compiler.hooks.emit.tapAsync(pluginName, (compilation, cb) => {
      const fileListName = this.filename;
      const len = Object.keys(compilation.assets).length;
      let content = `# 一共有${len}个文件\n\n`;
      for (const filename in compilation.assets) {
        content += `- ${filename}\n`
      }
      compilation.assets[fileListName] = {
        source: function () {
          return content;
        },
        size: function () {
          return content.length;
        }
      }
      cb();
    });
  }
}

module.exports = FileListWebpackPlugin;
