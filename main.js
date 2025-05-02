const config = require('./config/config');
const BotCore = require('./core/bot');

const bot = new BotCore(config);

// Xử lý lỗi
bot.bot.on('error', err => {
  console.log('❌ Lỗi:', err.message);
  if (config.AUTO_RECONNECT) setTimeout(() => new BotCore(config), 5000);
});

// Thông báo spawn
bot.bot.on('spawn', () => {
  console.log('✅ Đã vào game!');
  bot.bot.chat('/accepteraules'); // Tự động accept rules nếu server yêu cầu
});