// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const id = event.id;
  const db = cloud.database();
  const trending = db.collection("trending");
  const data = await trending.doc(id).remove();
  return {
    data:data
  }
}