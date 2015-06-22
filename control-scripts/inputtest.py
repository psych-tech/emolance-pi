import RPi.GPIO as GPIO
import time
import urllib2

GPIO.setmode(GPIO.BCM)

led = 25
counter = 0
isTesting = False

GPIO.setup(led, GPIO.IN, pull_up_down=GPIO.PUD_UP)

# Photo capture
def trigger_photo():
        url = "http://localhost:3000/self/process/trigger"
        content = urllib2.urlopen(url).read()
        print("Triggered the process request: " + content)

# Define a threaded callback function to run in another thread when events are detected  
def my_callback(channel):  
    global counter
    global isTesting

    if isTesting:
        return

    if GPIO.input(25) != 1:     # if port 25 != 1  
        print "Falling edge detected on 25 counter: " + str(counter)
	counter = counter + 1
	if counter % 2 == 0:
		isTesting = True
		print "Ready for testing. Sleep first for 5 seconds..."
		time.sleep(5)
		print "Triggering photo capturing..."
		trigger_photo()
		print "Finished photo capture process"
		isTesting = False



GPIO.add_event_detect(25, GPIO.FALLING, callback=my_callback)  


while True:
	time.sleep(0.01)



