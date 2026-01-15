import { LOTTO_CONFIG, PLUS_ERROR_MESSAGE } from "../constants.js";

class Lotto {
  #numbers;

  constructor(numbers) {
    this.#validate(numbers);
    this.#numbers = numbers;
  }

  #validate(numbers) {
    if (numbers.length !== LOTTO_CONFIG.NUMBER_COUNT) {
      throw new Error(
        PLUS_ERROR_MESSAGE.INVALID_LOTTO_COUNT(LOTTO_CONFIG.NUMBER_COUNT)
      );
    }

    if (new Set(numbers).size !== numbers.length) {
      throw new Error(PLUS_ERROR_MESSAGE.DUPLICATE_LOTTO_NUMBER);
    }

    const isValidRange = numbers.every(
      (num) => num >= LOTTO_CONFIG.MIN_NUMBER && num <= LOTTO_CONFIG.MAX_NUMBER
    );
    if (!isValidRange) {
      throw new Error(
        PLUS_ERROR_MESSAGE.INVALID_NUMBER_RANGE(
          LOTTO_CONFIG.MIN_NUMBER,
          LOTTO_CONFIG.MAX_NUMBER
        )
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
