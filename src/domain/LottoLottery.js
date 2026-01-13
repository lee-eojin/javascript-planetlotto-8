import Lottery from "./Lottery.js";
import { LOTTERY_TYPES } from "../constants.js";

class LottoLottery extends Lottery {
  constructor(numbers) {
    super(numbers, LOTTERY_TYPES.LOTTO);
  }

  judgeRank(winningNumbers, bonusNumber) {
    const matchCount = this.#countMatches(winningNumbers);
    const hasBonus = this.getNumbers().includes(bonusNumber);

    if (matchCount === 5) return "FIRST";
    if (matchCount === 4 && hasBonus) return "SECOND";
    if (matchCount === 4) return "THIRD";
    if (matchCount === 3 && hasBonus) return "FOURTH";
    if (matchCount === 2 && hasBonus) return "FIFTH";
    return null;
  }

  #countMatches(winningNumbers) {
    return this.getNumbers().filter((num) => winningNumbers.includes(num)).length;
  }
}

export default LottoLottery;
