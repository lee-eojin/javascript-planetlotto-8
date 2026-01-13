export const LOTTO_CONFIG = Object.freeze({
  PRICE: 500,
  NUMBER_COUNT: 5,
  MIN_NUMBER: 1,
  MAX_NUMBER: 30,
});

export const MATCH_COUNT = Object.freeze({
  FIRST: 5,
  SECOND: 4,
  THIRD: 4,
  FOURTH: 3,
  FIFTH: 2,
});

export const PRIZE_MONEY = Object.freeze({
  FIRST: 100000000,
  SECOND: 10000000,
  THIRD: 1500000,
  FOURTH: 500000,
  FIFTH: 5000,
});

export const ERROR_MESSAGE = Object.freeze({
  INVALID_LOTTO_COUNT: "로또 번호는 5개여야 합니다.",
  DUPLICATE_LOTTO_NUMBER: "로또 번호에 중복된 숫자가 있습니다.",
  INVALID_NUMBER_FORMAT: "로또 번호는 숫자여야 합니다.",
  DUPLICATE_TARGET_NUMBER: "당첨 번호에 중복된 숫자가 있습니다.",
  INVALID_BONUS_FORMAT: "보너스 번호는 숫자여야 합니다.",
  DUPLICATE_BONUS_NUMBER: "보너스 번호는 당첨 번호와 중복될 수 없습니다.",
});

export const LOTTERY_TYPES = Object.freeze({
  LOTTO: "LOTTO",
  PENSION: "PENSION",
  INSTANT: "INSTANT",
});

export const PLUS_ERROR_MESSAGE = Object.freeze({
  SHORTAGE: "재고가 부족합니다.",
  TYPE: "알 수 없는 타입입니다.",
});
