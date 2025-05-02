module.exports = (bot) => {
  let isBuildingShelter = false;

  // Tự động xây nhà khi trời tối
  bot.on('time', () => {
    if (bot.time.timeOfDay > 13000 && !isBuildingShelter) {
      isBuildingShelter = true;
      bot.chat("🌙 Trời tối rồi, xây nhà thôi!");
      const blueprint = [
        [0,0,0, 'oak_log'], [1,0,0, 'oak_log'], 
        [0,1,0, 'glass'], [1,1,0, 'glass']
      ];
      blueprint.forEach(([x,y,z,block]) => {
        const pos = bot.entity.position.offset(x, y, z);
        bot.placeBlock(pos, block);
      });
      isBuildingShelter = false;
    }
  });

  // Thu thập tài nguyên khẩn cấp
  const collectEssentials = () => {
    const materials = ['oak_log', 'cobblestone', 'apple'];
    materials.forEach(mat => {
      const block = bot.findBlock({ matching: mat, maxDistance: 32 });
      if (block) bot.dig(block);
    });
  };

  // Kích hoạt khi máu thấp
  bot.on('health', () => {
    if (bot.food < 15) collectEssentials();
  });

  // Dream-style parkour tránh mob
  bot.on('entitySpawn', (entity) => {
    if (entity.name === 'creeper') {
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('sprint', true);
        bot.lookAt(entity.position);
      }, 500);
    }
  });
};