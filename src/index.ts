export class Unredo<T> {
  private data: T;

  private undoItems: T[] = [];
  private redoItems: T[] = [];

  constructor(data: T) {
    this.data = structuredClone(data);
  }

  public set(data: T) {
    const newValue = structuredClone(data);
    this.undoItems.push(this.data);
    this.redoItems = [];
    this.data = newValue;
  }

  public undo() {
    const last = this.undoItems.pop();
    if (last) {
      this.redoItems.push(this.data);
      this.data = last;
    }
  }

  public redo() {
    const item = this.redoItems.pop();
    if (item) {
      this.undoItems.push(item);
      this.data = item;
    }
  }

  public getCurrent() {
    return structuredClone(this.data);
  }
}
