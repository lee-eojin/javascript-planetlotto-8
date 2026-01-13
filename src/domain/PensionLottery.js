import Lottery from "./Lottery.js";
import { LOTTERY_TYPES } from "../constants.js";

class PensionLottery extends Lottery {
  constructor(number) {
    super([number], LOTTERY_TYPES.PENSION);
  }

  judgeRank(winningNumber) {
    const myNumber = String(this.getNumbers()[0]).padStart(6, "0");
    const winning = String(winningNumber).padStart(6, "0");

    if (myNumber === winning) return "FIRST";

    if (
      myNumber.slice(0, 5) === winning.slice(0, 5) ||
      myNumber.slice(1) === winning.slice(1)
    ) {
      return "SECOND";
    }

    if (
      myNumber.slice(0, 4) === winning.slice(0, 4) ||
      myNumber.slice(2) === winning.slice(2)
    ) {
      return "THIRD";
    }

    return null;
  }

  toString() {
    return `[${String(this.getNumbers()[0]).padStart(6, "0")}]`;
  }
}

export default PensionLottery;
