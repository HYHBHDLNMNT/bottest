module.exports = (bot) => {
  let isFarming = false;
  const crops = ['wheat', 'carrots', 'potatoes'];

  bot.on('chat', (username, message) => {
    if (message === '!farm') {
      isFarming = !isFarming;
      bot.chat(isFarming ? '🌱 Bắt đầu farm...' : '🛑 Dừng farm');
    }
  });

  bot.on('physicTick', async () => {
    if (!isFarming) return;

    const matureCrop = bot.findBlock({
      matching: block => crops.includes(block.name),
      maxDistance: 16,
      maturity: 0.7
    });

    if (matureCrop) {
      await bot.dig(matureCrop);
      const seeds = bot.inventory.items().find(i => i.name.includes('seeds'));
      if (seeds) await bot.placeBlock(matureCrop);
    }
  });
};