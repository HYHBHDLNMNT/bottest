module.exports = {
  host: 'your.server.ip',
  port: 25565,
  username: 'UltimateBot',
  version: '1.20.1',
  auth: 'offline',
  
  GEMINI_KEY: 'your-api-key',
  
  PVP: {
    attackRange: 3.2,
    comboDelay: 120,
    pursuitDistance: 30,
    criticalChance: 0.35,
    dodgeRate: 0.7,
    smartPathfinding: true
  },

  WEAPON_PRIORITY: [
    'netherite_sword',
    'diamond_sword', 
    'axe',
    'bow'
  ],

    DREAM_MODE: {
    MINING_PRIORITY: ['diamond', 'ancient_debris'],
    ESCAPE_ITEMS: ['ender_pearl', 'water_bucket']
  },

  AUTO_RECONNECT: true,
  MAX_MINING: 50
};