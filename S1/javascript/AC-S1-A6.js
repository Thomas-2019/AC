"use strict"
// 設計變數
let players = [
  { name: "虎哥", win: 0, lose: 0, draw: 0 },
  { name: "熊弟", win: 0, lose: 0, draw: 0 }
]
// write your code here

let countMax = 10
let countTotal = 1 //局數初始值
// 跑 10 局
// write your code
// 輸流擲骰子
while (countTotal <= countMax) {
  let tiger = Math.floor(Math.random() * 6) + 1 //自動產生亂數 1~6
  let bear = Math.floor(Math.random() * 6) + 1 //自動產生亂數 1~6

  if (tiger > bear) {
    players[0]["win"]++ //贏一局加1
    players[1]["lose"]++ //輸一局加1
  } else if (bear > tiger) {
    players[1]["win"]++ //贏一局加1
    players[0]["lose"]++ //輸一局加1
  } else {
    players[0]["draw"]++ //平局加1
    players[1]["draw"]++ //平局加1
  }
  if (countTotal === 10 || countMax > 10) {
    if (players[0]["win"] !== players[1]["win"]) {
      // 計算當局輸贏，並輸出結果

      // 輸出摘要
      console.log("--- 結果 ---")
      for (let i = 0; i < players.length; i++) {
        console.log(
          `${players[i]["name"]}:贏 ${players[i]["win"]} 局,輸:${players[i]["lose"]} 局,平局:${players[i]["draw"]} 局`
        )
      }
      // 宣布最終勝利者
      // write your code
      console.log("------------")
      console.log(`宣布勝利者`)
      if (players[1]["win"] < players[0]["win"]) {
        console.log(`虎哥贏`)
      } else if (players[1]["win"] > players[0]["win"]) {
        console.log(`熊弟贏`)
      } else {
        console.log(`程式錯誤,GAMEOVER`) //正常不會跑到這
      }
    } else {
      countMax++
    }
  }
  countTotal++ //局數計數器
}
