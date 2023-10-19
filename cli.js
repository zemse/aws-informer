#!/usr/bin/env node
const { spawn } = require("child_process");
const util = require("util");
const { send, sendTxtFile } = require("./messaging/telegram");

const { config } = require("dotenv");
config({ path: "~/.aws-informer.env" });

let command = process.argv.slice(2).join(" ");

async function main() {
  if (command === "") {
    console.log("usage: informer <command>");
    process.exit(0);
  }

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
  try {
    const result = await execWithPrint(command);
    const endTime = Date.now();
    await send(`execution finished, time: ${(endTime - startTime) / 1000} sec`);
    await sendTxtFile("output.txt", "$ " + command + "\n\n" + result);
  } catch (e) {
    const endTime = Date.now();
    await send(`execution errored, time: ${(endTime - startTime) / 1000} sec`);
    console.log(e);
    await sendTxtFile("error.txt", util.format(e).toString());
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
