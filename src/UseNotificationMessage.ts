export const useNotificationMessage = (notificationMessages: string[]) => {
  const generateRandomNotificationMessage = (): string => {
    return notificationMessages[0]; // TODO: 返却値をランダムに修正
  };

  return { generateRandomNotificationMessage };
};

export type UseNotificationMessage = ReturnType<typeof useNotificationMessage>;
