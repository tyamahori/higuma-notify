// TODO: データ格納場所に移動
// TODO: 返却値をランダムに表示させるため、リストにメッセージを追加
export const notificationMessages = Object.freeze({
  list: ['新着動画だよ！（暖かみのあるbot）'],
});

export const NOTIFICATION_MESSAGES = {
  MAX_LENGTH: 256,
} as const satisfies {
  MAX_LENGTH: number;
};
