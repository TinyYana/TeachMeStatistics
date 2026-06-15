export interface Diagnostic {
  id: string;
  title: string;
  reason: string;
  fix: string;
  contrastExample: string;
}

export const diagnostics: Diagnostic[] = [
  {
    id: "decimal-percent",
    title: "小數與百分比轉換錯誤",
    reason: "把 0.3 和 30% 當成不同機率，或把 30 直接放進公式。",
    fix: "公式裡先用小數計算，最後再乘以 100% 顯示成百分比。",
    contrastExample: "命中率 30% 要代入 p = 0.3；算出 0.2965 後才寫成 29.65%。"
  },
  {
    id: "missing-q",
    title: "忘記用 1 減 p 算失敗機率",
    reason: "只注意成功機率 p，沒有把失敗那幾次也算進去。",
    fix: "先寫 q = 1 - p，再把失敗次數放在 q 的次方。",
    contrastExample: "p = 0.3 時，沒命中不是 0.3，而是 q = 1 - 0.3 = 0.7。"
  },
  {
    id: "missing-combination",
    title: "二項分配忘記乘上 C(n,k)",
    reason: "只算到某一種固定順序，沒有把成功位置的所有排法加進來。",
    fix: "題目問剛好成功 k 次時，先算固定順序機率，再乘 C(n, k)。",
    contrastExample: "8 球剛好進 2 球不只 SSFFFFFF，還有 SFSFFFFF、SFFSFFFF 等排法。"
  },
  {
    id: "sequence-as-total",
    title: "把固定順序機率當成總機率",
    reason: "把 p<sup>k</sup>(1−p)<sup>n−k</sup> 誤認為 P(X = k)。",
    fix: "固定順序機率只是一種排列；P(X = k) 需要乘上排列數 C(n, k)。",
    contrastExample: "0.3<sup>2</sup> × 0.7<sup>6</sup> 是前兩球進的機率，不是 8 球中任意 2 球進的機率。"
  },
  {
    id: "sample-denominator",
    title: "樣本變異數除以 n，應該除以 n - 1",
    reason: "把樣本資料當成母體資料，低估了分散程度。",
    fix: "題目說樣本或抽樣資料時，變異數分母用 n - 1。",
    contrastExample: "資料 4, 6, 8 的平方離均差和是 8；母體除 3，樣本除 2。"
  },
  {
    id: "normal-greater-tail",
    title: "常態分配大於某數時忘記用 1 減查表值",
    reason: "Z 表通常給左側累積面積，但題目問右側。",
    fix: "先查 P(Z < z)，再用 1 - P(Z < z) 算大於。",
    contrastExample: "Z = 1 的左側約 0.8413，所以右側約 1 - 0.8413 = 0.1587。"
  },
  {
    id: "normal-between",
    title: "介於兩數之間時沒有用右邊減左邊",
    reason: "把單一累積機率直接當成區間面積。",
    fix: "先算右邊界累積機率，再減左邊界累積機率。",
    contrastExample: "P(60 < X < 80) 要算 P(X < 80) - P(X < 60)。"
  },
  {
    id: "p-alpha-direction",
    title: "p-value 和 alpha 比較方向搞反",
    reason: "把 p-value 大當成更有證據，但其實 p-value 小才代表結果比較不支持 H0。",
    fix: "p-value 小於或等於 alpha 時拒絕 H0；大於 alpha 時不拒絕 H0。",
    contrastExample: "alpha = 0.05, p-value = 0.03，因為 0.03 < 0.05，所以拒絕 H0。"
  },
  {
    id: "prove-null",
    title: "把不拒絕 H0 寫成證明 H0 正確",
    reason: "假設檢定只能說證據不足以反對 H0，不能證明 H0 一定正確。",
    fix: "結論寫「沒有足夠證據拒絕 H0」。",
    contrastExample: "p-value = 0.2 只能說目前證據不足，不代表 H0 被證明。"
  },
  {
    id: "wrong-question-type",
    title: "題型判斷錯誤",
    reason: "被單一關鍵字帶走，沒有確認題目條件是否完整符合某個公式。",
    fix: "先找題型條件，再代公式。二項分配至少要有固定次數、成功/失敗、固定機率、獨立、問成功次數。",
    contrastExample: "看到命中率不一定就是二項；還要看有沒有固定投幾次、是否問剛好命中幾次。"
  }
];

export function getDiagnostic(id: string): Diagnostic {
  const diagnostic = diagnostics.find((item) => item.id === id);
  if (!diagnostic) {
    throw new Error(`找不到錯誤診斷：${id}`);
  }
  return diagnostic;
}
