// TODO: 不要？
export class KeyValueStoreError extends Error {
  static {
    this.prototype.name = 'KeyValueStoreError';
  }
}

// TODO: KV STOREを注入する場合は、引数に記載
export const useKeyValueStore = () => {
  const isKeyAlreadyStored = async (key: string): Promise<boolean> => {
    // TODO: key が登録済みかチェック処理を記載
    // TODO: try / catch で KV STORE に関するエラー処理も記載
    console.log(`key: ${key}`);
    return true;
  };

  const storeKeyValue = async (key: string, value: string): Promise<void> => {
    // TODO: key / value の登録処理を記載
    // TODO: try / catch で KV STORE に関するエラー処理も記載
    console.log(`[key, value]: [${key}, ${value}]`);
  };

  return { isKeyAlreadyStored, storeKeyValue };
};

export type UseKeyValueStore = ReturnType<typeof useKeyValueStore>;
