/** 词库管理 Mock 数据 */

export interface DictionaryRecord {
  id: number;
  name: string;
  words: WordRecord[];
  creator: string;
  createdAt: string;
  updatedAt: string;
}

export interface WordRecord {
  id: number;
  text: string;
  createdAt: string;
}

function makeWords(texts: string[], baseDate: string): WordRecord[] {
  return texts.map((text, i) => ({
    id: i + 1,
    text,
    createdAt: baseDate,
  }));
}

export const dictionaryData: DictionaryRecord[] = [
  {
    id: 1,
    name: "资金类敏感词",
    words: makeWords(
      ["转账", "汇款", "打款", "银行卡", "定金", "预付款", "押金", "保证金", "账号", "支付宝", "微信支付", "PayPal"],
      "2026-01-10 10:00:00"
    ),
    creator: "傅晓康",
    createdAt: "2026-01-10 10:00:00",
    updatedAt: "2026-02-01 09:05:00",
  },
  {
    id: 2,
    name: "合同类敏感词",
    words: makeWords(
      ["合同", "签约", "协议", "签署"],
      "2026-01-10 10:25:00"
    ),
    creator: "傅晓康",
    createdAt: "2026-01-10 10:25:00",
    updatedAt: "2026-01-20 11:00:00",
  },
  {
    id: 3,
    name: "个人信息类敏感词",
    words: makeWords(
      ["身份证", "护照", "驾照", "社保号"],
      "2026-01-10 10:40:00"
    ),
    creator: "傅晓康",
    createdAt: "2026-01-10 10:40:00",
    updatedAt: "2026-02-10 16:00:00",
  },
];
