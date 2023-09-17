#!/usr/bin/env node
const { exec, execSync } = require("child_process");
const { send } = require("./messaging/telegram");

const { config } = require("dotenv");
config({ path: "~/.aws-informer.env" });

async function main() {
  await send(`execution started for: ${process.argv.slice(2).join(" ")}`);
  const startTime = Date.now();
  const result = execSync(process.argv.slice(2).join(" "));
  const endTime = Date.now();
  await send(`execution finished, time: ${(endTime - startTime) / 1000} sec`);
  await send(result);
}

main().then(() => process.exit(0));
