#!/usr/bin/env python

import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import sys
reader = SimpleMFRC522()

try:
        # text = input('New data:')
        # print("Now place your tag to write")
        data_to_write = sys.argv[1]
        reader.write(str(data_to_write))
        print(data_to_write)
        # print("Written")
finally:
        GPIO.cleanup()
