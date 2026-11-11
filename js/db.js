const DB_NAME = 'AungGasDB';
const DB_VERSION = 1;

const db = {
  dbInstance: null,

  async open() {
    if (this.dbInstance) return this.dbInstance;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.dbInstance = request.result;
        resolve(this.dbInstance);
      };

      request.onupgradeneeded = (event) => {
        const database = event.target.result;

        if (!database.objectStoreNames.contains('products')) {
          database.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
        }
        if (!database.objectStoreNames.contains('sales')) {
          database.createObjectStore('sales', { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains('customers')) {
          database.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
        }
        if (!database.objectStoreNames.contains('cylinders')) {
          database.createObjectStore('cylinders', { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains('cylinderMovements')) {
          database.createObjectStore('cylinderMovements', { keyPath: 'id', autoIncrement: true });
        }
        if (!database.objectStoreNames.contains('oxygenInventory')) {
          database.createObjectStore('oxygenInventory', { keyPath: 'id', autoIncrement: true });
        }
        if (!database.objectStoreNames.contains('expenses')) {
          database.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
        }
        if (!database.objectStoreNames.contains('payments')) {
          database.createObjectStore('payments', { keyPath: 'id', autoIncrement: true });
        }
        if (!database.objectStoreNames.contains('settings')) {
          database.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  },

  async add(storeName, data) {
    const database = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async put(storeName, data) {
    const database = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async getAll(storeName) {
    const database = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async delete(storeName, id) {
    const database = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
};
  
