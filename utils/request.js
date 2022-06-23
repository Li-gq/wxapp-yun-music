// 封装发送ajax请求的功能函数

/* 
  1. 封装功能函数
    1）功能点明确
    2）函数内部要保留固定的代码（静态代码）
    3）将动态的数据抽取出来，由使用者提供最终的数据，以参数的形式提取
    4) 一个良好的功能函数应该设置形参的默认值
  2. 封装功能组件
    1）功能点明确
    2）组件内部应保留静态代码
    3）将动态的数据提取成props参数，由使用者提供的最终数据
    4）一个良好的组件应该设置组件props数据的必要性和数据类型
*/
import config from "./config";

export default (url, data={},method="GET")=>{
  return new Promise((resolve, reject)=>{
    wx.request({
      url: config.host + url,
      data,
      method,
      header:{
        cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1):""
      },
      success:(res)=>{
        
        // 如果是登录请求，保存请求回来的token
        if(data.isLogin){
          wx.setStorageSync('cookies', res.cookies?res.cookies:"");
        }
        resolve(res.data);
      },
      fail: (err)=>{
        reject(err);
      }
    });
  });
};


