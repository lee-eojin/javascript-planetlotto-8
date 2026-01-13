import Lottery from "./Lottery.js";
import { LOTTERY_TYPES, RANK, PENSION_CONFIG } from "../constants.js";

class PensionLottery extends Lottery {
  constructor(number) {
    super([number], LOTTERY_TYPES.PENSION);
  }

  judgeRank(winningNumber) {
    const digitLength = PENSION_CONFIG.DIGIT_LENGTH;
    const myNumber = String(this.getNumbers()[0]).padStart(digitLength, "0");
    const winning = String(winningNumber).padStart(digitLength, "0");

    if (myNumber === winning) return RANK.FIRST;

    if (
      myNumber.slice(0, 5) === winning.slice(0, 5) ||
      myNumber.slice(1) === winning.slice(1)
    ) {
      return RANK.SECOND;
    }

    if (
      myNumber.slice(0, 4) === winning.slice(0, 4) ||
      myNumber.slice(2) === winning.slice(2)
    ) {
      return RANK.THIRD;
    }

    return null;
  }

  toString() {
    const digitLength = PENSION_CONFIG.DIGIT_LENGTH;
    return `[${String(this.getNumbers()[0]).padStart(digitLength, "0")}]`;
  }
}

export default PensionLottery;
