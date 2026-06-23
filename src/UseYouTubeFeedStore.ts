import { UseKeyValueStore, KeyValueStoreError } from './UseKeyValueStore';
import { YouTubeFeed } from './types/YouTubeFeed';

export class YouTubeFeedStoreError extends KeyValueStoreError {
  static {
    this.prototype.name = 'YouTubeFeedNotifyCheckError';
  }
}

export const useYouTubeFeedStore = (useKeyValueStoreMethods: UseKeyValueStore) => {
  const { isKeyAlreadyStored, storeKeyValue }: UseKeyValueStore = useKeyValueStoreMethods;

  const isYouTubeFeedAlreadyStored = async (youTubeFeed: YouTubeFeed): Promise<boolean> => {
    try {
      const key: string = youTubeFeed.feed.entry.id;
      return isKeyAlreadyStored(key);
    } catch (error: unknown) {
      if (error instanceof KeyValueStoreError) {
        throw new YouTubeFeedStoreError('バインダーに資料なし', { cause: error });
      }
      console.error(
        `method: isYouTubeFeedAlreadyStored message: バインダーが投げられたため、資料が存在しない ${error}`
      );
      throw error;
    }
  };

  const storeYouTubeFeed = async (youTubeFeed: YouTubeFeed): Promise<void> => {
    try {
      const key: string = youTubeFeed.feed.entry.id;
      const value: string = youTubeFeed.feed.entry.title;
      return storeKeyValue(key, value);
    } catch (error: unknown) {
      if (error instanceof KeyValueStoreError) {
        throw new YouTubeFeedStoreError('バインダーに資料をうまく挟めない', {
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

export type UseYouTubeFeedStore = ReturnType<typeof useYouTubeFeedStore>;
