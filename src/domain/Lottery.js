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
    throw new Error("하위 클래스에서 구현해야 합니다.");
  }

  toString() {
    return `[${this.#numbers.join(", ")}]`;
  }
}

export default Lottery;
