import { MissionUtils } from "@woowacourse/mission-utils";

const InputView = {
  /**
   * @returns {number}
   */
  async askAmount() {
    const input = await MissionUtils.Console.readLineAsync('구입금액을 입력해 주세요.\n');
    const num = parseInt(input, 10);
    if (Number.isNaN(num)) {
      throw new Error('구매금액은 숫자여야 합니다.');
    }
    return num;
  },

  /**
   * @returns {number[]}
   */
  async askWinningLotto() {
    const input = await MissionUtils.Console.readLineAsync('지난 주 당첨 번호를 입력해 주세요.\n');

    return input
      .replaceAll(' ', '')
      .split(',')
      .map((s) => {
        const n = parseInt(s, 10);
        if (Number.isNaN(n)) {
          throw new Error('당첨 번호는 숫자여야 합니다.');
        }
        return n;
      });
  },

  /**
   * @returns {number}
   */
  async askBonusNumber() {
    const input = await MissionUtils.Console.readLineAsync('보너스 번호를 입력해 주세요.\n');
    const num = parseInt(input, 10);
    if (Number.isNaN(num)) {
      throw new Error('보너스 번호는 숫자여야 합니다.');
    }
    return num;
  },
};

const OutputView = {
  /**
   * @param {number[][]} lottos
   */
  printPurchasedLottos(lottos) {
    const lines = [
      `${lottos.length}개를 구매했습니다.`,
        ...lottos.map(lotto => `[${lotto.join(', ')}]`),
    ];
    MissionUtils.Console.print(lines.join('\n'));
  },

  /**
   * index 0번은 미당첨
   * index 1~5번은 1~5등
   *
   * @param {Map<number, number>} countsByRank
   */
  printResult(countsByRank) {
    const getCount = (k) => countsByRank.get(k) ?? 0;

    const output = [
      '당첨 통계',
      '---',
      `5개 일치 (100,000,000원) - ${getCount(1)}개`,
      `4개 일치, 보너스 번호 일치 (10,000,000원) - ${getCount(2)}개`,
      `4개 일치 (1,500,000원) - ${getCount(3)}개`,
      `3개 일치, 보너스 번호 일치 (500,000원) - ${getCount(4)}개`,
      `2개 일치, 보너스 번호 일치 (5,000원) - ${getCount(5)}개`,
      `0개 일치 (0원) - ${getCount(0)}개`,
    ].join('\n');

    MissionUtils.Console.print(output);
  },

  /**
   * @param {string} message
   */
  printErrorMessage(message) {
    MissionUtils.Console.print(`[ERROR] ${message}`);
  },
};

export { InputView, OutputView };