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
      "모드를 선택해주세요.\n1. 행성로또\n2. 복권판매점\n"
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
      "복권 종류를 선택해주세요.\n1. 행성로또\n2. 연금복권\n"
    );

    if (input === LOTTERY_CHOICE.LOTTO) return LOTTERY_TYPES.LOTTO;
    if (input === LOTTERY_CHOICE.PENSION) return LOTTERY_TYPES.PENSION;

    MissionUtils.Console.print("잘못된 입력입니다. 다시 선택해주세요.");
    return this.#askLotteryType();
  }

  async #askShopAmount(price) {
    const input = await MissionUtils.Console.readLineAsync(
      `구입금액을 입력해 주세요. (${price}원 단위)\n`
    );
    const amount = parseInt(input, 10);

    if (Number.isNaN(amount) || amount < price || amount % price !== 0) {
      MissionUtils.Console.print(`${price}원 단위로 입력해주세요.`);
      return this.#askShopAmount(price);
    }

    return amount;
  }

  #printShopLotteries(lotteries) {
    MissionUtils.Console.print(`${lotteries.length}개를 구매했습니다.`);
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

    MissionUtils.Console.print("당첨 통계");
    MissionUtils.Console.print("---");
    MissionUtils.Console.print(
      `1등 (${Number(info.firstPrize).toLocaleString()}원) - ${rankCounts.FIRST}개`
    );
    MissionUtils.Console.print(
      `2등 (${Number(info.secondPrize).toLocaleString()}원) - ${rankCounts.SECOND}개`
    );
    MissionUtils.Console.print(
      `3등 (${Number(info.thirdPrize).toLocaleString()}원) - ${rankCounts.THIRD}개`
    );
  }

  #printSalesStats(shop) {
    const stats = shop.getSalesStats();
    MissionUtils.Console.print("\n--- 판매 통계 ---");
    Object.entries(stats).forEach(([type, data]) => {
      if (data.count > 0) {
        MissionUtils.Console.print(
          `${type}: ${data.count}장, ${data.revenue.toLocaleString()}원`
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
      throw new Error(`${LOTTO_CONFIG.PRICE}원 이상 입력해주세요.`);
    }
    if (amount % LOTTO_CONFIG.PRICE !== 0) {
      throw new Error(`${LOTTO_CONFIG.PRICE}원 단위로 입력해주세요.`);
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
        `로또 번호는 ${LOTTO_CONFIG.NUMBER_COUNT}개여야 합니다.`
      );
    }
    if (new Set(numbers).size !== numbers.length) {
      throw new Error(ERROR_MESSAGE.DUPLICATE_TARGET_NUMBER);
    }
    const 범위확인 = numbers.every(
      (num) => num >= LOTTO_CONFIG.MIN_NUMBER && num <= LOTTO_CONFIG.MAX_NUMBER
    );
    if (!범위확인) {
      throw new Error(
        `로또 번호는 ${LOTTO_CONFIG.MIN_NUMBER}부터 ${LOTTO_CONFIG.MAX_NUMBER} 사이의 숫자여야 합니다.`
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
        `로또 번호는 ${LOTTO_CONFIG.MIN_NUMBER}부터 ${LOTTO_CONFIG.MAX_NUMBER} 사이의 숫자여야 합니다.`
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
