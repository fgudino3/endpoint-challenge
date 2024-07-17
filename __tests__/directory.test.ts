import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import Directory from "../src/directory";

describe("Directory", () => {
  let root = createRootDirectory();

  beforeEach(() => {
    root = createRootDirectory();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("CREATE succeeds", () => {
    // ARRANGE
    const goodPath = "fruits";

    // ACT
    const error = root.create(goodPath);

    // ASSERT
    expect(error).toBeUndefined();
    expect(root.children.length).toBe(1);
  });

  it("CREATE fails", () => {
    // ARRANGE
    const badPath = "sweets/cake";

    // ACT
    const error = root.create(badPath);

    // ASSERT
    expect(error).toBeDefined();
    expect(root.children.length).toBe(0);
  });

  it("LIST succeeds", () => {
    // ARRANGE
    const dir1 = "fruits";
    const dir2 = "fruits/apples";
    const logs: string[] = [];
    const logSpy = vi
      .spyOn(console, "log")
      .mockImplementation((input: string) => logs.push(input));

    // ACT
    root.create(dir1);
    root.create(dir2);
    root.list();

    // ASSERT
    expect(logSpy).toBeCalledTimes(2);
    expect(logs.length).toBe(2);
    expect(logs[0]).toBe("fruits");
    expect(logs[1]).toBe("  apples");
  });

  it("MOVE succeeds", () => {
    // ARRANGE
    const fruits = "fruits";
    const food = "food";

    // ACT
    root.create(fruits);
    root.create(food);
    const error = root.move(fruits, food);

    // ASSERT
    expect(error).toBeUndefined();
    expect(root.children.length).toBe(1);
    expect(root.children[0].children.length).toBe(1);
    expect(root.children[0].name).toBe(food);
    expect(root.children[0].children[0].name).toBe(fruits);
  });

  it("MOVE fails", () => {
    // ARRANGE
    const apples = "apples";
    const food = "food/fruit";

    // ACT
    root.create(apples);
    const error = root.move(apples, food);

    // ASSERT
    expect(error).toBeDefined();
    expect(root.children.length).toBe(1);
    expect(root.children[0].children.length).toBe(0);
  });

  it("DELETE succeeds", () => {
    // ARRANGE
    const fruits = "fruits";
    const applesInFruits = "fruits/apples";

    // ACT
    root.create(fruits);
    root.create(applesInFruits);
    const error = root.delete(applesInFruits);

    // ASSERT
    expect(error).toBeUndefined();
    expect(root.children[0].children.length).toBe(0);
  });

  it("DELETE fails", () => {
    // ARRANGE
    const fruits = "fruits";
    const applesInFruits = "fruits/apples";

    // ACT
    root.create(fruits);
    const error = root.delete(applesInFruits);

    // ASSERT
    expect(error).toBeDefined();
    expect(error).toContain("apples does not exist");
  });
});

function createRootDirectory(): Directory {
  return new Directory("root");
}
