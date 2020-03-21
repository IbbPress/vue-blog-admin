const qiniu = require('qiniu')
const glob = require('glob')
const mime = require('mime')
const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })

const isWindow = /^win/.test(process.platform)

let pre = path.resolve(__dirname, '../dist/') + (isWindow ? '\\' : '')

const files = glob.sync(
  `${path.join(
    __dirname,
    '../dist/**/*.?(js|css|map|png|jpg|svg|woff|woff2|ttf|eot)'
  )}`
)
pre = pre.replace(/\\/g, '/')

const options = {
  scope: process.env.QINIU_bucket // 空间对象名称 
}
const qiniu_config = {
  accessKey: process.env.QINIU_accessKey,
  secretKey: process.env.QINIU_secretKey,
  bucket: process.env.QINIU_bucket || 'static001',
  domain: process.env.QINIU_domain || 'http://static001.wencaizhang.com',
  zone: process.env.QINIU_zone || 'Zone_z0'
}

const mac = new qiniu.auth.digest.Mac(qiniu_config.accessKey, qiniu_config.secretKey)
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)
const cf = new qiniu.conf.Config({
  zone: qiniu.zone[qiniu_config.zone]
})
const formUploader = new qiniu.form_up.FormUploader(cf)

async function uploadFileCDN (files) {
  files.map(async file => {
    const key = getFileKey(pre, file)
    try {
      await uploadFIle(key, file)
      console.log(`上传成功 key: ${key}`)
    } catch (err) {
      console.log('error', err)
    }
  })
}

async function uploadFIle (key, localFile) {
  const extname = path.extname(localFile)
  const mimeName = mime.getType(extname)
  const putExtra = new qiniu.form_up.PutExtra({ mimeType: mimeName })
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, key, localFile, putExtra, function (
      respErr,
      respBody,
      respInfo
    ) {
      if (respErr) {
        reject(respErr)
      }
      resolve({ respBody, respInfo })
    })
  })
}

function getFileKey (pre, file) {
  if (file.includes(pre)) {
    const key = file.split(pre)[1]
    return key.startsWith('/') ? key.substring(1) : key
  }
  return file
}

(async () => {
  console.time('上传文件到cdn')
  console.log(qiniu_config);
  await uploadFileCDN(files)
  console.timeEnd('上传文件到cdn')
})()
