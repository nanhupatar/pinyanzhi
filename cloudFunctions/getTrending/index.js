// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  const trending = db.collection("trending");
  const skip = event.pageNum * 10;
  const trendingList = await trending
    .orderBy("score", "desc")
    .skip(skip)
    .limit(10)
    .get();
  return trendingList;
};
