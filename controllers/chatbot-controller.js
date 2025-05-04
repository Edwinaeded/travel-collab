const chatbotServices = require('../services/chatbot-services')

const chatbotController = {
  getChatbot: (req, res, next) => {
    chatbotServices.getChatbot(req, (err, data) => {
      if (err) return next(err)
      return res.render('AI-chatbot', data)
    })
  },
  postChatbot: (req, res, next) => {
    chatbotServices.postChatbot(req, (err, data) => {
      if (err) return next(err)
      return res.redirect('/chatbot')
    })
  }
}

module.exports = chatbotController
