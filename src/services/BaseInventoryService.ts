export abstract class BaseInventoryService<T> {
  private _localStorageKey: string;
  private _userDataMapping: Record<string, T[]>;

  constructor(localStorageKey: string, userDataMapping: Record<string, T[]>) {
    this._localStorageKey = localStorageKey;
    this._userDataMapping = userDataMapping;
  }

  getAllItems(): T[] {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) return [];

    const storedItems = localStorage.getItem(this._localStorageKey);
    if (storedItems) {
      return JSON.parse(storedItems);
    }

    const user = JSON.parse(loggedInUser);
    return this._userDataMapping[user.username] || [];
  }

  addItem(items: T[], data: T): T[] { 
    const updatedList = [...items, data];
    localStorage.setItem(this._localStorageKey, JSON.stringify(updatedList));
    return [...items, data];
  }

  updateItem(items: T[], data: { newData: T, index: number }): T[] {
    const { newData, index } = data;
    if (items[index]) {
      const updatedList = [...items];
      updatedList[index] = newData;
      // Save the updatedList instead of the original items
      localStorage.setItem(this._localStorageKey, JSON.stringify(updatedList));
      return updatedList;
    }

    return items;
  }

  deleteItem(items: T[], item: T): T[] {
    const index = items.indexOf(item);
    if (index > -1) {
      const updatedList = [...items];
      updatedList.splice(index, 1);
      localStorage.setItem(this._localStorageKey, JSON.stringify(updatedList));
      return updatedList;
    }
    
    return items;
  }
}