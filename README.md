# unredo

A tiny, type-safe undo/redo state manager for any value. Uses `structuredClone` internally to guarantee full immutability of every snapshot.

## Installation

```bash
npm install unredo
```

## Usage

```ts
import { Unredo } from "unredo";

const state = new Unredo({ name: "anton", age: 30 });

state.getCurrent(); // { name: "anton", age: 30 }

state.set({ name: "oleg", age: 20 });
state.getCurrent(); // { name: "oleg", age: 20 }

state.undo();
state.getCurrent(); // { name: "anton", age: 30 }

state.redo();
state.getCurrent(); // { name: "oleg", age: 20 }
```

## API

### `new Unredo<T>(initialValue: T)`

Creates a new instance with the given initial value. The value is deep-cloned immediately, so external mutations to the original object have no effect.

### `set(value: T): void`

Saves the current state to the undo stack and sets a new current value. Clears the redo stack.

### `undo(): void`

Reverts to the previous state. Does nothing if there is no history.

### `redo(): void`

Re-applies the next state after an undo. Does nothing if there is nothing to redo. Calling `set()` after `undo()` clears the redo stack.

### `getCurrent(): T`

Returns a deep clone of the current state. Mutating the returned object does not affect the stored state.

## Immutability

Every value passed to `set()` and every value returned by `getCurrent()` is deep-cloned via `structuredClone`, so stored snapshots are never affected by external mutations.

```ts
const state = new Unredo({ count: 0 });

const snapshot = state.getCurrent();
snapshot.count = 999;

state.getCurrent(); // { count: 0 } — unchanged
```

## License

MIT © Anton Posokhin
