export const useRandomNotificationMessage = (
  notificationMessages: string[],
  generateRandomNth: () => number // Random integer N is generated: 0 <= N < notificationMessages.length
) => {
  const generateRandomNotificationMessage = (): string => {
    if (notificationMessages.length === 0) {
      throw new Error('通知メッセージなし');
    }
    const randomNth: number = generateRandomNth();
    if (
      !(Number.isInteger(randomNth) && 0 <= randomNth && randomNth < notificationMessages.length)
    ) {
      throw new Error('生成した乱数が範囲外');
    }

    return notificationMessages[randomNth];
  };

  return { generateRandomNotificationMessage };
};

export type UseRandomNotificationMessage = ReturnType<typeof useRandomNotificationMessage>;
