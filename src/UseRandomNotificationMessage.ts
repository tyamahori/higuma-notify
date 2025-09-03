export const useRandomNotificationMessage = (
  notificationMessages: string[],
  generateRandomInt: () => number // Random integer N is generated
) => {
  const generateRandomNotificationMessage = (): string => {
    if (notificationMessages.length === 0) {
      throw new Error('通知メッセージなし');
    }
    const randomInt: number = generateRandomInt();
    if (!Number.isInteger(randomInt)) {
      throw new Error('生成した乱数が整数ではない');
    }

    const listLength = notificationMessages.length;
    return notificationMessages[(listLength + randomInt) % listLength];
  };

  return { generateRandomNotificationMessage };
};

export type UseRandomNotificationMessage = ReturnType<typeof useRandomNotificationMessage>;
