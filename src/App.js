import { MissionUtils, Random } from "@woowacourse/mission-utils";
import { InputView, OutputView } from "./view.js";
import Lotto from "./domain/Lotto.js";
import LotteryShop from "./domain/LotteryShop.js";
import {
  LOTTO_CONFIG,
  ERROR_MESSAGE,
  LOTTERY_TYPES,
  MODE,
  LOTTERY_CHOICE,
  FILE_PATH,
  MATCH_COUNT,
  PROMPT_MESSAGE,
  OUTPUT_MESSAGE,
} from "./constants.js";

class App {
  async run() {
    const modeInput = await this.#askMode();

    if (modeInput === MODE.SHOP) {
      await this.#runShopMode();
      return;
    }

    await this.#runDefaultMode(modeInput);
  }

  async #askMode() {
    const input = await MissionUtils.Console.readLineAsync(
      PROMPT_MESSAGE.MODE_SELECT
    );
    return input;
  }

  async #runDefaultMode(modeInput) {
    const amount = await this.#getAmountFromModeInput(modeInput);
    const lottoLists = this.#generateLottos(amount);

    OutputView.printPurchasedLottos(
      lottoLists.map((lotto) => lotto.numberCheck())
    );

    const winningNumbers = await this.#askWinningLotto();
    const bonusNumber = await this.#askBonusNumber(winningNumbers);

    const result = this.#resultCalculate(
      lottoLists,
      winningNumbers,
      bonusNumber
    );
    OutputView.printResult(result);
  }

  async #getAmountFromModeInput(modeInput) {
    if (modeInput === MODE.DEFAULT) {
      return this.#askAmount();
    }

    const parsed = parseInt(modeInput, 10);
    if (!Number.isNaN(parsed)) {
      try {
        this.#validateAmount(parsed);
        return parsed;
      } catch (error) {
        OutputView.printErrorMessage(error.message);
        return this.#askAmount();
      }
    }

    return this.#askAmount();
  }

  async #runShopMode() {
    const shop = new LotteryShop(FILE_PATH.LOTTERY_CSV);

    const lotteryType = await this.#askLotteryType();
    const info = shop.getLotteryInfo(lotteryType);
    const price = Number(info.price);

    const amount = await this.#askShopAmount(price);
    const lotteries = shop.purchaseLotteries(lotteryType, amount);

    this.#printShopLotteries(lotteries);

    if (lotteryType === LOTTERY_TYPES.LOTTO) {
      const winningNumbers = await this.#askWinningLotto();
      const bonusNumber = await this.#askBonusNumber(winningNumbers);
      this.#printShopResult(lotteries, winningNumbers, bonusNumber, info);
    }

    this.#printSalesStats(shop);
  }

  async #askLotteryType() {
    const input = await MissionUtils.Console.readLineAsync(
      PROMPT_MESSAGE.LOTTERY_TYPE_SELECT
    );

    if (input === LOTTERY_CHOICE.LOTTO) return LOTTERY_TYPES.LOTTO;
    if (input === LOTTERY_CHOICE.PENSION) return LOTTERY_TYPES.PENSION;

    MissionUtils.Console.print(ERROR_MESSAGE.INVALID_INPUT);
    return this.#askLotteryType();
  }

  async #askShopAmount(price) {
    const input = await MissionUtils.Console.readLineAsync(
      PROMPT_MESSAGE.SHOP_AMOUNT_INPUT(price)
    );
    const amount = parseInt(input, 10);

    if (Number.isNaN(amount) || amount < price || amount % price !== 0) {
      MissionUtils.Console.print(ERROR_MESSAGE.INVALID_AMOUNT_UNIT(price));
      return this.#askShopAmount(price);
    }

    return amount;
  }

  #printShopLotteries(lotteries) {
    MissionUtils.Console.print(OUTPUT_MESSAGE.PURCHASE_COUNT(lotteries.length));
    lotteries.forEach((lottery) => {
      MissionUtils.Console.print(lottery.toString());
    });
  }

  #printShopResult(lotteries, winningNumbers, bonusNumber, info) {
    const rankCounts = { FIRST: 0, SECOND: 0, THIRD: 0, FOURTH: 0, FIFTH: 0 };

    for (const lottery of lotteries) {
      const rank = lottery.judgeRank(winningNumbers, bonusNumber);
      if (rank) rankCounts[rank]++;
    }

    MissionUtils.Console.print(OUTPUT_MESSAGE.STATS_HEADER);
    MissionUtils.Console.print(OUTPUT_MESSAGE.STATS_DIVIDER);
    MissionUtils.Console.print(
      OUTPUT_MESSAGE.RANK_RESULT(1, Number(info.firstPrize), rankCounts.FIRST)
    );
    MissionUtils.Console.print(
      OUTPUT_MESSAGE.RANK_RESULT(2, Number(info.secondPrize), rankCounts.SECOND)
    );
    MissionUtils.Console.print(
      OUTPUT_MESSAGE.RANK_RESULT(3, Number(info.thirdPrize), rankCounts.THIRD)
    );
  }

  #printSalesStats(shop) {
    const stats = shop.getSalesStats();
    MissionUtils.Console.print(OUTPUT_MESSAGE.SALES_STATS_HEADER);
    Object.entries(stats).forEach(([type, data]) => {
      if (data.count > 0) {
        MissionUtils.Console.print(
          OUTPUT_MESSAGE.SALES_STAT_LINE(type, data.count, data.revenue)
        );
      }
    });
  }

  async #askAmount() {
    try {
      const amount = await InputView.askAmount();
      this.#validateAmount(amount);
      return amount;
    } catch (error) {
      OutputView.printErrorMessage(error.message);
      return this.#askAmount();
    }
  }

  #validateAmount(amount) {
    if (Number.isNaN(amount)) {
      throw new Error(ERROR_MESSAGE.INVALID_NUMBER_FORMAT);
    }
    if (amount < LOTTO_CONFIG.PRICE) {
      throw new Error(ERROR_MESSAGE.INVALID_AMOUNT_MIN(LOTTO_CONFIG.PRICE));
    }
    if (amount % LOTTO_CONFIG.PRICE !== 0) {
      throw new Error(ERROR_MESSAGE.INVALID_AMOUNT_UNIT(LOTTO_CONFIG.PRICE));
    }
  }

  async #askWinningLotto() {
    try {
      const numbers = await InputView.askWinningLotto();
      this.#winningNumbersValidate(numbers);
      return numbers;
    } catch (error) {
      OutputView.printErrorMessage(error.message);
      return this.#askWinningLotto();
    }
  }

  #winningNumbersValidate(numbers) {
    if (numbers.some(Number.isNaN)) {
      throw new Error(ERROR_MESSAGE.INVALID_NUMBER_FORMAT);
    }
    if (numbers.length !== LOTTO_CONFIG.NUMBER_COUNT) {
      throw new Error(
        ERROR_MESSAGE.INVALID_LOTTO_COUNT(LOTTO_CONFIG.NUMBER_COUNT)
      );
    }
    if (new Set(numbers).size !== numbers.length) {
      throw new Error(ERROR_MESSAGE.DUPLICATE_TARGET_NUMBER);
    }
    const isValidRange = numbers.every(
      (num) => num >= LOTTO_CONFIG.MIN_NUMBER && num <= LOTTO_CONFIG.MAX_NUMBER
    );
    if (!isValidRange) {
      throw new Error(
        ERROR_MESSAGE.INVALID_NUMBER_RANGE(
          LOTTO_CONFIG.MIN_NUMBER,
          LOTTO_CONFIG.MAX_NUMBER
        )
      );
    }
  }

  async #askBonusNumber(winningNumbers) {
    try {
      const bonusNumber = await InputView.askBonusNumber();
      this.#bonusNumberValidate(bonusNumber, winningNumbers);
      return bonusNumber;
    } catch (error) {
      OutputView.printErrorMessage(error.message);
      return this.#askBonusNumber(winningNumbers);
    }
  }

  #bonusNumberValidate(number, winningNumbers) {
    if (Number.isNaN(number)) {
      throw new Error(ERROR_MESSAGE.INVALID_NUMBER_FORMAT);
    }
    if (number < LOTTO_CONFIG.MIN_NUMBER || number > LOTTO_CONFIG.MAX_NUMBER) {
      throw new Error(
        ERROR_MESSAGE.INVALID_NUMBER_RANGE(
          LOTTO_CONFIG.MIN_NUMBER,
          LOTTO_CONFIG.MAX_NUMBER
        )
      );
    }
    if (winningNumbers.includes(number)) {
      throw new Error(ERROR_MESSAGE.DUPLICATE_BONUS_NUMBER);
    }
  }

  #generateLottos(amount) {
    const count = amount / LOTTO_CONFIG.PRICE;
    const lottoLists = [];

    for (let i = 0; i < count; i++) {
      const numbers = Random.pickUniqueNumbersInRange(
        LOTTO_CONFIG.MIN_NUMBER,
        LOTTO_CONFIG.MAX_NUMBER,
        LOTTO_CONFIG.NUMBER_COUNT
      );
      lottoLists.push(new Lotto(numbers));
    }

    return lottoLists;
  }

  #rankCalculate(matchCount, hasBonus) {
    if (matchCount === MATCH_COUNT.FIRST) return 1;
    if (matchCount === MATCH_COUNT.SECOND && hasBonus) return 2;
    if (matchCount === MATCH_COUNT.THIRD) return 3;
    if (matchCount === MATCH_COUNT.FOURTH && hasBonus) return 4;
    if (matchCount === MATCH_COUNT.FIFTH && hasBonus) return 5;
    return 0;
  }

  #resultCalculate(lottoLists, winningNumbers, bonusNumber) {
    const result = new Map([
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
    ]);

    for (const lotto of lottoLists) {
      const matchCount = lotto.matchCount(winningNumbers);
      const hasBonus = lotto.hasBonus(bonusNumber);
      const rank = this.#rankCalculate(matchCount, hasBonus);
      result.set(rank, result.get(rank) + 1);
    }

    return result;
  }
}

export default App;
