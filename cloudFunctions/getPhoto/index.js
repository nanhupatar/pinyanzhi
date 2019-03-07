// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const db = cloud.database();
  const openid = wxContext.OPENID;
  const reportCollection = db.collection("report");

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID
  };
};
