export const useNotificationMessage = (
  notificationMessages: string[],
  generateNormalizedRandom: () => number // Random number generator: 0 <= N < 1
) => {
  const generateRandomNotificationMessage = (): string => {
    if (notificationMessages.length === 0) {
      throw new Error('通知メッセージなし');
    }
    const normalizedRandom: number = generateNormalizedRandom();
    const nth: number = Math.floor(notificationMessages.length * normalizedRandom);
    return notificationMessages[nth];
  };

  return { generateRandomNotificationMessage };
};

export type UseNotificationMessage = ReturnType<typeof useNotificationMessage>;
