import Lottery from "./Lottery.js";
import { LOTTERY_TYPES, MATCH_COUNT, RANK } from "../constants.js";

class LottoLottery extends Lottery {
  constructor(numbers) {
    super(numbers, LOTTERY_TYPES.LOTTO);
  }

  judgeRank(winningNumbers, bonusNumber) {
    const matchCount = this.#countMatches(winningNumbers);
    const hasBonus = this.getNumbers().includes(bonusNumber);

    if (matchCount === MATCH_COUNT.FIRST) return RANK.FIRST;
    if (matchCount === MATCH_COUNT.SECOND && hasBonus) return RANK.SECOND;
    if (matchCount === MATCH_COUNT.THIRD) return RANK.THIRD;
    if (matchCount === MATCH_COUNT.FOURTH && hasBonus) return RANK.FOURTH;
    if (matchCount === MATCH_COUNT.FIFTH && hasBonus) return RANK.FIFTH;
    return null;
  }

  #countMatches(winningNumbers) {
    return this.getNumbers().filter((num) => winningNumbers.includes(num)).length;
  }
}

export default LottoLottery;
