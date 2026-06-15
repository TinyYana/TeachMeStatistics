export type QuestionType =
  | "描述統計"
  | "機率基礎"
  | "二項分配"
  | "常態分配"
  | "信賴區間"
  | "假設檢定";

export const questionTypeOptions: QuestionType[] = [
  "描述統計",
  "機率基礎",
  "二項分配",
  "常態分配",
  "信賴區間",
  "假設檢定"
];

export interface QuestionTypeItem {
  id: string;
  prompt: string;
  answer: QuestionType;
  keywords: string[];
  reason: string[];
  distractors: Partial<Record<QuestionType, string>>;
}

export interface QuestionTypeGuide {
  /** 點過去複習的位置；沒有獨立計算器的題型先指到首頁概念地圖 */
  href: string;
  label: string;
  /** 回去要重點看什麼，一句話 */
  focus: string;
}

export const questionTypeGuides: Record<QuestionType, QuestionTypeGuide> = {
  描述統計: {
    href: "/chapters/descriptive.html",
    label: "描述統計章節",
    focus: "平均數、變異數、標準差，還有樣本要除以 n − 1。"
  },
  機率基礎: {
    href: "/chapters/probability.html",
    label: "機率基礎章節",
    focus: "樣本空間、補事件、條件機率、獨立事件怎麼分。"
  },
  二項分配: {
    href: "/chapters/binomial.html",
    label: "二項分配章節",
    focus: "五個條件要齊、固定順序機率，還有別漏掉 C(n, k)。"
  },
  常態分配: {
    href: "/chapters/normal.html",
    label: "常態分配章節",
    focus: "先把 X 轉成 Z，再看題目要左尾、右尾還是區間。"
  },
  信賴區間: {
    href: "/index.html#concept-map",
    label: "首頁概念地圖",
    focus: "標準誤、臨界值、樣本平均加減誤差範圍。完整計算器還沒做。"
  },
  假設檢定: {
    href: "/index.html#concept-map",
    label: "首頁概念地圖",
    focus: "H0／H1、alpha、p-value 跟拒絕區的決策。完整計算器還沒做。"
  }
};

export const questionTypeItems: QuestionTypeItem[] = [
  {
    id: "binomial-free-throws",
    prompt: "某球員命中率 0.3，獨立罰球 8 次，問剛好命中 2 次的機率。",
    answer: "二項分配",
    keywords: ["命中率 0.3", "獨立", "8 次", "剛好命中 2 次"],
    reason: [
      "固定做 8 次。",
      "每次只有命中或沒命中。",
      "命中率固定為 0.3。",
      "每次獨立。",
      "題目問剛好命中 2 次。"
    ],
    distractors: {
      機率基礎: "你可能看到命中率就想到一般機率，但題目同時有固定次數和剛好成功次數，所以要用二項分配。",
      描述統計: "這題不是整理一組既有資料，而是在算重複試驗的機率。"
    }
  },
  {
    id: "descriptive-scores",
    prompt: "某班 5 位學生分數為 60, 70, 70, 80, 100，問平均數與標準差。",
    answer: "描述統計",
    keywords: ["一組分數", "平均數", "標準差"],
    reason: ["題目給既有資料。", "要求整理資料中心與分散程度。", "沒有抽樣推論或機率分布條件。"],
    distractors: {
      常態分配: "看到標準差不一定是常態分配；這題沒有平均與標準差已知後求面積。",
      信賴區間: "這題沒有信心水準，也沒有要求估計母體平均的上下限。"
    }
  },
  {
    id: "normal-score",
    prompt: "某測驗平均 70 分、標準差 10 分，問 85 分以下約占多少比例。",
    answer: "常態分配",
    keywords: ["平均 70", "標準差 10", "85 分以下", "比例"],
    reason: ["題目給平均與標準差。", "問小於某個 X 的比例。", "需要先把 X 轉成 Z，再看曲線下面積。"],
    distractors: {
      描述統計: "平均與標準差在這裡不是要你重新整理資料，而是常態分配的參數。",
      假設檢定: "題目沒有 H0、H1、alpha 或 p-value 決策。"
    }
  },
  {
    id: "confidence-interval",
    prompt: "抽樣 64 人，平均花費 1200 元，標準差 160 元，求 95% 信賴區間。",
    answer: "信賴區間",
    keywords: ["抽樣", "平均", "標準差", "95% 信賴區間"],
    reason: ["題目用樣本估計母體。", "出現信心水準。", "答案會是一段下限到上限。"],
    distractors: {
      描述統計: "平均與標準差只是信賴區間的材料，題目真正要的是估計範圍。",
      常態分配: "常態臨界值會被用到，但題型是信賴區間。"
    }
  },
  {
    id: "hypothesis-test",
    prompt: "宣稱平均等待時間為 10 分鐘，抽樣後得到 p-value = 0.03，alpha = 0.05，問是否拒絕 H0。",
    answer: "假設檢定",
    keywords: ["宣稱", "p-value", "alpha", "拒絕 H0"],
    reason: ["題目有要檢查的主張。", "出現 p-value 和 alpha。", "結論是拒絕或不拒絕 H0。"],
    distractors: {
      信賴區間: "信賴區間會給上下限；這題要求用 p-value 和 alpha 做決策。",
      常態分配: "檢定可能用到 Z 或 t，但題型核心是檢定決策。"
    }
  },
  {
    id: "basic-probability",
    prompt: "丟一顆公平骰子，問出現偶數的機率。",
    answer: "機率基礎",
    keywords: ["公平骰子", "偶數", "機率"],
    reason: ["可以列出樣本空間。", "事件是偶數 2, 4, 6。", "用有利結果數除以所有可能結果數。"],
    distractors: {
      二項分配: "這題不是固定做 n 次，也沒有問剛好成功 k 次。",
      描述統計: "這題不是整理資料，而是從樣本空間算機率。"
    }
  }
];
