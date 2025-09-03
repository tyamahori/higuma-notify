import { describe, it, expect } from 'vitest';
import {
  useRandomNotificationMessage,
  UseRandomNotificationMessage,
} from '../src/UseRandomNotificationMessage';

describe('Test UseRandomNOtificationMessage', () => {
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
    it('should notification messages are expected when random number is generated in a deliberate order', () => {
      const { sequence } = useSequence();
      const { generateRandomNotificationMessage }: UseRandomNotificationMessage =
        useRandomNotificationMessage(testMessages, () => sequence());

      expect(generateRandomNotificationMessage()).toBe('test message 1');
      expect(generateRandomNotificationMessage()).toBe('test message 2');
      expect(generateRandomNotificationMessage()).toBe('test message 3');
      expect(generateRandomNotificationMessage()).toBe('test message 4');
    });
  });
});
