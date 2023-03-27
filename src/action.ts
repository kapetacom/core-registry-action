import * as exec from "@actions/exec";
import * as core from "@actions/core";

import { writeFileSync } from "fs";

let output = "";

const options: exec.ExecOptions = {};
options.listeners = {
  stdout: (data: Buffer) => {
    output += data.toString();
  },
};

const credentials = core.getInput("credentials");
options.env = {
  CI: "true",
  KAPETA_CI: "true",
  ...process.env,
  KAPETA_CREDENTIALS_TOKEN: credentials,
};

try {
  await exec.exec("npm", ["install", "-g", "@kapeta/blockctl"], options);
} catch (err: any) {
  core.setFailed(`error installing blockctl: ${err}`);
}

try {
  await exec.exec(
    "git",
    ["config", "--global", "--add", "safe.directory", "/github/workspace"],
    options
  );
} catch (err: any) {
  core.setFailed(`error configuring git: ${err}`);
}

try {
  await exec.exec("git", ["remote", "set-head", "origin", "-a"], options);
} catch (err: any) {
  core.setFailed(`error configuring git remote: ${err}`);
}

output = "";
try {
  await exec.exec("npm", ["-g", "root"], options);
} catch (err: any) {
  core.setFailed(`error gettring npm user binary location: ${err}`);
}

const blockctlPath = output.trim() + "/@kapeta/blockctl/bin/blockctl";

try {
  await exec.exec(blockctlPath, ["init-defaults"], options);
} catch (err: any) {
  core.setFailed(`error configuring blockctl with init-default: ${err}`);
}

const action = core.getInput("action");

try {
  await exec.exec(
    blockctlPath,
    [
      "registry",
      action,
      "--non-interactive",
      "--skip-linking",
      "--skip-install",
      "--ignore-working-directory"
    ],
    options
  );
} catch (err: any) {
  core.setFailed(`error pusing to Kapeta registry ${err}`);
}
