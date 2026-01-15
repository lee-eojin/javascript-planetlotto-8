import { PLUS_ERROR_MESSAGE } from "../constants.js";

class Lottery {
  #numbers;
  #type;

  constructor(numbers, type) {
    this.#numbers = numbers;
    this.#type = type;
  }

  getType() {
    return this.#type;
  }

  getNumbers() {
    return this.#numbers;
  }

  judgeRank() {
    throw new Error(PLUS_ERROR_MESSAGE.NOT_IMPLEMENTED);
  }

  toString() {
    return `[${this.#numbers.join(", ")}]`;
  }
}

export default Lottery;
