export const useRandomNotificationMessage = (
  notificationMessages: string[],
  generateNormalizedRandom: () => number // Random decimal number generator: 0.0 <= D < 1.0
) => {
  const generateRandomNotificationMessage = (): string => {
    if (notificationMessages.length === 0) {
      throw new Error('通知メッセージなし');
    }
    const normalizedRandom: number = generateNormalizedRandom();
    if (normalizedRandom < 0.0 || 1.0 <= normalizedRandom) {
      throw new Error('生成した正規化乱数が範囲外');
    }
    const nth: number = Math.floor(notificationMessages.length * normalizedRandom);
    return notificationMessages[nth];
  };

  return { generateRandomNotificationMessage };
};

export type UseRandomNotificationMessage = ReturnType<typeof useRandomNotificationMessage>;
