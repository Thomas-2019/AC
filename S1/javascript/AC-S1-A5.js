;(function() {
  "use strict"
  // 設計變數
  let tigerWinCount = 0 //虎哥贏初始值
  let bearWinCount = 0 //熊弟贏初始值

  let countMax = 10 //最大局數初始值
  let countTotal = 1 //局數初始值
  // 跑 10 局
  // write your code
  // 輸流擲骰子
  console.log(`------比賽開始------`)
  //先跑十次
  while (countTotal <= countMax) {
    let tiger = Math.floor(Math.random() * 6) + 1 //自動產生亂數 1~6
    let bear = Math.floor(Math.random() * 6) + 1 //自動產生亂數 1~6

    if (tiger > bear) {
      console.log(
        `第${countTotal}局 | 虎哥點數:${tiger} Vs 熊弟點數:${bear} | 虎哥贏 1 局`
      )
      tigerWinCount++ //贏一局加1
    } else if (bear > tiger) {
      console.log(
        `第${countTotal}局 | 虎哥點數:${tiger} Vs 熊弟點數:${bear} | 熊弟贏 1 局`
      )
      bearWinCount++ //贏一局加1
    } else {
      console.log(
        `第${countTotal}局 | 虎哥點數:${tiger} Vs 熊弟點數:${bear} | 平局`
      )
    }
    //1.如果跑完十次之後第一次由countTotal === 10,進入if-else
    //2.第二次之後由countMax > 10,進入if-else
    if (countTotal === 10 || countMax > 10) {
      //如果bearWinCount !== tigerWinCount等於false=>執行countMax++
      if (bearWinCount !== tigerWinCount) {
        //如果bearWinCount !== tigerWinCount等於true=>計算輸贏，並輸出結果

        // 計算當局輸贏，並輸出結果
        // 輸出摘要
        console.log("--- 結果 ---")
        console.log(`熊弟贏 ${bearWinCount} 局`)
        console.log(`虎哥贏 ${tigerWinCount} 局`)
        // 宣布最終勝利者
        // write your code
        console.log("------------")
        console.log(`宣布勝利者`)
        if (bearWinCount > tigerWinCount) {
          console.log("熊弟贏~")
        } else if (bearWinCount < tigerWinCount) {
          console.log("虎哥贏~")
        } else {
          consoleconsole.log(`程式錯誤,GAMEOVER`) //正常不會跑到這
        }
      } else {
        countMax++ //如果bearWinCount !== tigerWinCount等於false執行
      }
    }
    countTotal++ //每次執行
  }
})()
