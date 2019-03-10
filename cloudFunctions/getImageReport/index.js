// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  const fileId = event.fileId;
  const data = await db.collection('trending').where({
    fileId: fileId
  }).limit(1).get();
  return {
    data: data.data
  }
}