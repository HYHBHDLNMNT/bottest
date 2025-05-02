const mineflayer = require('mineflayer');
const pathfinder = require('mineflayer-pathfinder');
const { Movements, goals } = require('mineflayer-pathfinder');
const minecraftData = require('minecraft-data'); // Thêm dòng này

class BotCore {
  constructor(config) {
    this.bot = mineflayer.createBot(config);
    this.config = config;
    this.loadCore();
    this.loadPlugins();
    console.log('✅ Bot initialized!');
  }

  loadCore() {
    this.bot.loadPlugin(pathfinder.pathfinder);

    // ĐỢI BOT XÁC ĐỊNH VERSION TRƯỚC KHI LẤY mcData
    this.bot.once('login', () => {
      const mcData = minecraftData(this.bot.version); // Sửa ở đây
      this.bot.movements = new Movements(this.bot, mcData);
      this.bot.goals = goals;
      console.log('🧩 Pathfinder loaded');
    });
  }

  loadPlugins() {
    // Load các plugin custom
    require('../plugins/pvpMaster')(this.bot, this.config);
    require('../plugins/geminiAI')(this.bot, this.config);
    require('../plugins/autoFarmer')(this.bot);
    require('../plugins/survival')(this.bot);
    
    console.log('🔌 Plugins loaded:', 
      ['pvpMaster', 'geminiAI', 'autoFarmer', 'survival'].join(', ')
    );
  }
}

module.exports = BotCore;