#!/bin/bash

# Script per generare il sito e pubblicare il sito statico così generato su master

echo "> Generate static site..."
bundle exec jekyll build

cd _site

SITE_DIR=`pwd`

cd ~/tmp/
echo "> Clone repo..."
git clone git@github.com:TechIsFun/techisfun.github.io.git
cd techisfun.github.io
echo "> Copy files..."
cp -r $SITE_DIR/* .
echo "> Commit..."
git add -A
git commit -a -m "updated static site"
echo "> Push..."
git push origin master
cd ..
echo "> Cleanup..."
rm -rf techisfun.github.io
echo "> Done"
