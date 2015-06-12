#!/bin/bash

DATE=$1

if [ -z "$1" ]; then
    DATE=$(date +"%Y-%m-%d_%H%M")    
fi

#DATE=$(date +"%Y-%m-%d_%H%M")

raspistill --width 1280 --height 960 -vf -hf -o /home/pi/camera/$DATE.jpg

s3cmd put -P /home/pi/camera/$DATE.jpg s3://emolance-photos/

rm /home/pi/camera/$DATE.jpg

