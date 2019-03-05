// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let data = event;
  data.timestamp = new Date().getTime();

  const db = cloud.database();
  const trending = db.collection("report");
  return trending.add({ data: data });
};
