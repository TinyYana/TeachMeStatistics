import type { QuestionType } from "./questionTypes";

export type PracticeChapter = "descriptive" | "probability" | "binomial" | "normal";

export interface PracticeOption {
  label: string;
  diagnosticId?: string;
}

export interface PracticeQuestion {
  id: string;
  chapter: PracticeChapter;
  prompt: string;
  answerIndex: number;
  successFeedback: string;
  options: PracticeOption[];
}

export interface ExamDrill {
  id: string;
  chapter: PracticeChapter;
  title: string;
  prompt: string;
  formula: string;
  substitution: string;
  answer: string;
  examNote: string;
}

export const practiceSets: Record<PracticeQuestion["chapter"], PracticeQuestion[]> = {
  descriptive: [
    {
      id: "sample-variance-denominator",
      chapter: "descriptive",
      prompt: "資料 4, 6, 8 是樣本資料。平方離均差和是 8，變異數應該怎麼算？",
      answerIndex: 1,
      successFeedback: "對，樣本變異數要除以 n - 1，所以 8 ÷ 2 = 4。",
      options: [
        { label: "8 ÷ 3", diagnosticId: "sample-denominator" },
        { label: "8 ÷ 2" },
        { label: "8 ÷ 4", diagnosticId: "sample-denominator" }
      ]
    },
    {
      id: "sd-plain-meaning",
      chapter: "descriptive",
      prompt: "標準差最適合用哪一句話解釋？",
      answerIndex: 0,
      successFeedback: "對，標準差就是資料通常離平均數大約多遠。",
      options: [
        { label: "資料通常離平均數大約多遠" },
        { label: "資料最大值和最小值差多少", diagnosticId: "wrong-question-type" },
        { label: "資料總共加起來是多少", diagnosticId: "wrong-question-type" }
      ]
    },
    {
      id: "descriptive-type",
      chapter: "descriptive",
      prompt: "題目給 60, 70, 80, 90，問平均與中位數。這是什麼題型？",
      answerIndex: 0,
      successFeedback: "對，這是在整理一組既有資料，所以是描述統計。",
      options: [
        { label: "描述統計" },
        { label: "二項分配", diagnosticId: "wrong-question-type" },
        { label: "假設檢定", diagnosticId: "wrong-question-type" }
      ]
    }
  ],
  probability: [
    {
      id: "probability-dice-basic",
      chapter: "probability",
      prompt: "丟一顆公平骰子，出現偶數的機率是多少？",
      answerIndex: 0,
      successFeedback: "對，偶數是 2、4、6，共 3 個結果，所以 3/6 = 0.5。",
      options: [
        { label: "3/6 = 0.5" },
        { label: "2/6", diagnosticId: "wrong-sample-space" },
        { label: "1/6", diagnosticId: "wrong-sample-space" }
      ]
    },
    {
      id: "probability-conditional-denominator",
      chapter: "probability",
      prompt: "全班 40 人，修統計 12 人，其中 9 人通過。已知某人修統計，通過機率是多少？",
      answerIndex: 1,
      successFeedback: "對，條件已經縮成修統計的 12 人，所以是 9/12 = 0.75。",
      options: [
        { label: "9/40", diagnosticId: "conditional-denominator" },
        { label: "9/12" },
        { label: "12/40", diagnosticId: "wrong-question-type" }
      ]
    },
    {
      id: "probability-independence-check",
      chapter: "probability",
      prompt: "P(A)=0.3，P(B)=0.5，P(A 且 B)=0.15。A 和 B 是否可視為獨立？",
      answerIndex: 0,
      successFeedback: "對，P(A)P(B)=0.3×0.5=0.15，和 P(A 且 B) 一樣。",
      options: [
        { label: "可以，因為 P(A 且 B)=P(A)P(B)" },
        { label: "不行，因為 0.3 和 0.5 不一樣", diagnosticId: "independence-conditional" },
        { label: "不行，因為兩個事件同時出現就一定相關", diagnosticId: "independence-conditional" }
      ]
    },
    {
      id: "probability-function-expected-value",
      chapter: "probability",
      prompt: "X=0,1,2；P(X)=0.2,0.5,0.3。E(X) 是多少？",
      answerIndex: 2,
      successFeedback: "對，E(X)=0×0.2+1×0.5+2×0.3=1.1。",
      options: [
        { label: "(0+1+2)/3 = 1", diagnosticId: "expected-value-weights" },
        { label: "0.2+0.5+0.3 = 1", diagnosticId: "expected-value-weights" },
        { label: "1.1" }
      ]
    }
  ],
  binomial: [
    {
      id: "binomial-q",
      chapter: "binomial",
      prompt: "n=8, p=0.3, k=2 時，失敗機率 q 是多少？",
      answerIndex: 1,
      successFeedback: "對，q = 1 - p = 1 - 0.3 = 0.7。",
      options: [
        { label: "0.3", diagnosticId: "missing-q" },
        { label: "0.7" },
        { label: "2/8", diagnosticId: "wrong-question-type" }
      ]
    },
    {
      id: "binomial-combination",
      chapter: "binomial",
      prompt: "0.3<sup>2</sup> × 0.7<sup>6</sup> 代表什麼？",
      answerIndex: 0,
      successFeedback: "對，這只是一種固定順序，例如前兩球進、後六球沒進。",
      options: [
        { label: "某一種固定順序的機率" },
        { label: "剛好命中 2 次的總機率", diagnosticId: "sequence-as-total" },
        { label: "成功位置有幾種", diagnosticId: "missing-combination" }
      ]
    },
    {
      id: "binomial-type",
      chapter: "binomial",
      prompt: "看到固定做 10 次、每次成功或失敗、成功率固定、問剛好成功 3 次，應該用什麼？",
      answerIndex: 1,
      successFeedback: "對，這五個條件完整符合二項分配。",
      options: [
        { label: "描述統計", diagnosticId: "wrong-question-type" },
        { label: "二項分配" },
        { label: "信賴區間", diagnosticId: "wrong-question-type" }
      ]
    }
  ],
  normal: [
    {
      id: "normal-z-meaning",
      chapter: "normal",
      prompt: "Z = 1.5 的白話意思是什麼？",
      answerIndex: 2,
      successFeedback: "對，Z 是位置，代表比平均高 1.5 個標準差。",
      options: [
        { label: "機率是 1.5", diagnosticId: "wrong-question-type" },
        { label: "比平均低 1.5 個標準差", diagnosticId: "wrong-question-type" },
        { label: "比平均高 1.5 個標準差" }
      ]
    },
    {
      id: "normal-greater",
      chapter: "normal",
      prompt: "Z 表給 P(Z < 1) = 0.8413，P(Z > 1) 應該怎麼算？",
      answerIndex: 1,
      successFeedback: "對，大於某數是右尾，要用 1 - 0.8413 = 0.1587。",
      options: [
        { label: "直接用 0.8413", diagnosticId: "normal-greater-tail" },
        { label: "1 - 0.8413" },
        { label: "0.8413 - 1", diagnosticId: "normal-greater-tail" }
      ]
    },
    {
      id: "normal-between",
      chapter: "normal",
      prompt: "若要算 P(60 < X < 80)，最合理的做法是？",
      answerIndex: 0,
      successFeedback: "對，區間面積要用右邊累積機率減左邊累積機率。",
      options: [
        { label: "P(X < 80) - P(X < 60)" },
        { label: "只查 P(X < 80)", diagnosticId: "normal-between" },
        { label: "1 - P(X < 60)", diagnosticId: "normal-between" }
      ]
    }
  ]
};

