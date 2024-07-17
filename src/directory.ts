export default class Directory {
  private _name: string;
  private _children: Directory[];

  constructor(name: string) {
    this._name = name;
    this._children = [];
  }

  public get name(): string {
    return this._name;
  }

  public get children(): Directory[] {
    return this._children;
  }

  public create(path: string): string | undefined {
    try {
      const [parentDirectory, childName] = this.findParentDirectoryAndChildName(
        this,
        path.split("/"),
      );

      parentDirectory._children.push(new Directory(childName));

      parentDirectory.sortChildrenByName();
    } catch (error) {
      const badDirectoryName = (error as Error).message;

      return this.createCommandError("create", path, badDirectoryName);
    }
  }

  public list(space = ""): void {
    this._children.forEach((child) => {
      console.log(space + child._name);
      child.list(space + "  ");
    });
  }

  public move(fromPath: string, toPath: string): string | undefined {
    try {
      const fromDirectory = this.findDirectory(this, fromPath.split("/"));
      const toDirectory = this.findDirectory(this, toPath.split("/"));

      toDirectory._children.push(fromDirectory);

      toDirectory.sortChildrenByName();

      const error = this.delete(fromPath);

      if (error) {
        return error;
      }
    } catch (error) {
      const badDirectoryName = (error as Error).message;
      const badPath = fromPath.includes(badDirectoryName) ? fromPath : toPath;

      return this.createCommandError("move", badPath, badDirectoryName);
    }
  }

  public delete(path: string): string | undefined {
    try {
      const [parentDirectory, childName] = this.findParentDirectoryAndChildName(
        this,
        path.split("/"),
      );

      const indexOfDirectoryToDelete = parentDirectory._children.findIndex(
        (child) => child._name === childName,
      );

      if (indexOfDirectoryToDelete === -1) {
        return this.createCommandError("delete", path, childName);
      }

      parentDirectory._children.splice(indexOfDirectoryToDelete, 1);
    } catch (error) {
      const badDirectoryName = (error as Error).message;

      return this.createCommandError("delete", path, badDirectoryName);
    }
  }

  private findParentDirectoryAndChildName(
    currDirectory: Directory,
    directoryNames: string[],
  ): [Directory, string] {
    if (directoryNames.length === 1) {
      return [currDirectory, directoryNames[0]];
    }

    const nextDirectory = this.getNextDirectory(currDirectory, directoryNames);

    return this.findParentDirectoryAndChildName(nextDirectory, directoryNames);
  }

  private findDirectory(
    currDirectory: Directory,
    directoryNames: string[],
  ): Directory {
    if (directoryNames.length === 0) {
      return currDirectory;
    }

    const nextDirectory = this.getNextDirectory(currDirectory, directoryNames);

    return this.findDirectory(nextDirectory, directoryNames);
  }

  private getNextDirectory(
    currDirectory: Directory,
    directoryNames: string[],
  ): Directory {
    const nextDirectoryName = directoryNames.shift();

    const nextDirectory = currDirectory._children.find(
      (directory) => directory._name === nextDirectoryName,
    );

    if (!nextDirectory) {
      throw new Error(nextDirectoryName);
    }

    return nextDirectory;
  }

  private sortChildrenByName(): void {
    this._children.sort((a, b) => a._name.localeCompare(b._name));
  }

  private createCommandError(
    command: string,
    path: string,
    target: string,
  ): string {
    return `Cannot ${command} ${path} - ${target} does not exist`;
  }
}
