[file name]: plugins/pvpMaster.js
[file content begin]
const { GoalNear } = require('mineflayer-pathfinder');
const CombatUtils = require('../utils/combat');

module.exports = (bot, config) => {
    let combatMode = false;
    let currentTarget = null;

    // ========== LỆNH CHAT CONTROL ==========
    bot.on('chat', (username, message) => {
        const args = message.split(' ');
        
        // Lệnh toggle PVP mode
        if (message.toLowerCase() === '!pvp') {
            combatMode = !combatMode;
            const status = combatMode 
                ? `⚔️ [PVP MODE] GODLIKE ACTIVATED!` 
                : `🔇 [PVP MODE] Đã tắt cực phẩm đấu sĩ`;
            bot.chat(status);
            return;
        }

        // Lệnh tấn công thủ công
        if (args[0] === '!attack') {
            const targetName = args[1];
            currentTarget = CombatUtils.findTargetPlayer(bot, targetName);
            
            if (currentTarget) {
                bot.chat(`🔥 Locking target: ${targetName}`);
                CombatUtils.executeCombo(bot, currentTarget, config.PVP);
            } else {
                bot.chat(`❌ Target ${targetName} not found`);
            }
        }

        // Lệnh dừng tấn công
        if (message === '!stopattack') {
            currentTarget = null;
            CombatUtils.clearTarget(bot);
            bot.chat('🛑 Đã reset mục tiêu');
        }
    });

    // ========== AI TỰ ĐỘNG CHIẾN ĐẤU ==========
    bot.on('physicTick', () => {
        if (!combatMode) return;

        // Tìm mục tiêu ưu tiên
        const targets = Object.values(bot.entities).filter(e => 
            e.type === 'player' && 
            e.username !== bot.username &&
            e.position.distanceTo(bot.entity.position) < 20
        );

        if (targets.length > 0) {
            // Logic chọn mục tiêu thông minh
            const priorityTarget = targets.sort((a, b) => {
                const aDistance = a.position.distanceTo(bot.entity.position);
                const bDistance = b.position.distanceTo(bot.entity.position);
                return (a.health * 0.7 + aDistance * 0.3) - (b.health * 0.7 + bDistance * 0.3);
            })[0];

            // Auto-switch vũ khí
            const bestWeapon = bot.inventory.items()
                .filter(item => config.WEAPON_PRIORITY.some(name => item.name.includes(name)))
                .sort((a, b) => config.WEAPON_PRIORITY.indexOf(a.name) - config.WEAPON_PRIORITY.indexOf(b.name))[0];

            if (bestWeapon) bot.equip(bestWeapon, 'hand');

            // Update target và thực hiện combo
            currentTarget = priorityTarget;
            CombatUtils.executeCombo(bot, priorityTarget, {
                ...config.PVP,
                attackRange: bot.heldItem?.attackRange || 3.5
            });

            // Giữ khoảng cách tối ưu
            const idealDistance = bot.heldItem?.name.includes('bow') ? 8 : 3;
            if (priorityTarget.position.distanceTo(bot.entity.position) > idealDistance) {
                bot.pathfinder.setGoal(new GoalNear(
                    priorityTarget.position.x,
                    priorityTarget.position.y,
                    priorityTarget.position.z,
                    idealDistance
                ));
            }
        }
    });

    // ========== KÍCH HOẠT CƠ CHẾ PHÒNG THỦ ==========
    CombatUtils.blockMechanics(bot);
};
[file content end]