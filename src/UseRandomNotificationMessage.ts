import { NOTIFICATION_MESSAGES } from './constants/NotificationMessages';

export const useRandomNotificationMessage = (
  notificationMessages: string[],
  generateRandomInt: () => number // Random integer is generated
) => {
  const generateRandomNotificationMessage = (
    maxLength: number = NOTIFICATION_MESSAGES.MAX_LENGTH
  ): string => {
    if (notificationMessages.length === 0) {
      throw new Error('通知メッセージなし');
    }
    if (!(notificationMessages.length < maxLength + 1)) {
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
