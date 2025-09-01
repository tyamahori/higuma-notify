export const useNotificationMessage = (notificationMessages: string[]) => {
  const generateRandomNotificationMessage = (): string => {
    if (notificationMessages.length === 0) {
      throw new Error('通知メッセージなし');
    }
    return notificationMessages[0]; // TODO: 返却値をランダムに修正
  };

  return { generateRandomNotificationMessage };
};

export type UseNotificationMessage = ReturnType<typeof useNotificationMessage>;
