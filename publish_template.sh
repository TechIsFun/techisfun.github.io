#!/bin/bash

DATE=`date +%Y-%m-%d`
TEMPLATE="_drafts/template.md"

TITLE=`cat $TEMPLATE | grep title | sed 's/title: //g' | sed 's/ /-/g' | tr '[:upper:]' '[:lower:]'`

DEST_FILE="$DATE-$TITLE.md"
cp $TEMPLATE _posts/$DEST_FILE

echo "created $DEST_FILE"