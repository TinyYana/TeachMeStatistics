export interface ConceptNode {
  id: string;
  title: string;
  solves: string;
  prerequisites: string[];
  questionTypes: string[];
  nextRelation: string;
}

export interface ConceptGroup {
  title: string;
  concepts: ConceptNode[];
}

export const conceptGroups: ConceptGroup[] = [
  {
    title: "描述統計",
    concepts: [
      {
        id: "mean",
        title: "平均數",
        solves: "找出一組資料的中心位置，回答「整體大概在哪裡」。",
        prerequisites: ["加總", "資料個數"],
        questionTypes: ["平均成績", "平均花費", "一組數字的代表值"],
        nextRelation: "平均數會變成變異數與標準差的基準點。"
      },
      {
        id: "median",
        title: "中位數",
        solves: "資料排序後找中間位置，降低極端值對中心判斷的影響。",
        prerequisites: ["排序", "奇偶筆數"],
        questionTypes: ["薪資中位數", "房價中位數", "有極端值的資料"],
        nextRelation: "中位數幫你和平均數一起判斷資料是否偏斜。"
      },
      {
        id: "mode",
        title: "眾數",
        solves: "找出最常出現的值，回答「哪個結果最常見」。",
        prerequisites: ["次數統計"],
        questionTypes: ["最常見尺碼", "最常出現分數", "類別資料"],
        nextRelation: "眾數會接到次數分配與圖表判讀。"
      },
      {
        id: "range",
        title: "全距",
        solves: "用最大值減最小值，快速看資料跨度。",
        prerequisites: ["最大值", "最小值"],
        questionTypes: ["資料跨度", "最高與最低差多少"],
        nextRelation: "全距很快，但下一步通常要用標準差看所有資料點。"
      },
      {
        id: "variance",
        title: "變異數",
        solves: "把每筆資料離平均的距離平方後平均，描述分散程度。",
        prerequisites: ["平均數", "離均差", "平方"],
        questionTypes: ["資料分散", "樣本變異數", "母體變異數"],
        nextRelation: "標準差就是變異數開根號，單位會回到原資料。"
      },
      {
        id: "standard-deviation",
        title: "標準差",
        solves: "用原資料單位描述資料通常離平均數大約多遠。",
        prerequisites: ["平均數", "變異數", "平方根"],
        questionTypes: ["資料穩不穩", "分數離平均多遠", "常態分配的寬窄"],
        nextRelation: "標準差會直接進入 Z 分數與信賴區間。"
      }
    ]
  },
  {
    title: "機率",
    concepts: [
      {
        id: "sample-space",
        title: "樣本空間",
        solves: "列出所有可能結果，先確認分母是什麼。",
        prerequisites: ["列舉結果"],
        questionTypes: ["骰子", "抽球", "所有可能結果"],
        nextRelation: "事件就是從樣本空間裡圈出你關心的結果。"
      },
      {
        id: "event",
        title: "事件",
        solves: "把題目關心的結果集合起來，計算它發生的比例。",
        prerequisites: ["樣本空間"],
        questionTypes: ["偶數點", "抽到紅球", "大於某數"],
        nextRelation: "事件的反面就是補事件。"
      },
      {
        id: "complement",
        title: "補事件",
        solves: "題目問沒有發生時，用 1 減掉原事件機率。",
        prerequisites: ["事件", "機率總和為 1"],
        questionTypes: ["至少一次", "沒有命中", "不是 A"],
        nextRelation: "補事件會常出現在二項分配和常態右尾題。"
      },
      {
        id: "conditional-probability",
        title: "條件機率",
        solves: "已經知道某件事發生了，再回頭問另一件事的機率。重點是分母從「全部」縮小成「已知的那一群」。",
        prerequisites: ["樣本空間", "事件"],
        questionTypes: ["在某條件下", "已知是男生再問…", "抽出不放回再抽一次"],
        nextRelation: "如果多知道一個條件卻完全沒改變機率，那兩件事就是獨立事件。"
      },
      {
        id: "independent-events",
        title: "獨立事件",
        solves: "判斷前一次結果是否不影響下一次，決定能不能直接相乘。",
        prerequisites: ["事件", "條件機率", "乘法"],
        questionTypes: ["獨立投籃", "連續抽取且放回", "重複試驗"],
        nextRelation: "獨立是二項分配成立的必要條件。"
      }
    ]
  },
  {
    title: "機率分配",
    concepts: [
      {
        id: "random-variable",
        title: "隨機變數",
        solves: "把不確定的結果轉成可計算的數字，例如 X 代表成功次數。",
        prerequisites: ["事件", "變數概念"],
        questionTypes: ["X 等於幾", "成功次數", "分數位置"],
        nextRelation: "二項分配和常態分配都會用隨機變數描述題目。"
      },
      {
        id: "expected-value",
        title: "期望值與變異數",
        solves: "每個結果配上一個機率後，算「長期平均會落在哪」（期望值），還有結果通常離這個平均多遠（變異數）。",
        prerequisites: ["隨機變數", "機率", "平均數"],
        questionTypes: ["每個結果配一個機率求平均", "長期下來平均賺多少", "E(X) 期望值、Var(X) 變異數"],
        nextRelation: "二項分配和常態分配都有自己現成的期望值與變異數公式，不用每次重算。"
      },
      {
        id: "discrete-vs-continuous",
        title: "間斷型 vs 連續型",
        solves: "先分清楚變數是「一格一格數得出來」還是「連續量得出來」，因為兩種用的算法完全不一樣。",
        prerequisites: ["隨機變數"],
        questionTypes: ["人數、次數（間斷）", "時間、重量、身高（連續）", "該查機率表還是算面積"],
        nextRelation: "間斷的代表是二項分配，連續的代表是常態分配。"
      },
      {
        id: "binomial",
        title: "二項分配",
        solves: "固定做 n 次，每次成功或失敗，問剛好成功 k 次的機率。",
        prerequisites: ["補事件", "獨立事件", "組合數"],
        questionTypes: ["命中率固定", "獨立做 n 次", "剛好成功 k 次"],
        nextRelation: "當資料可近似連續鐘形曲線時，會接到常態分配。"
      },
      {
        id: "normal",
        title: "常態分配",
        solves: "用平均數和標準差描述鐘形資料，找小於、大於、介於的比例。",
        prerequisites: ["平均數", "標準差", "Z 分數"],
        questionTypes: ["平均與標準差已知", "求比例", "小於或大於某分數"],
        nextRelation: "常態分配會支援信賴區間和假設檢定。"
      }
    ]
  },
  {
    title: "推論統計",
    concepts: [
      {
        id: "sampling",
        title: "抽樣",
        solves: "用一部分資料推估母體，但要承認抽樣會有誤差。",
        prerequisites: ["樣本", "母體"],
        questionTypes: ["抽樣調查", "樣本平均", "推估母體"],
        nextRelation: "抽樣誤差會用標準誤描述。"
      },
      {
        id: "sampling-distribution",
        title: "抽樣分配與中央極限定理",
        solves: "不是看單一個人，而是看「一整袋樣本的平均」會怎麼分布。樣本夠大時，這個平均的分布會接近常態，就算原始資料不是常態也一樣。",
        prerequisites: ["抽樣", "平均數", "常態分配"],
        questionTypes: ["樣本平均的分布", "n 夠大時近似常態", "中央極限定理"],
        nextRelation: "知道樣本平均接近常態，才能用標準誤算出信賴區間。"
      },
      {
        id: "standard-error",
        title: "標準誤",
        solves: "描述樣本平均會在母體平均附近晃動多少。",
        prerequisites: ["標準差", "樣本數"],
        questionTypes: ["樣本平均的誤差", "標準差除以根號 n"],
        nextRelation: "信賴區間會用標準誤算出誤差範圍。"
      },
      {
        id: "critical-values",
        title: "常用分配與臨界值",
        solves: "推論時除了常態（Z），還會用 t、卡方、F 這幾種分配；臨界值就是「超過這條線就算夠極端」的那個門檻。",
        prerequisites: ["常態分配", "抽樣分配與中央極限定理"],
        questionTypes: ["查 t 表", "自由度", "臨界值 / 拒絕區"],
        nextRelation: "信賴區間和假設檢定都要靠這些臨界值畫出範圍或判斷線。"
      },
      {
        id: "confidence-interval",
        title: "信賴區間",
        solves: "用樣本平均加減誤差範圍，估計母體參數可能落在哪裡。",
        prerequisites: ["樣本平均", "標準誤", "臨界值"],
        questionTypes: ["95% 信賴區間", "誤差範圍", "下限與上限"],
        nextRelation: "假設檢定會把樣本結果拿來和某個主張比較。"
      },
      {
        id: "hypothesis-test",
        title: "假設檢定",
        solves: "判斷樣本證據是否足夠反對 H0。",
        prerequisites: ["H0/H1", "alpha", "p-value"],
        questionTypes: ["檢定主張", "p-value", "拒絕或不拒絕 H0"],
        nextRelation: "它把前面的分布、標準誤和機率判斷整合成決策。"
      }
    ]
  }
];
