#!/bin/sh -e
# Set version to the first argument
action=$1
export CI=true
export KAPETA_CI=true

npm install -g @kapeta/blockctl

cd $GITHUB_WORKSPACE

git config --global --add safe.directory /github/workspace

echo "trying to auto guess head"
git remote set-head origin -a


blockctl init-defaults
echo "********************************************"
echo "************* Pushing to registry **********"
echo "********************************************"

blockctl registry $action --non-interactive --skip-linking --skip-install

