import Commands from "./commands";
import readline from "readline";

async function main() {
  const commands = new Commands();
  const rl = readline.createInterface({
    input: process.stdin,
  });

  // process each line
  for await (const input of rl) {
    console.log(input);
    commands.process(input);
  }
}

main();
