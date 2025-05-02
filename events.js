module.exports = (bot) => {
  // Xử lý sự kiện spawn
  bot.on('spawn', () => {
    console.log('🚀 Bot đã vào thế giới!');
    bot.chat('/accepteraules'); // Tự động accept rules
  });

  // Xử lý sự kiện death
  bot.on('death', () => {
    console.log('💀 Bot đã chết, đang hồi sinh...');
    bot.chat('/respawn');
  });

  // Log lỗi
  bot.on('error', err => {
    console.error('❌ LỖI HỆ THỐNG:', err.message);
  });
};