export class KeyValueStoreError extends Error {
  static {
    this.prototype.name = 'KeyValueStoreError';
  }
}

// TODO: KV STOREを注入する場合は、引数に記載
export const useKeyValueStore = () => {
  const isKeyExists = (key: string): boolean => {
    // TODO: key が登録済みかチェック処理を記載
    // TODO: try / catch で KV STORE に関するエラー処理も記載
    console.log(`key: ${key}`);
    return true;
  };

  const storeKeyValue = (key: string, value: string): void => {
    // TODO: key / value の登録処理を記載
    // TODO: try / catch で KV STORE に関するエラー処理も記載
    console.log(`[key, value]: [${key}, ${value}]`);
  };

  return { isKeyExists, storeKeyValue };
};

export type UseKeyValueStore = ReturnType<typeof useKeyValueStore>;
