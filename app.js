// この CSV のデータから「2010 年から 2015 年にかけて 15〜19 歳の人が増えた割合の都道府県ランキング」を作成する
// 1.ファイルからデータを読み取る
// 2.2010 年と 2015 年のデータを選ぶ
// 3.都道府県ごとの変化率を計算する
//    「都道府県」と「集計データ」が関連付け
//    「集計データ」
//      ・2010年の人口の合計
//      ・2015年の人口の合計
//      ・計算された2015年の2010年に対する変化率
//     →連想配列とオブジェクトで表す
// 4.変化率ごとに並べる
// 5.並べられたものを表示する

'use strict';
const fs = require('fs'); // ファイルを扱うモジュール
const readline = require('readline'); // readline ファイルを一行ずつ読み込むためのモジュール
const rs = fs.ReadStream('./popu-pref.csv'); // ファイルの読み込みを行う Stream を生成する
const rl = readline.createInterface({ 'input': rs, 'output': {} }); //  rs を readline オブジェクトの input として設定し、 rl オブジェクトを作成する
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト

// 以下は、 rl オブジェクトで line というイベントが発生したら、この無名関数を呼んでくださいという意味のコード
rl.on('line', (lineString) => {
  // 2010年と2015年のデータから「集計年」「都道府県」「15~19歳の人口」を抜き出す
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[2];
  const popu = parseInt(columns[7]);
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture); // 連想配列 prefectureDataMap からデータを取得
    if (!value) { // value の値が Falsy の場合（= その県のデータを処理するのが初めてのとき）に 変数 value に初期値となるオブジェクトを代入
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if (year === 2010) {
      value.popu10 += popu; // value.popu10 ・・・連想配列の値である value オブジェクトのプロパティの一つ
    }
    if (year === 2015) {
      value.popu15 += popu;
    }
    prefectureDataMap.set(prefecture, value); // 連想配列に保存
  }
});
rl.resume(); // rl オブジェクトの resumeメソッドは、ストリームに情報を流し始める処理

rl.on('close', () => { // 'close' 全ての行を読み込み終わった際に呼び出されるイベント
  // 変化率の計算
  for (let [key, value] of prefectureDataMap) {
    value.change = value.popu15 / value.popu10;
  }
  // データの並び替え
  // Array.from(prefectureDataMap) で、連想配列を普通の配列に変換。更に、 Array の sort 関数を呼んで無名関数を渡す。
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  // 整形して出力 map関数に渡す無名関数に第2引数も書くと、各要素の添字を取得することができる
  const rankingString = rankingArray.map(([key, value],i) => {
    return  '第' + (i + 1) + '位 ' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
  });
  console.log(rankingString);
});


// オブジェクトのプロパティには値と関数をいれることができる。その中でも、オブジェクトのふるまいを作ることができる関数が設定されたプロパティのことをメッソドと呼ぶ

// Map 
// Map のオブジェクトの作成
//   var etoMap = new Map()

// データの追加
//   etoMap.set(キー, 値);

// データ(値)の取得
//   etoMap.get(キー);


// for-of構文・・・Map や Array の中身を of の前に与えられた変数に代入してfor ループを同じことができる。配列に含まれる要素を使いたいだけで、添字は不要な場合に便利。

// Map に for-of構文を使うと、キーと値で要素が2つある配列が前に与えられた変数に代入される。 
// 分割代入・・・const [変数名1, 変数名2] のように変数と一緒に配列を宣言することで、第一要素の key という変数にキーを、第二要素の value という変数に値を代入することができる。

// map 関数は、連想配列の Map とは別のもの。 Array の要素それぞれを、与えられた関数を適用した内容に変換するというもの。各要素に関数を適用し、新しい配列を作る。

