class DongptCore {
  constructor() {
    this.plugins = [];
  }

  registerPlugin(plugin) {
    this.plugins.push(plugin);
  }

  async run(context) {
    for (const plugin of this.plugins) {
      await plugin.execute(context);
    }
  }
}

module.exports = DongptCore;
