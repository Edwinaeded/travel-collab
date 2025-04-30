const { getUser } = require('../helpers/auth-helper')
const OpenAI = require('openai')
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const getChatbotResponse = async (req, res) => {
  try {
    const userId = getUser(req).id

    // 取用自app.js綁定全域的redis client
    const client = req.app.locals.redisClient

    // 取得使用者對話歷史
    const conversationHistoryRaw = await client.get(`user:${userId}:chat`)
    let conversationHistory = conversationHistoryRaw ? JSON.parse(conversationHistoryRaw) : []

    // 初始化對話歷史
    const conversationInit = [
      { role: 'system', content: '你是專業旅遊景點推薦助手,你的任務是根據使用者提供的資訊（地點、天數、興趣、預算等）來規劃出合理且具吸引力的旅遊行程建議。請遵守以下規則1.你可以推薦世界上任何地方的旅程2.回答請簡潔明瞭，儘可能用條列方式呈現(例如:Day1、Day2、Day3)3.如果使用者需求不明確，請友善引導提供更多資訊4.若使用者需求不符合旅遊規劃範疇，請委婉將話題導回旅遊相關5.請表現的像朋友一般讓使用者感到輕鬆6.請在250字以內完整回答，避免突然中斷' }
    ]
    conversationHistory = conversationHistory.length > 0 ? conversationHistory : conversationInit

    // 控制對話歷史的長度，超過10次發問則丟出錯誤
    if (conversationHistory.length > 20) throw new Error('超過使用次數上限,請試著從先前的對話中安排行程吧!')

    // 將使用者輸入的訊息加入對話歷史
    conversationHistory.push({ role: 'user', content: req.body.messageInput })

    // 傳遞使用者輸入給機器人並獲得回答
    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [...conversationHistory],
      text: {
        format: {
          type: 'text'
        }
      },
      reasoning: {},
      tools: [],
      temperature: 1,
      max_output_tokens: 250,
      top_p: 1,
      store: true
    })

    // 將機器人回答加入對話歷史
    conversationHistory.push({ role: 'assistant', content: response.output_text })
    // 將對話歷史存入redis並設定過期時間為60分鐘
    await client.set(`user:${userId}:chat`, JSON.stringify(conversationHistory))
    await client.expire(`user:${userId}:chat`, 3600)

    return conversationHistory
  } catch (err) {
    console.error('Error in getChatbotResponse:', err.message)
    throw err
  }
}

module.exports = {
  getChatbotResponse
}
