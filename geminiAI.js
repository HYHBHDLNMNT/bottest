[file name]: geminiAI.js
[file content begin]
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { handleMining, handleBuilding } = require('../utils/missions');

module.exports = (bot, config) => {
  const genAI = new GoogleGenerativeAI(config.GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Hệ thống hội thoại
  const CHAT_PROMPT = `
    Bạn là trợ lý ảo trong Minecraft. Hãy:
    1. Phân tích câu hỏi/thông tin từ người chơi
    2. Trả lời tự nhiên như con người
    3. Kết hợp xử lý lệnh game khi cần

    Định dạng đầu ra (dùng 1 trong 2):
    A. Chỉ hội thoại: 
    { "mode": "chat", "response": "..." }

    B. Kết hợp lệnh: 
    { 
      "mode": "action", 
      "action": "mine/build", 
      "target": "block_name", 
      "quantity": number,
      "response": "..." 
    }

    Ví dụ:
    Câu: "Ê bot khỏe không?" → {"mode": "chat", "response": "Mình đang đào khoáng vật đây! Cần giúp gì không?"}
    Câu: "Kiếm 10 khối vàng đi" → {"mode": "action", "action": "mine", "target": "gold_ore", "quantity": 10, "response": "Đào ngay 10 khối vàng cho bạn!"}
  `;

  bot.on('chat', async (username, message) => {
    try {
      if (username === bot.username) return;

      // Tạo prompt động
      const fullPrompt = `${CHAT_PROMPT}\nCâu: "${message}"\n→ `;
      
      const result = await model.generateContent(fullPrompt);
      const rawResponse = await result.response.text();
      const cleanedResponse = rawResponse.replace(/```json/g, '').trim();

      try {
        const response = JSON.parse(cleanedResponse);

        // Xử lý hành động
        if (response.mode === 'action') {
          if (response.action === 'mine') handleMining(bot, response.target, response.quantity);
          if (response.action === 'build') handleBuilding(bot, response.target);
        }

        // Phản hồi tự nhiên
        if (response.response) {
          setTimeout(() => {
            bot.chat(response.response);
            
            // Thêm hiệu ứng hành động
            if (Math.random() > 0.5) bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
          }, 1000 + Math.random() * 2000); // Trễ ngẫu nhiên
        }

      } catch (e) {
        console.error('Lỗi parse:', cleanedResponse);
        bot.chat("❄️ Mình hơi lag, nói lại được không?");
      }

    } catch (error) {
      console.error('Lỗi AI:', error);
      bot.chat("⚡ Đang bị nhiễu sóng, thử lại nhé!");
    }
  });
};
[file content end]