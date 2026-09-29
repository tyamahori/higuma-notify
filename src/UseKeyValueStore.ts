export class KeyValueStoreError extends Error {
  static {
    this.prototype.name = 'KeyValueStoreError';
  }
}

export const useKeyValueStore = (kv: KVNamespace) => {
  const isKeyAlreadyStored = async (key: string): Promise<boolean> => {
    try {
      return (await kv.get(key)) !== null;
    } catch (error: unknown) {
      throw new KeyValueStoreError('Key Value Store: Key Registeration Check Error', {
        cause: error,
      });
    }
  };

  const storeKeyValue = async (key: string, value: string): Promise<void> => {
    try {
      await kv.put(key, value);
    } catch (error: unknown) {
      throw new KeyValueStoreError('Key Value Store:Key Value Registeration Error', {
        cause: error,
      });
    }
  };

  return { isKeyAlreadyStored, storeKeyValue };
};

export type UseKeyValueStore = ReturnType<typeof useKeyValueStore>;
