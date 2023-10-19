#!/usr/bin/env node
const { exec, execSync } = require("child_process");
const { send } = require("./messaging/telegram");

const { config } = require("dotenv");
config({ path: "~/.aws-informer.env" });

let command = process.argv.slice(2).join(" ");

async function main() {
  if (command === "--version") {
    console.log(require("./package.json").version);
    process.exit(0);
  }
  if (command === "--test") {
    console.log("sending a test message");
    await send("this is a test message");
    console.log("sent");
    process.exit(0);
  }

  await send(`execution started for: ${command}`);
  const startTime = Date.now();
  const result = execSync(command);
  const endTime = Date.now();
  await send(`execution finished, time: ${(endTime - startTime) / 1000} sec`);
  await send(result);
}

main().then(() => process.exit(0));
