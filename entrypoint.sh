#!/bin/sh -e
# Set version to the first argument
action=$1
export CI=true

npmrcfile=$(npm config get userconfig)
echo "Updating $npmrcfile"
mkdir -p $(dirname $npmrcfile) && touch $npmrcfile

echo $NPMRC >> /github/home/.npmrc

npm install -g @blockware/blockctl

cd $GITHUB_WORKSPACE

git config --global --add safe.directory /github/workspace

echo "trying to auto guess head"
git remote set-head origin -a


blockctl init-defaults
echo "********************************************"
echo "************* Pushing to registry **********"
echo "********************************************"

blockctl registry $action -n

