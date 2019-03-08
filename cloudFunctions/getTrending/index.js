// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  const trending = db.collection("trending");
  const pageSize = event.pageSize;
  const pageNum = event.pageNum;
  const skip = (pageNum - 1) * 10;
  const count = await trending.count();
  const trendingList = await trending
    .orderBy("score", "desc")
    .skip(skip)
    .limit(pageSize)
    .get();

  return {
    totalPage: Math.ceil(count.total / pageSize),
    data: trendingList.data,
    pageNum: pageNum
  };
};
