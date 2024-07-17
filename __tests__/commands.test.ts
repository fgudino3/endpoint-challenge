import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  MockInstance,
} from "vitest";
import Commands from "../src/commands";

describe("Commands", () => {
  let commands = createCommands();

  beforeEach(() => {
    commands = createCommands();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("process succeeds", () => {
    // ARRANGE
    const goodInput = "CREATE fruits";
    const [logSpy, logs] = createLogSpy();

    // ACT
    commands.process(goodInput);

    // ASSERT
    expect(logSpy).not.toBeCalled();
    expect(logs.length).toBe(0);
  });

  it("process fails on invalid command", () => {
    // ARRANGE
    const badInput = "TEST fruits";
    const [logSpy, logs] = createLogSpy();

    // ACT
    commands.process(badInput);

    // ASSERT
    expect(logSpy).toBeCalled();
    expect(logs.length).toBe(1);
    expect(logs[0]).toBe("Invalid command.");
  });

  it("process fails on command casing", () => {
    // ARRANGE
    const badInput = "create fruits";
    const [logSpy, logs] = createLogSpy();

    // ACT
    commands.process(badInput);

    // ASSERT
    expect(logSpy).toBeCalled();
    expect(logs.length).toBe(1);
    expect(logs[0]).toBe("Invalid command.");
  });

  it("process fails on incorrect number of arguments for command", () => {
    // ARRANGE
    const command = "MOVE";
    const badInput = command + " fruits";
    const [logSpy, logs] = createLogSpy();

    // ACT
    commands.process(badInput);

    // ASSERT
    expect(logSpy).toBeCalled();
    expect(logs.length).toBe(1);
    expect(logs[0]).toBe(`Invalid arguments for ${command} command.`);
  });
});

function createCommands(): Commands {
  return new Commands();
}

function createLogSpy(): [
  MockInstance<{
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
  }>,
  string[]
] {
  const logs: string[] = [];
  const logSpy = vi
    .spyOn(console, "log")
    .mockImplementation((log: string) => logs.push(log));

  return [logSpy, logs];
}
