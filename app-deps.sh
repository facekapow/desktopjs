#!/bin/bash

# This script assumes you're current directory is the repository's root.

cd apps

# app: files
cd files
bower update
cd ../

# done with all app dependencies
cd ../ # back to the repo's root
exit 0
