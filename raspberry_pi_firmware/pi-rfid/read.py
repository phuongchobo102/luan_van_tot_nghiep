#!/usr/bin/env python3
import sys
import signal
import RPi.GPIO as GPIO
import os

from mfrc522 import SimpleMFRC522
from time import sleep
from rpi_lcd import LCD
from datetime import datetime

# PIR_GPIO = 22
# ESP_TRIGGER_GPIO = 24



GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# config GPIO
# GPIO.setup(ESP_TRIGGER_GPIO, GPIO.OUT) # GPIO24 use for trigger ESP32
# GPIO.setup(PIR_GPIO, GPIO.IN, pull_up_down=GPIO.PUD_DOWN) # GPIO22 use for PIR sensor

# create rc522 object
reader = SimpleMFRC522()

# GPIO.output(ESP_TRIGGER_GPIO, GPIO.LOW)

# signal handler function
def signal_handler(sig, frame):
    GPIO.cleanup()
    sys.exit(0)

# register signale handler function
signal.signal(signal.SIGINT, signal_handler)

# Time out function handler
def timeout_handler(signum, frame):
    print("time out")
    sys.exit(0)

signal.signal(signal.SIGALRM, timeout_handler)

# def pir_callback(channel):
signal.alarm(1)  # Timeout 5 seconds
id, text = reader.read()
signal.alarm(0) 
print(text)
# GPIO.output(ESP_TRIGGER_GPIO, GPIO.HIGH)
os.kill(os.getpid(), signal.SIGINT)
sys.exit(0)

# GPIO.output(ESP_TRIGGER_GPIO, GPIO.LOW)
# GPIO.add_event_detect(PIR_GPIO, GPIO.RISING, 
#             callback=pir_callback, bouncetime=100)


signal.pause()
# while True :
#	GPIO.wait_for_edge(PIR_GPIO, GPIO.RISING )
#	print("PIR_GPIO pin just trigger")



#lcd.text("Library System", 1) 
#try:
#	id, text = reader.read()
#	GPIO.output(ESP_TRIGGER_GPIO, GPIO.HIGH)
#	lcd.text("Data: " + text , 2) 
#	print(text)
#finally:
#	GPIO.output(ESP_TRIGGER_GPIO, GPIO.LOW)
#	GPIO.cleanup()
#	print("clear")
	
