// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  const openid = wxContext.OPENID;
  const trending = db.collection("trending");
  const pageSize = event.pageSize;
  const pageNum = event.pageNum;
  const skip = (pageNum - 1) * 10;
  const count = await trending.count();
  const data = await trending.where({
    OPENID:openid
  }).skip(skip).limit(pageSize).orderBy('timestamps', "desc").get();

  return {
    data:data.data,
    totalPage: Math.ceil(count.total / pageSize),
    pageNum:pageNum
  };
};
