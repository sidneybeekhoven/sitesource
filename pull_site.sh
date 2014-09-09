#!/bin/sh

git fetch github_site master
git subtree pull --prefix site/ github_site master --squash

