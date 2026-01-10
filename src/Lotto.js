import { LOTTO_CONFIG } from "./constants.js";

class Lotto {
  #numbers;

  constructor(numbers) {
    this.#validate(numbers);
    this.#numbers = numbers;
  }

  #validate(numbers) {
    if (numbers.length !== LOTTO_CONFIG.NUMBER_COUNT) {
      throw new Error(
        `[ERROR] 로또 번호는 ${LOTTO_CONFIG.NUMBER_COUNT}개여야 합니다.`
      );
    }

    if (new Set(numbers).size !== numbers.length) {
      throw new Error("[ERROR] 로또 번호는 중복될 수 없습니다.");
    }

    const scopeCheck = numbers.every(
      (num) => num >= LOTTO_CONFIG.MIN_NUMBER && num <= LOTTO_CONFIG.MAX_NUMBER
    );
    if (!scopeCheck) {
      throw new Error(
        `[ERROR] 로또 번호는 ${LOTTO_CONFIG.MIN_NUMBER}부터 ${LOTTO_CONFIG.MAX_NUMBER} 사이의 숫자여야 합니다.`
      );
    }
  }

  numberCheck() {
    return this.#numbers;
  }

  matchCount(winningNumbers) {
    return this.#numbers.filter((num) => winningNumbers.includes(num)).length;
  }

  hasBonus(bonusNumber) {
    return this.#numbers.includes(bonusNumber);
  }
}

export default Lotto;
