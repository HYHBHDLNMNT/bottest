function handleMining(bot, blockType, quantity = 1) {
  const block = bot.findBlock({
    matching: block => block.name.includes(blockType),
    maxDistance: 64
  });
  
  if (block) {
    bot.dig(block, true, () => {
      if (quantity > 1) handleMining(bot, blockType, quantity - 1);
    });
  }
}

function handleBuilding(bot, structure) {
  const blueprints = {
    house: [
      [0, 0, 0, 'oak_planks'],
      [1, 0, 0, 'oak_planks']
    ]
  };

  blueprints[structure]?.forEach(([x, y, z, block]) => {
    const pos = bot.entity.position.offset(x, y, z);
    bot.placeBlock(pos, block);
  });
}

module.exports = { handleMining, handleBuilding };