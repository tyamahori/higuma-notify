import { useKeyValueStore, UseKeyValueStore, KeyValueStoreError } from './UseKeyValueStore';
import { YouTubeFeed } from './types/YouTubeFeed';

// TODO: 不要？
export class YouTubeFeedKeyValueStoreError extends KeyValueStoreError {
  static {
    this.prototype.name = 'YouTubeFeedNotifyCheckError';
  }
}

// TODO: KV STOREを注入する場合は、引数に記載
export const useYouTubeFeedKeyValueStore = () => {
  const { isKeyExists, storeKeyValue }: UseKeyValueStore = useKeyValueStore();

  const isYouTubeFeedAlreadyStored = (youTubeFeed: YouTubeFeed): boolean => {
    try {
      const key: string = youTubeFeed.feed.entry.id;
      return isKeyExists(key);
    } catch (error: unknown) {
      if (error instanceof KeyValueStoreError) {
        throw new YouTubeFeedKeyValueStoreError('バインダーに資料なし', { cause: error });
      }
      console.error(
        `method: isYouTubeFeedAlreadyStored message: バインダーが投げられたため、資料が存在しない ${error}`
      );
      throw error;
    }
  };

  const storeYouTubeFeed = (youTubeFeed: YouTubeFeed): void => {
    try {
      const key: string = youTubeFeed.feed.entry.id;
      const value: string = youTubeFeed.feed.entry.title;
      return storeKeyValue(key, value);
    } catch (error: unknown) {
      if (error instanceof KeyValueStoreError) {
        throw new YouTubeFeedKeyValueStoreError('バインダーに資料をうまく挟めない', {
          cause: error,
        });
      }
      console.error(
        `method: storeYouTubeFeed message: 投げられたバインダーの資料がうまく回収できない ${error}`
      );
      throw error;
    }
  };

  return { isYouTubeFeedAlreadyStored, storeYouTubeFeed };
};

export type UseYouTubeFeedKeyValueStore = ReturnType<typeof useYouTubeFeedKeyValueStore>;
