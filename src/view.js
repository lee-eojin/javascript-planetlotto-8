import { MissionUtils } from "@woowacourse/mission-utils";
const InputView = {
  async askAmount() {
    const input = await MissionUtils.Console.readLineAsync(
      "구입금액을 입력해 주세요.\n"
    );
    return input;
  },

  async askWinningLotto() {
    const input = await MissionUtils.Console.readLineAsync(
      "당첨 번호를 입력해 주세요.\n"
    );
    return input;
  },

  async askBonusNumber() {
    const input = await MissionUtils.Console.readLineAsync(
      "보너스 번호를 입력해 주세요.\n"
    );
    return input;
  },
};

const OutputView = {
  printPurchasedLottos(lottos) {
    MissionUtils.Console.print(`${lottos}개를 구매했습니다.`);
  },

  printLottos(lottos) {
    const lines = [...lottos].sort((a, b) => a - b);
    MissionUtils.Console.print(`[${lines.join(", ")}]`);
  },

  printResult(countByRank) {
    const getCount = (k) => countByRank.get(k) ?? 0;

    MissionUtils.Console.print("당첨 통계");
    MissionUtils.Console.print("---");
    MissionUtils.Console.print(`5개 일치 (100,000,000원) - ${getCount(1)}개`);
    MissionUtils.Console.print(
      `4개 일치, 보너스 번호 일치 (10,000,000원) - ${getCount(2)}개`
    );
    MissionUtils.Console.print(`4개 일치 (1,500,000원) - ${getCount(3)}개`);
    MissionUtils.Console.print(
      `3개 일치, 보너스 번호 일치 (500,000원) - ${getCount(4)}개`
    );
    MissionUtils.Console.print(
      `2개 일치, 보너스 번호 일치 (5,000원) - ${getCount(5)}개`
    );
    MissionUtils.Console.print(`0개 일치 (0원) - ${getCount(0)}개`);
  },

  printErrorMessage(message) {
    MissionUtils.Console.print(message);
  },
};

export { InputView, OutputView };
