const multer = require('multer')
const multerS3 = require('multer-s3')

const { S3Client } = require('@aws-sdk/client-s3')
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
})

const isProduction = process.env.NODE_ENV === 'production'

const upload = isProduction
  ? multer({
    storage: multerS3({
      s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname })
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    })
  })
  : multer({ dest: 'temp/' })

module.exports = upload
