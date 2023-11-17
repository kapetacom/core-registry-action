import * as exec from "@actions/exec";
import * as core from "@actions/core";
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

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

const baseUrl = core.getInput("base_url");
if (baseUrl !== "") {
  options.env = {
    ...options.env,
    KAPETA_SERVICE_URL: baseUrl,
  };
}

const kapetaReleaseBranch = core.getInput("release_branch");
if (kapetaReleaseBranch != "") {
  options.env = {
    ...options.env,
    KAPETA_RELEASE_BRANCH: kapetaReleaseBranch,
  };
} 

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

if (kapetaReleaseBranch == "") {
  try {
    await exec.exec("git", ["remote", "set-head", "origin", "-a"], options);
  } catch (err: any) {
    core.setFailed(`error configuring git remote: ${err}`);
  }
}

output = "";
try {
  await exec.exec("npm", ["exec", "-c", "which kap"], options);
} catch (err: any) {
  core.setFailed(`error getting kap binary location: ${err}`);
}

const kapCliPath = output.trim();

try {
  await exec.exec(kapCliPath, ["init"], options);
} catch (err: any) {
  core.setFailed(`error configuring kap with init: ${err}`);
}

const staging = core.getInput("staging") !== "" && core.getBooleanInput("staging");
if (staging) {
  const kapetaHome = path.join(os.homedir(), '.kapeta');
  const registryJson = path.join(kapetaHome, 'registry.json');
  const registryJsonContent = 
  `{
    "registry": {
        "url": "https://registry.staging.kapeta.com",
        "providers": "https://providers.staging.kapeta.com",
        "npm": "https://npm.staging.kapeta.com",
        "maven": "https://maven.staging.kapeta.com",
        "docker": "https://docker.staging.kapeta.com"
    }
  }`;
  fs.writeFileSync(registryJson, registryJsonContent);
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
  core.setFailed(`error running kapeta command ${err}`);
}
