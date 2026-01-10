import { Random, Console } from "@woowacourse/mission-utils";
import { InputView, OutputView } from "./view.js";
import Lotto from "./Lotto.js";
import { LOTTO_CONFIG, PRIZE_MONEY } from "./constants.js";

class App {
  async run() {
    const inputView = InputView;
    const outputView = OutputView;

    const price = await inputView.askAmount(inputView);
    const lottos = this.#generateLottos(price);

    // outputView.printPurchasedLottos(lottos);
    // outputView.printLottos(lottos);

    const winningNumbers = await inputView.askWinningLotto(inputView);
    const bonusNumber = await inputView.askBonusNumber(inputView, winningNumbers);

    const result = this.#calculateResult(lottos, winningNumbers, bonusNumber);
    const earningRate = this.#calculateEarningRate(result, price);

    outputView.printResult(result);
    outputView.printEarningRate(earningRate);
  }

  async askAmount(inputView) {
    try {
      const price = await inputView.readPrice();
      this.#validatePrice(price);
      return price;
    } catch (error) {
      Console.print(error.message);
      return this.askAmount(inputView);
    }
  }

  async askWinningLotto(inputView) {
    try {
      const winningNumbers = await inputView.readWinningNumbers();
      this.#validateWinningNumbers(winningNumbers);
      return winningNumbers;
    } catch (error) {
      Console.print(error.message);
      return this.askWinningLotto(inputView);
    }
  }

  async askMonusNumber(inputView, winningNumbers) {
    try {
      const bonusNumber = await inputView.readBonusNumber();
      this.#validateBonusNumber(bonusNumber, winningNumbers);
      return bonusNumber;
    } catch (error) {
      Console.print(error.message);
      return this.askMonusNumber(inputView, winningNumbers);
    }
  }

  #validatePrice(price) {
    if (Number.isNaN(price)) {
      throw new Error("[ERROR] 숫자를 입력해주세요.");
    }

    if (price < LOTTO_CONFIG.PRICE) {
      throw new Error("[ERROR] 1000원 이상 입력해주세요.");
    }

    if (price % LOTTO_CONFIG.PRICE !== 0) {
      throw new Error("[ERROR] 1000원 단위로 입력해주세요.");
    }
  }

  #validateWinningNumbers(numbers) {
    if (numbers.length !== LOTTO_CONFIG.NUMBER_COUNT) {
      throw new Error("[ERROR] 로또 번호는 5개여야 합니다.");
    }

    if (new Set(numbers).size !== numbers.length) {
      throw new Error("[ERROR] 로또 번호는 중복될 수 없습니다.");
    }

    const isInRange = numbers.every(
      (num) => num >= LOTTO_CONFIG.MIN_NUMBER && num <= LOTTO_CONFIG.MAX_NUMBER
    );
    if (!isInRange) {
      throw new Error("[ERROR] 로또 번호는 1부터 30 사이의 숫자여야 합니다.");
    }
  }

  #validateBonusNumber(bonusNumber, winningNumbers) {
    if (Number.isNaN(bonusNumber)) {
      throw new Error("[ERROR] 숫자를 입력해주세요.");
    }

    if (bonusNumber < LOTTO_CONFIG.MIN_NUMBER || bonusNumber > LOTTO_CONFIG.MAX_NUMBER) {
      throw new Error("[ERROR] 로또 번호는 1부터 30 사이의 숫자여야 합니다.");
    }

    if (winningNumbers.includes(bonusNumber)) {
      throw new Error("[ERROR] 보너스 번호는 당첨 번호와 중복될 수 없습니다.");
    }
  }

  #generateLottos(price) {
    const count = price / LOTTO_CONFIG.PRICE;
    const lottos = [];

    for (let i = 0; i < count; i++) {
      const numbers = Random.pickUniqueNumbersInRange(
        LOTTO_CONFIG.MIN_NUMBER,
        LOTTO_CONFIG.MAX_NUMBER,
        LOTTO_CONFIG.NUMBER_COUNT
      );
      lottos.push(new Lotto(numbers));
    }

    return lottos;
  }

  #getRank(matchCount, hasBonus) {
    if (matchCount === 5) return 5;
    if (matchCount === 4 && hasBonus) return "4+bonus";
    if (matchCount === 4) return 4;
    if (matchCount === 3) return 3;
    if (matchCount === 2) return 2;
    return null;
  }

  #calculateResult(lottos, winningNumbers, bonusNumber) {
    const result = { 2: 0, 3: 0, 4: 0, "4+bonus": 0, 5: 0 };

    for (const lotto of lottos) {
      const matchCount = lotto.getMatchCount(winningNumbers);
      const hasBonus = lotto.hasBonusNumber(bonusNumber);
      const rank = this.#getRank(matchCount, hasBonus);

      if (rank) {
        result[rank] += 1;
      }
    }

    return result;
  }

  #calculateEarningRate(result, price) {
    let totalPrize = 0;

    for (const rank in result) {
      totalPrize += result[rank] * PRIZE_MONEY[rank];
    }

    return ((totalPrize / price) * 100).toFixed(1);
  }
}

export default App;