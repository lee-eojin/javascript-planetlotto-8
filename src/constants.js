export const LOTTO_CONFIG = Object.freeze({
  PRICE: 500,
  NUMBER_COUNT: 5,
  MIN_NUMBER: 1,
  MAX_NUMBER: 30,
});

export const MODE = Object.freeze({
  DEFAULT: "1",
  SHOP: "2",
});

export const LOTTERY_CHOICE = Object.freeze({
  LOTTO: "1",
  PENSION: "2",
});

export const FILE_PATH = Object.freeze({
  LOTTERY_CSV: "./src/data/lottery_types.csv",
});

export const MATCH_COUNT = Object.freeze({
  FIRST: 5,
  SECOND: 4,
  THIRD: 4,
  FOURTH: 3,
  FIFTH: 2,
});

export const ERROR_MESSAGE = Object.freeze({
  INVALID_NUMBER_FORMAT: "로또 번호는 숫자여야 합니다.",
  DUPLICATE_TARGET_NUMBER: "당첨 번호에 중복된 숫자가 있습니다.",
  DUPLICATE_BONUS_NUMBER: "보너스 번호는 당첨 번호와 중복될 수 없습니다.",
  DUPLICATE_LOTTO_NUMBER: "로또 번호는 중복될 수 없습니다.",
  SHORTAGE: "재고가 부족합니다.",
  UNKNOWN_TYPE: "알 수 없는 타입입니다.",
  INVALID_INPUT: "잘못된 입력입니다. 다시 선택해주세요.",
  NOT_IMPLEMENTED: "하위 클래스에서 구현해야 합니다.",
  INVALID_AMOUNT_UNIT: (price) => `${price}원 단위로 입력해주세요.`,
  INVALID_AMOUNT_MIN: (price) => `${price}원 이상 입력해주세요.`,
  INVALID_LOTTO_COUNT: (count) => `로또 번호는 ${count}개여야 합니다.`,
  INVALID_NUMBER_RANGE: (min, max) =>
    `로또 번호는 ${min}부터 ${max} 사이의 숫자여야 합니다.`,
});

export const LOTTERY_TYPES = Object.freeze({
  LOTTO: "LOTTO",
  PENSION: "PENSION",
  INSTANT: "INSTANT",
});

export const RANK = Object.freeze({
  FIRST: "FIRST",
  SECOND: "SECOND",
  THIRD: "THIRD",
  FOURTH: "FOURTH",
  FIFTH: "FIFTH",
});

export const PENSION_CONFIG = Object.freeze({
  MIN_NUMBER: 1,
  MAX_NUMBER: 1000000,
  DIGIT_LENGTH: 6,
});

export const PROMPT_MESSAGE = Object.freeze({
  MODE_SELECT: "모드를 선택해주세요.\n1. 행성로또\n2. 복권판매점\n",
  LOTTERY_TYPE_SELECT: "복권 종류를 선택해주세요.\n1. 행성로또\n2. 연금복권\n",
  SHOP_AMOUNT_INPUT: (price) => `구입금액을 입력해 주세요. (${price}원 단위)\n`,
});

export const OUTPUT_MESSAGE = Object.freeze({
  PURCHASE_COUNT: (count) => `${count}개를 구매했습니다.`,
  STATS_HEADER: "당첨 통계",
  STATS_DIVIDER: "---",
  SALES_STATS_HEADER: "\n--- 판매 통계 ---",
  RANK_RESULT: (rank, prize, count) =>
    `${rank}등 (${prize.toLocaleString()}원) - ${count}개`,
  SALES_STAT_LINE: (type, count, revenue) =>
    `${type}: ${count}장, ${revenue.toLocaleString()}원`,
});
