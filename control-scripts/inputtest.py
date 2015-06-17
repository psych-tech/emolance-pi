import RPi.GPIO as GPIO
import time
import urllib2

GPIO.setmode(GPIO.BCM)

led = 25

GPIO.setup(led, GPIO.IN, pull_up_down=GPIO.PUD_UP)

toggle = True

while True:
	if GPIO.input(led) == GPIO.LOW and toggle:
                toggle = False
		print("Switch pressed")
		url = "http://localhost:3000/process/self/trigger"
                content = urllib2.urlopen(url).read()
                print("Triggered the process request: " + content)
                toggle = True