export const examDrills: Record<PracticeQuestion["chapter"], ExamDrill[]> = {
  descriptive: [
    {
      id: "exam-sample-sd",
      chapter: "descriptive",
      title: "樣本標準差",
      prompt: "某小組 5 次測驗分數為 60, 70, 70, 80, 100。求樣本標準差。",
      formula: "s = √(Σ(x − x̄)<sup>2</sup> ÷ (n − 1))",
      substitution: "x̄ = 76，Σ(x − x̄)<sup>2</sup> = 920，s = √(920 ÷ 4)",
      answer: "s = √230 ≈ 15.17",
      examNote: "考卷如果寫「樣本」，分母用 n - 1；如果寫「母體」，才用 N。"
    },
    {
      id: "exam-mean-median-range",
      chapter: "descriptive",
      title: "平均、中位數、全距",
      prompt: "資料為 12, 15, 15, 18, 30。求平均數、中位數與全距。",
      formula: "平均數 = Σx ÷ n；中位數 = 排序後中間值；全距 = 最大值 − 最小值",
      substitution: "Σx = 90，n = 5；中間值 = 15；全距 = 30 − 12",
      answer: "平均數 = 18，中位數 = 15，全距 = 18",
      examNote: "有極端值時，平均數會被拉動；中位數通常比較穩。"
    }
  ],
  probability: [
    {
      id: "exam-probability-complement",
      chapter: "probability",
      title: "4.1 基本機率與補事件",
      prompt: "一顆公平骰子丟一次，求出現大於 4 的機率，以及沒有出現大於 4 的機率。",
      formula: "P(A)=有利結果數÷所有可能結果數；P(A 的補事件)=1−P(A)",
      substitution: "A={5,6}，P(A)=2/6=1/3；1−1/3=2/3",
      answer: "出現大於 4 的機率 = 1/3；沒有出現大於 4 的機率 = 2/3。",
      examNote: "4.1 常見坑是分母抓錯；骰子一次的樣本空間就是 6 個結果。"
    },
    {
      id: "exam-conditional-probability",
      chapter: "probability",
      title: "4.2 條件機率",
      prompt: "全班 40 人，修統計 12 人，其中 9 人通過。已知抽到的人修統計，求他通過的機率。",
      formula: "P(通過 | 修統計)=P(通過且修統計)÷P(修統計)",
      substitution: "P(通過 | 修統計)=(9/40)÷(12/40)=9/12",
      answer: "P(通過 | 修統計)=0.75=75%。",
      examNote: "看到「已知」就先換分母；這題分母不是全班 40 人，而是修統計的 12 人。"
    },
    {
      id: "exam-probability-function",
      chapter: "probability",
      title: "4.4 機率函數與特徵值",
      prompt: "隨機變數 X 的機率函數為 P(X=0)=0.2，P(X=1)=0.5，P(X=2)=0.3。求 E(X)、Var(X) 與標準差。",
      formula: "E(X)=ΣxP(x)；Var(X)=E(X²)−[E(X)]²",
      substitution: "E(X)=0×0.2+1×0.5+2×0.3=1.1；E(X²)=0²×0.2+1²×0.5+2²×0.3=1.7",
      answer: "Var(X)=1.7−1.1²=0.49；標準差=√0.49=0.7。",
      examNote: "4.4 不是把 X 值直接平均；每個 X 要照自己的機率加權。"
    }
  ],
  binomial: [
    {
      id: "exam-binomial-exact",
      chapter: "binomial",
      title: "剛好成功 k 次",
      prompt: "某球員罰球命中率 0.3，獨立罰球 8 次。求剛好命中 2 次的機率。",
      formula: "P(X = k) = C(n, k) p<sup>k</sup>(1−p)<sup>n−k</sup>",
      substitution: "P(X = 2) = C(8, 2)(0.3)<sup>2</sup>(0.7)<sup>6</sup>",
      answer: "28 × 0.09 × 0.117649 = 0.29647548 ≈ 29.65%",
      examNote: "最常見錯誤是只算 0.3<sup>2</sup> × 0.7<sup>6</sup>，忘記乘 C(8, 2)。"
    },
    {
      id: "exam-binomial-at-least-one",
      chapter: "binomial",
      title: "至少一次成功",
      prompt: "某零件檢測通過率為 0.9，獨立檢測 4 個。求至少 1 個通過的機率。",
      formula: "P(至少 1 個成功) = 1 − P(0 個成功)",
      substitution: "1 − C(4, 0)(0.9)<sup>0</sup>(0.1)<sup>4</sup>",
      answer: "1 - 0.0001 = 0.9999 = 99.99%",
      examNote: "看到「至少一次」常用補事件，比逐項相加快很多。"
    }
  ],
  normal: [
    {
      id: "exam-normal-less",
      chapter: "normal",
      title: "小於某分數",
      prompt: "某測驗分數近似常態，平均 70，標準差 10。求低於 85 分的比例。",
      formula: "Z = (X − μ) ÷ σ",
      substitution: "Z = (85 − 70) ÷ 10 = 1.5；查 P(Z < 1.5)",
      answer: "P(Z < 1.5) ≈ 0.9332 = 93.32%",
      examNote: "Z 是位置，不是最後答案；查到面積後才是比例。"
    },
    {
      id: "exam-normal-greater",
      chapter: "normal",
      title: "大於某分數",
      prompt: "某測驗分數近似常態，平均 70，標準差 10。求高於 80 分的比例。",
      formula: "P(X > 80) = 1 − P(X < 80)",
      substitution: "Z = (80 − 70) ÷ 10 = 1；1 − P(Z < 1)",
      answer: "1 - 0.8413 = 0.1587 = 15.87%",
      examNote: "題目問大於時，要記得用 1 減左側累積機率。"
    },
    {
      id: "exam-normal-between",
      chapter: "normal",
      title: "介於兩分數之間",
      prompt: "某測驗分數近似常態，平均 70，標準差 10。求 80 到 90 分之間的比例。",
      formula: "P(80 < X < 90)=P(Z < z₂)−P(Z < z₁)",
      substitution: "z₁=(80−70)÷10=1；z₂=(90−70)÷10=2；P(Z<2)−P(Z<1)",
      answer: "0.9772 - 0.8413 = 0.1359 = 13.59%。",
      examNote: "5.3 區間題不要只查右邊界；要用右邊累積面積減左邊累積面積。"
    }
  ]
};

export interface TypePracticeQuestion {
  prompt: string;
  answer: QuestionType;
}
