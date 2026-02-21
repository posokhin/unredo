import { beforeEach, describe, expect, test } from "vitest";
import { Unredo } from "..";

type User = {
  name: string;
  age: number;
};

let data: Unredo<User>;

beforeEach(() => {
  data = new Unredo({ name: "anton", age: 30 });
});

describe("initial state", () => {
  test("should return initial value", () => {
    expect(data.getCurrent()).toMatchObject({ name: "anton", age: 30 });
  });
});

describe("set", () => {
  test("should update current value", () => {
    data.set({ name: "oleg", age: 20 });

    expect(data.getCurrent()).toMatchObject({ name: "oleg", age: 20 });
  });

  test("should stack multiple states", () => {
    data.set({ name: "1", age: 1 });
    data.set({ name: "2", age: 2 });

    expect(data.getCurrent()).toMatchObject({ name: "2", age: 2 });
  });
});

describe("undo", () => {
  test("should not change state if no history", () => {
    data.undo();

    expect(data.getCurrent()).toMatchObject({ name: "anton", age: 30 });
  });

  test("should undo one step", () => {
    data.set({ name: "1", age: 1 });
    data.undo();

    expect(data.getCurrent()).toMatchObject({ name: "anton", age: 30 });
  });

  test("should undo multiple steps", () => {
    data.set({ name: "1", age: 1 });
    data.set({ name: "2", age: 2 });
    data.set({ name: "3", age: 3 });

    data.undo();
    data.undo();

    expect(data.getCurrent()).toMatchObject({ name: "1", age: 1 });
  });

  test("should not go before initial state", () => {
    data.set({ name: "1", age: 1 });

    data.undo();
    data.undo();
    data.undo();

    expect(data.getCurrent()).toMatchObject({ name: "anton", age: 30 });
  });
});

describe("redo", () => {
  test("should not change state if no undo happened", () => {
    data.redo();

    expect(data.getCurrent()).toMatchObject({ name: "anton", age: 30 });
  });

  test("should redo one step", () => {
    data.set({ name: "1", age: 1 });
    data.undo();
    data.redo();

    expect(data.getCurrent()).toMatchObject({ name: "1", age: 1 });
  });

  test("should redo multiple steps", () => {
    data.set({ name: "1", age: 1 });
    data.set({ name: "2", age: 2 });
    data.set({ name: "3", age: 3 });

    data.undo();
    data.undo();

    data.redo();

    expect(data.getCurrent()).toMatchObject({ name: "2", age: 2 });
  });

  test("should not go beyond latest state", () => {
    data.set({ name: "1", age: 1 });
    data.undo();

    data.redo();
    data.redo();
    data.redo();

    expect(data.getCurrent()).toMatchObject({ name: "1", age: 1 });
  });
});

describe("redo invalidation", () => {
  test("should clear redo history after new set following undo", () => {
    data.set({ name: "1", age: 1 });
    data.set({ name: "2", age: 2 });

    data.undo(); // -> {1,1}

    data.set({ name: "3", age: 3 }); // redo must clear

    data.redo();

    expect(data.getCurrent()).toMatchObject({ name: "3", age: 3 });
  });
});

describe("immutability protection", () => {
  test("should not mutate previous states (external mutation)", () => {
    const initial = { name: "anton", age: 30 };
    const unredo = new Unredo(initial);

    initial.age = 100;

    expect(unredo.getCurrent()).toMatchObject({ name: "anton", age: 30 });
  });

  test("should not mutate history when modifying returned object", () => {
    const current = data.getCurrent();
    current.age = 999;

    expect(data.getCurrent()).toMatchObject({ name: "anton", age: 30 });
  });

  test("should preserve previous state immutability after set", () => {
    data.set({ name: "1", age: 1 });
    const snapshot = data.getCurrent();

    snapshot.age = 999;

    expect(data.getCurrent()).toMatchObject({ name: "1", age: 1 });
  });
});

describe("complex scenario", () => {
  test("should handle mixed undo/redo/set sequence correctly", () => {
    data.set({ name: "1", age: 1 });
    data.set({ name: "2", age: 2 });
    data.set({ name: "3", age: 3 });

    data.undo(); // 2
    data.undo(); // 1
    data.redo(); // 2
    data.set({ name: "4", age: 4 }); // clears redo

    data.redo(); // should do nothing

    expect(data.getCurrent()).toMatchObject({ name: "4", age: 4 });
  });
});
