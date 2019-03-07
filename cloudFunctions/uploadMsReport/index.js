// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let data = event;
  data.timestamp = new Date().getTime();
  const db = cloud.database();
  const report = await db.collection("report").add({ data: data });
  const trending = await db.collection("trending").add({ data: data });
  return trending;
};
