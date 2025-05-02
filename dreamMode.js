module.exports = (bot) => {
  let missionActive = false;
  const missions = [
    { type: 'mine', target: 'diamond_ore', amount: 3 },
    { type: 'kill', target: 'zombie', amount: 5 },
    { type: 'build', structure: 'house' }
  ];

  bot.on('chat', (username, message) => {
    if (message === '!dream') {
      missionActive = !missionActive;
      bot.chat(missionActive ? '🌀 Bắt đầu thử thách Dream!' : '🌙 Kết thúc phiên đấu');
      if (missionActive) startRandomMission();
    }
  });

  const startRandomMission = () => {
    const mission = missions[Math.floor(Math.random() * missions.length)];
    bot.chat(`🎯 Nhiệm vụ: ${mission.type} ${mission.target || mission.structure} x${mission.amount || ''}`);
    
    switch(mission.type) {
      case 'mine':
        bot.on('blockUpdate', (oldBlock, newBlock) => {
          if (newBlock.name.includes(mission.target)) handleMining();
        });
        break;
    }
  };
};