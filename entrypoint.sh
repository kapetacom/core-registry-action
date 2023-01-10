#!/bin/sh -e
# Set version to the first argument
action=$1
export CI=true

echo $NPMRC > ~/.npmrc

npm install -g @blockware/blockctl
cd $GITHUB_WORKSPACE

blockctl registry $action
