const LOTTO_CONFIG = Object.freeze({
  PRICE: 500,
  NUMBER_COUNT: 5,
  MIN_NUMBER: 1,
  MAX_NUMBER: 30,
});

const PRIZE_MONEY = Object.freeze({
  2: 5000,
  3: 500000,
  4: 1500000,
  "4+bonus": 10000000,
  5: 100000000,
});

const RANK_NAMES = Object.freeze({
  2: "3개 일치",
  3: "4개 일치",
  4: "5개 일치",
  "4+bonus": "5개 일치, 보너스 볼 일치",
  5: "6개 일치",
});

export { LOTTO_CONFIG, PRIZE_MONEY, RANK_NAMES };