[file name]: combat.js
[file content begin]
const vec3 = require('vec3');
const { Movements, goals } = require('mineflayer-pathfinder');

const CombatUtils = {
  // ... Các hàm hiện có giữ nguyên ...

  // TĂNG TỐC TẤN CÔNG
  executeCombo: function(bot, target, config) {
    if (!target || !target.isValid) return;

    // TỐI ƯU DI CHUYỂN KIỂU STRAFING
    const circleRadius = 2 + Math.random() * 1.5;
    const angle = Date.now() / 100 % (2 * Math.PI);
    const circlePos = new vec3(
      target.position.x + circleRadius * Math.cos(angle),
      target.position.y,
      target.position.z + circleRadius * Math.sin(angle)
    );

    bot.pathfinder.setGoal(new goals.GoalNear(circlePos.x, circlePos.y, circlePos.z, 0.1));

    // SMART COMBO TÙY MÁU ĐỊCH
    const enemyHealth = target.health;
    let comboPattern = [];

    if (enemyHealth > 15) {
      comboPattern = ['critical', 'knockback', 'arrow_spam', 'jump_attack'];
    } else {
      comboPattern = ['jump_attack', 'critical', 'critical', 'knockback'];
    }

    // THÊM DELAY TINH VI GIỮA CÁC ĐÒN
    const attackDelays = this.calculateDynamicDelays(target.position.distanceTo(bot.entity.position));
    
    comboPattern.forEach((attackType, index) => {
      setTimeout(() => {
        if (!target.isValid) return;
        this.performAttack(bot, attackType, target);
        
        // TỰ ĐỘNG NÉ TRÁNH SAU ĐÒN
        if (index % 2 === 0) this.dodgeProjectile(bot);
      }, attackDelays[index]);
    });

    // TỰ ĐỘNG BUFF
    this.autoBuff(bot);
  },

  // THUẬT TOÁN TÍNH DELAY THÔNG MINH
  calculateDynamicDelays: (distance) => {
    const baseDelay = 150;
    return [
      baseDelay * 0.8,
      baseDelay * 1.2 - distance * 10,
      baseDelay * 0.5,
      baseDelay * 1.5
    ];
  },

  // KỸ THUẬT NÉ ĐÒN CAO CẤP
  dodgeProjectile: (bot) => {
    const nearbyProjectiles = bot.entities.filter(e => 
      e.objectType === 'Projectile' && 
      e.position.distanceTo(bot.entity.position) < 5
    );

    nearbyProjectiles.forEach(proj => {
      const dodgeVector = bot.entity.position.minus(proj.position).normalize();
      bot.lookAt(proj.position);
      bot.setControlState('back', true);
      setTimeout(() => bot.setControlState('back', false), 200);
    });
  },

  // HỆ THỐNG BUFF TỰ ĐỘNG
  autoBuff: (bot) => {
    const buffPriority = [
      {name: 'strength_potion', effect: 'strength'},
      {name: 'speed_potion', effect: 'speed'},
      {name: 'golden_apple', effect: 'absorption'}
    ];

    buffPriority.forEach(item => {
      if (!bot.hasEffect(item.effect)) {
        const potion = bot.inventory.items().find(i => i.name.includes(item.name));
        if (potion) {
          bot.equip(potion, 'hand');
          bot.consume();
        }
      }
    });
  },

  // THÊM KỸ NĂNG BLOCK
  blockMechanics: (bot) => {
    bot.on('entityHurt', (entity) => {
      if (entity === bot.entity && bot.heldItem?.name.includes('shield')) {
        bot.deactivateItem();
        setTimeout(() => bot.activateItem(), 500); // PARRIES
      }
    });
  }
};

module.exports = CombatUtils;
[file content end]