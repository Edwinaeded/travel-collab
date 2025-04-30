const { getChatbotResponse } = require('../helpers/chatbot-helper')
const { getUser } = require('../helpers/auth-helper')

const chatbotServices = {
  getChatbot: async (req, callback) => {
    try {
      // 取用自app.js綁定全域的redis client
      const client = req.app.locals.redisClient

      // 查找使用者對話歷史
      const userId = getUser(req).id
      const conversationHistoryRaw = await client.get(`user:${userId}:chat`)
      if (!conversationHistoryRaw) {
        return callback(null, { conversationHistory: {} })
      }

      // 轉換對話歷史為JSON格式
      const conversationHistory = JSON.parse(conversationHistoryRaw)
      return callback(null, { conversationHistory })
    } catch (err) {
      return callback(err)
    }
  },
  postChatbot: async (req, callback) => {
    try {
      const chatbotResponseData = await getChatbotResponse(req)
      return callback(null, { conversationHistory: chatbotResponseData })
    } catch (err) {
      return callback(err)
    }
  }
}

module.exports = chatbotServices
