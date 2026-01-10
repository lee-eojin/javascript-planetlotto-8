 import fs from "fs";
import { Random } from "@woowacourse/mission-utils";
import { LOTTERY_TYPES } from "./constants.js";
import LottoLottery from "./LottoLottery.js";
import PensionLottery from "./PensionLottery.js";
import InstantLottery from "./InstantLottery.js";

class LotteryShop {
  #lotteryTypes; 
  #purchaseHistory;
  #salesStats; 
  constructor(csvPath) {
    this.#lotteryTypes = this.#readCSV(csvPath);
    this.#purchaseHistory = {};
    this.#salesStats = {};

    Object.keys(LOTTERY_TYPES).forEach((type) => {
      this.#purchaseHistory[type] = [];
      this.#salesStats[type] = { count: 0, revenue: 0 };
    });
  }

  #readCSV(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    const types = {};
    lines.slice(1).forEach((line) => {
      if (line.trim() === "") return;

      const values = line.split(",").map((v) => v.trim());
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      types[obj.type] = obj;
    });

    return types;
  }

  getLotteryInfo(type) {
    return this.#lotteryTypes[type];
  }

  purchaseLotteries(type, amount) {
    const info = this.#lotteryTypes[type];
    const price = Number(info.price);
    const count = amount / price;

    if (Number(info.stock) < count) {
      throw new Error("[ERROR] 재고가 부족합니다.");
    }

    const lotteries = [];
    for (let i = 0; i < count; i++) {
      lotteries.push(this.#generateLottery(type));
    }

    info.stock = String(Number(info.stock) - count);

    this.#purchaseHistory[type].push(...lotteries);

    this.#salesStats[type].count += count;
    this.#salesStats[type].revenue += amount;

    return lotteries;
  }

  #generateLottery(type) {
    if (type === LOTTERY_TYPES.LOTTO) {
      const numbers = Random.pickUniqueNumbersInRange(1, 45, 6);
      return new LottoLottery(numbers.sort((a, b) => a - b));
    }

    if (type === LOTTERY_TYPES.PENSION) {
      const number = Random.pickNumberInRange(1, 1000000);
      return new PensionLottery(number);
    }

    if (type === LOTTERY_TYPES.INSTANT) {
      const numbers = Random.pickUniqueNumbersInRange(1, 100, 3);
      return new InstantLottery(numbers.sort((a, b) => a - b));
    }

    throw new Error("[ERROR] 알 수 없는 복권 종류입니다.");
  }

  getPurchasedLotteries(type) {
    return this.#purchaseHistory[type];
  }

  getSalesStats() {
    return this.#salesStats;
  }

  getStock(type) {
    return Number(this.#lotteryTypes[type].stock);
  }

  addStock(type, quantity) {
    const current = Number(this.#lotteryTypes[type].stock);
    this.#lotteryTypes[type].stock = String(current + quantity);
  }

  getAllStocks() {
    const stocks = {};
    Object.keys(LOTTERY_TYPES).forEach((type) => {
      stocks[type] = this.getStock(type);
    });
    return stocks;
  }
}

export default LotteryShop;
