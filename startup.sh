#! /bin/sh


sudo python /home/pi/emolance-pi/control-scripts/inputtest.py &

/usr/bin/nohup /usr/local/bin/node /home/pi/emolance-pi/node-server/app.js &
