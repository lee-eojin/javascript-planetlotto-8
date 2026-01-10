import { Random } from "@woowacourse/mission-utils";
import { InputView, OutputView } from "./view.js";
import Lotto from "./Lotto.js";
import { LOTTO_CONFIG, ERROR_MESSAGE } from "./constants.js";

class App {
  async run() {
    
    const amount = await this.#askAmount();
    const lottoLists = this.#generateLottos(amount);
    OutputView.printPurchasedLottos(lottoLists.length);
    lottoLists.forEach((lotto) => OutputView.printLottos(lotto.numberCheck()));

    
    const winningNumbers = await this.#askWinningLotto();
    const bonusNumber = await this.#askBonusNumber(winningNumbers);

    
    const result = this.#resultCalculate(lottoLists, winningNumbers, bonusNumber);
    OutputView.printResult(result);
  }

  
  async #askAmount() {
    try {
      const input = await InputView.askAmount();
      const amount = Number(input);
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
      throw new Error(`[ERROR] ${LOTTO_CONFIG.PRICE}원 이상 입력해주세요.`);
    }
    if (amount % LOTTO_CONFIG.PRICE !== 0) {
      throw new Error(`[ERROR] ${LOTTO_CONFIG.PRICE}원 단위로 입력해주세요.`);
    }
  }

  
  async #askWinningLotto() {
    try {
      const input = await InputView.askWinningLotto();
      const numbers = input.replaceAll(" ", "").split(",").map(Number);
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
      throw new Error(`[ERROR] 로또 번호는 ${LOTTO_CONFIG.NUMBER_COUNT}개여야 합니다.`);
    }
    if (new Set(numbers).size !== numbers.length) {
      throw new Error(ERROR_MESSAGE.DUPLICATE_TARGET_NUMBER);
    }
    const 범위확인 = numbers.every(
      (num) => num >= LOTTO_CONFIG.MIN_NUMBER && num <= LOTTO_CONFIG.MAX_NUMBER
    );
    if (!범위확인) {
      throw new Error(`[ERROR] 로또 번호는 ${LOTTO_CONFIG.MIN_NUMBER}부터 ${LOTTO_CONFIG.MAX_NUMBER} 사이의 숫자여야 합니다.`);
    }
  }

  async #askBonusNumber(winningNumbers) {
    try {
      const input = await InputView.askBonusNumber();
      const number = Number(input);
      this.#bonusNumberValidate(number, winningNumbers);
      return number;
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
      throw new Error(`[ERROR] 로또 번호는 ${LOTTO_CONFIG.MIN_NUMBER}부터 ${LOTTO_CONFIG.MAX_NUMBER} 사이의 숫자여야 합니다.`);
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
    if (matchCount === 5) return 1;
    if (matchCount === 4 && hasBonus) return 2;
    if (matchCount === 4) return 3;
    if (matchCount === 3 && hasBonus) return 4;
    if (matchCount === 2 && hasBonus) return 5;
    return 0;
  }

  #resultCalculate(lottoLists, winningNumbers, bonusNumber) {
    const result = new Map([
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]
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
