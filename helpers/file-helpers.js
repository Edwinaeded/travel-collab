const fs = require('fs')

const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    const fileStoragePath = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileStoragePath, data))
      .then(() => resolve(`/${fileStoragePath}`))
      .catch(err => reject(err))
  })
}

module.exports = {
  localFileHandler
}
