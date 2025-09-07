import { describe, it, expect } from 'vitest';
import {
  useRandomNotificationMessage,
  UseRandomNotificationMessage,
} from '../src/UseRandomNotificationMessage';

describe('Test UseRandomNotificationMessage', () => {
  describe('Random Notification Message Generate Test', () => {
    // リストの項目を順番に出力するためのメソッドを内包 (副作用込み)
    const useSequence = () => {
      let si: number = -1;

      const sequence = (): number => {
        si++;
        return si;
      };

      return { sequence };
    };

    const testMessages: string[] = [
      'test message 1',
      'test message 2',
      'test message 3',
      'test message 4',
    ];
    it('should notification messages be expected when random number are deliberately generated in a sequential order', () => {
      const { sequence } = useSequence();
      const { generateRandomNotificationMessage }: UseRandomNotificationMessage =
        useRandomNotificationMessage(testMessages, () => sequence());

      expect(generateRandomNotificationMessage()).toBe('test message 1');
      expect(generateRandomNotificationMessage()).toBe('test message 2');
      expect(generateRandomNotificationMessage()).toBe('test message 3');
      expect(generateRandomNotificationMessage()).toBe('test message 4');
      expect(generateRandomNotificationMessage()).toBe('test message 1');
      expect(generateRandomNotificationMessage()).toBe('test message 2');
      expect(generateRandomNotificationMessage()).toBe('test message 3');
      expect(generateRandomNotificationMessage()).toBe('test message 4');
    });
  });

  describe('Random Notification Message Error Case Test', () => {
    it('should throw error when notification messages are empty', () => {
      const { generateRandomNotificationMessage } = useRandomNotificationMessage([], () => 0);
      expect(() => generateRandomNotificationMessage()).toThrow('通知メッセージなし');
    });

    it('should throw error when notification messages are more than max length (Boundary Value Test)', () => {
      const notificationMessagesInBoundary: string[] = Array.from(
        { length: 256 },
        (_, i) => `notification message ${i}`
      );
      const notificationMessagesOutOfBoundary: string[] = Array.from(
        { length: 257 },
        (_, i) => `notification message ${i}`
      );

      const { generateRandomNotificationMessage: generateRandomNotificationMessageInBoundary } =
        useRandomNotificationMessage(notificationMessagesInBoundary, () => 0);
      const { generateRandomNotificationMessage: generateRandomNotificationMessageOutOfBoundary } =
        useRandomNotificationMessage(notificationMessagesOutOfBoundary, () => 0);

      expect(generateRandomNotificationMessageInBoundary()).toBe('notification message 0');
      expect(() => generateRandomNotificationMessageOutOfBoundary()).toThrow(
        '通知メッセージの数が大杉'
      );
    });

    it('should throw error when random generator returns non-integer', () => {
      const { generateRandomNotificationMessage } = useRandomNotificationMessage(
        ['test'],
        () => 3.14
      );
      expect(() => generateRandomNotificationMessage()).toThrow('生成した乱数が非整数');
    });
  });
});
