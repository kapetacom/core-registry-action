import * as exec from "@actions/exec";
import * as core from "@actions/core";

let output = "";

const options: exec.ExecOptions = {};
options.listeners = {
  stdout: (data: Buffer) => {
    output += data.toString();
  },
};

const credentials = core.getInput("credentials");
if (credentials === "") {
  core.setFailed("credentials is required and shouldn't be empty");
}
options.env = {
  CI: "true",
  KAPETA_CI: "true",
  ...process.env,
  KAPETA_CREDENTIALS_TOKEN: credentials,
};

try {
  await exec.exec("npm", ["install", "-g", "@kapeta/kap"], options);
} catch (err: any) {
  core.setFailed(`error installing kap cli: ${err}`);
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
  await exec.exec("npm", ["exec", "-c", "which kap"], options);
} catch (err: any) {
  core.setFailed(`error gettring kap binary location: ${err}`);
}

const kapCliPath = output.trim();

try {
  await exec.exec(kapCliPath, ["init"], options);
} catch (err: any) {
  core.setFailed(`error configuring kap with init: ${err}`);
}

const action = core.getInput("action");

try {
  await exec.exec(
    kapCliPath,
    [
      "registry",
      action,
      "--skip-linking",
      "--skip-install",
      "--ignore-working-directory",
    ],
    options
  );
} catch (err: any) {
  core.setFailed(`error pusing to Kapeta registry ${err}`);
}
