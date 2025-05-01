const { getChatbotResponse } = require('../helpers/chatbot-helper')
const { getUser } = require('../helpers/auth-helper')
const crypto = require('crypto')

const chatbotServices = {
  getChatbot: async (req, callback) => {
    try {
      // 生產隨機uuid用於前端提交表單冪等鎖
      const uuid = crypto.randomUUID()

      // 取用自app.js綁定全域的redis client
      const client = req.app.locals.redisClient

      // 查找使用者對話歷史
      const userId = getUser(req).id
      const conversationHistoryRaw = await client.get(`user:${userId}:chat`)
      if (!conversationHistoryRaw) {
        return callback(null, { conversationHistory: {}, uuid })
      }

      // 轉換對話歷史為JSON格式
      const conversationHistory = JSON.parse(conversationHistoryRaw)
      return callback(null, { conversationHistory, uuid })
    } catch (err) {
      return callback(err)
    }
  },
  postChatbot: async (req, callback) => {
    try {
      const userId = getUser(req).id
      const { idempotencyKey } = req.body

      // 取用自app.js綁定全域的redis client
      const client = req.app.locals.redisClient

      // 驗證冪等鎖uuid
      if (!idempotencyKey) throw new Error('Invalid idempotency key')
      const isKeyExist = await client.get(`user:${userId}:idempotencyKey:${idempotencyKey}`)
      if (isKeyExist === 'done') throw new Error('Request already done, please refresh the page')
      if (isKeyExist === 'processing') throw new Error('Request is processing, please refresh the page')

      // 處理chatbot請求
      const chatbotResponseData = await getChatbotResponse(req)

      return callback(null, { conversationHistory: chatbotResponseData })
    } catch (err) {
      return callback(err)
    }
  }
}

module.exports = chatbotServices
