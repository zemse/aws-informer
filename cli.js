#!/usr/bin/env node
const { spawn } = require("child_process");
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
  try {
    const startTime = Date.now();
    const result = await execWithPrint(command);
    const endTime = Date.now();
    await send(`execution finished, time: ${(endTime - startTime) / 1000} sec`);
    await send("output: " + result);
  } catch (e) {
    await send("there was error: " + JSON.stringify(e));
  }
}

function execWithPrint(command) {
  let arr = command.split(" ");
  let pc = spawn(arr[0], arr.slice(1));
  let output = "";
  pc.stdout.on("data", (data) => {
    process.stdout.write(data);
    output += data.toString();
  });
  pc.stderr.on("data", (data) => {
    process.stderr.write(data);
    output += data.toString();
  });
  return new Promise((resolve) => {
    pc.on("close", () => {
      resolve(output);
    });
  });
}

main().then(() => process.exit(0));
