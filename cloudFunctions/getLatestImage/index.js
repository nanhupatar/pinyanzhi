// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const db = cloud.database();
  const data = await db
    .collection("trending")
    .where({
      OPENID: wxContext.OPENID
    })
    .orderBy("timestamp", "desc")
    .limit(1)
    .get();
  return {
    data: data.data
  };
};
