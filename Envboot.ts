
/**
 * 注意这里引入的依赖（包括间接依赖）需要可控收敛
 */
// import { reportOpenApp } from "./GameCore/EnvBoot/ReportOpenApp";

declare const require;
declare const GameGlobal;
require("./weapp-adapter.js")

window['requireAbs'] = function (filePath) {
    return require(filePath);
};

// let isFistTime = true;
// // 微信广告，需要一开始就注册onShow，延后的话会错过首次进入游戏的回调
// (wx as any).onShow((res)=>{
//     GameGlobal.lastOnShowParams = res;

//     if(isFistTime){
//         reportOpenApp();
//     }

//     isFistTime = false;
// });
