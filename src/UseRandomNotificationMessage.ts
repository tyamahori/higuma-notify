export const useRandomNotificationMessage = (
  notificationMessages: string[],
  generateRandomInt: () => number // Random integer N is generated
) => {
  const generateRandomNotificationMessage = (): string => {
    if (notificationMessages.length === 0) {
      throw new Error('通知メッセージなし');
    }
    if (!(notificationMessages.length < (2 ^ 16))) {
      throw new Error('通知メッセージの数が大杉');
    }
    const randomInt: number = generateRandomInt();
    if (!Number.isInteger(randomInt)) {
      throw new Error('生成した乱数が非整数');
    }

    const listLength = notificationMessages.length;
    return notificationMessages[randomInt % listLength];
  };

  return { generateRandomNotificationMessage };
};

export type UseRandomNotificationMessage = ReturnType<typeof useRandomNotificationMessage>;
