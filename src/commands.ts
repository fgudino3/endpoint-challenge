import Directory from "./directory";

enum CommandType {
  CREATE = "CREATE",
  LIST = "LIST",
  MOVE = "MOVE",
  DELETE = "DELETE",
}
type ArgumentLength = number;

export default class Commands {
  private commandRules: Map<string, number>;
  private root: Directory;

  constructor() {
    this.root = new Directory("root");
    this.commandRules = new Map<CommandType, ArgumentLength>([
      [CommandType.CREATE, 2],
      [CommandType.LIST, 1],
      [CommandType.MOVE, 3],
      [CommandType.DELETE, 2],
    ]);
  }

  public process(input: string) {
    const args = input.split(" ");
    const command = args[0] as CommandType;
    const isInvalidCommand = !this.commandRules.has(command);
    const isInvalidArgumentLength =
      this.commandRules.get(command) !== args.length;
    let error: string | undefined;

    if (isInvalidCommand) {
      error = "Invalid command.";
    } else if (isInvalidArgumentLength) {
      error = `Invalid arguments for ${command} command.`;
    } else {
      error = this.executeCommand(command, args.slice(1));
    }

    if (error) {
      console.log(error);
    }
  }

  private executeCommand(
    command: CommandType,
    args: string[],
  ): string | undefined {
    let error: string | undefined;

    switch (command) {
      case CommandType.CREATE:
        error = this.root.create(args[0]);
        break;
      case CommandType.LIST:
        this.root.list();
        break;
      case CommandType.MOVE:
        error = this.root.move(args[0], args[1]);
        break;
      case CommandType.DELETE:
        error = this.root.delete(args[0]);
        break;
      default:
        error = "Invalid command.";
        break;
    }

    return error;
  }
}
