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

const S3FileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    if (file.location) return resolve(file.location)
    return reject(new Error('Failed to get file URL from S3'))
  })
}

module.exports = {
  localFileHandler,
  S3FileHandler
}
