import keyboard
import sys
sys.path.append('./lcd')
import requests
import signal
import RPi.GPIO as GPIO
import os
from datetime import datetime
from time import sleep
import threading
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import subprocess
import cv2
from pyzbar.pyzbar import decode
import matplotlib.pyplot as plt

from lib_lcd import my_lcd 

lcd = my_lcd(True)

# gpio pin of esp32 and pir sensor
PIR_GPIO = 22
ESP_TRIGGER_GPIO = 24

# set mode and disable gpio warning
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# config GPIO
GPIO.setup(ESP_TRIGGER_GPIO, GPIO.OUT) # GPIO24 use for trigger ESP32
GPIO.setup(PIR_GPIO, GPIO.IN, pull_up_down=GPIO.PUD_DOWN) # GPIO22 use for PIR sensor

# MY LAPTOP DELL NODEJS SERVER
url = "http://192.168.137.1:7000/home/account"  

# off esp32 command
GPIO.output(ESP_TRIGGER_GPIO, GPIO.LOW)

script_path = "/home/phuong/nodejs/pi-rfid/read.py" 

data = {
    "isbn": "",  
    "user": ""      
}

admin_just_enter = False    

def run_script(script_path):
    try:
        result = subprocess.run(
            ['/home/phuong/python/venv/bin/python', script_path],  
            text=True,                
            capture_output=True,      
            check=True               
        )
        # print("Output của script:")
        # print(result.stdout) 
        return result.stdout
    except subprocess.CalledProcessError as e:
        print("Script gặp lỗi:")
        print(e.stderr)  # In ra lỗi từ script
        return None
    
def pir_callback(channel):
    print("pir_callback calling")
    global admin_just_enter
    if(admin_just_enter == False):
        output = run_script(script_path)
        # id_text, error = read_with_timeout(reader, 2)  # timeout 5 giây
        if output == None:
            print("Error run_script")
            return
        elif output != "time out\n":
            print("Read RFID sucess :" + output)
            data["user"] = output.strip()
            # print("Trigger ESP32 on")
            if(output.strip() == "admin"):
                print("ADMIN command !!!")
                admin_just_enter = True
                lcd.change_to_admin_state()
                return
            else:
                print("normal user comand")
                GPIO.output(ESP_TRIGGER_GPIO, GPIO.HIGH)
                sleep(0.3)
                GPIO.output(ESP_TRIGGER_GPIO, GPIO.LOW)
                return
        else:
            print("Read RFID card timeout !!!")
            # print("Trigger ESP32 off")
    elif(admin_just_enter == True):
        print("one writing process !!! DONT read RFID")
        if(lcd.query_rfid_status == False):
            admin_just_enter = False
            print("return Read RFID resource for read")
            output = run_script(script_path)
            # id_text, error = read_with_timeout(reader, 2)  # timeout 5 giây
            if output == None:
                print("Error run_script")
            elif output != "time out\n":
                print("Read RFID sucess :" + output)
                data["user"] = output.strip()
                # print("Trigger ESP32 on")
                if(output.strip() == "admin"):
                    print("ADMIN command !!!")
                    admin_just_enter = True
                    lcd.change_to_admin_state()
                else:
                    print("normal user comand")
                    GPIO.output(ESP_TRIGGER_GPIO, GPIO.HIGH)
                    sleep(0.3)
                    GPIO.output(ESP_TRIGGER_GPIO, GPIO.LOW)
                # print("Trigger ESP32 off")
            else:
                print("Read RFID card timeout !!!")
            # print("Trigger ESP32 off")


def read_with_timeout(reader, timeout):
    result = {}   
    # reader = SimpleMFRC522() # reinit SPI bus 
    def target():
        try:
            result['data'] = reader.read()
        except Exception as e:
            result['error'] = str(e)

    thread = threading.Thread(target=target)
    thread.start()

    thread.join(timeout)

    if thread.is_alive():
        return None, "Timeout"
    return result.get('data', None), result.get('error', None)


GPIO.add_event_detect(PIR_GPIO, GPIO.RISING, 
    callback=pir_callback, bouncetime=100)

# call back for barcode file process
class MyHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_time = 0

    def on_modified(self, event):
        if event.src_path == "/home/phuong/nodejs/esp32_cam/uploads/barcode_image.jpg":
            if (int(time.time()) - self.last_time > 3):
                barcode_callback()
            self.last_time = int(time.time())



def detect_and_decode_barcode(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect barcodes in the grayscale image
    barcodes = decode(gray)
    if not barcodes:
        print("scan fail")
        return False
    # Loop over detected barcodes
    for barcode in barcodes:
        # Extract barcode data and type
        barcode_data = barcode.data.decode("utf-8")

        # Print barcode data and type
        print(barcode_data)
        # print("Barcode Type:", barcode_type)

    print("Barcode reading from ESP32 : " + barcode_data)
    data["isbn"] = barcode_data
    return True



def barcode_callback():
    print("barcode image callback calling")
    lcd.change_to_user_state()
    sleep(1)
    image = cv2.imread("/home/phuong/nodejs/esp32_cam/uploads/barcode_image.jpg")
    if (detect_and_decode_barcode(image) == True):
        # Send command to server
        try:
            response = requests.post(url, json=data)

            if response.status_code == 200:
                print("process user command sucess, data receive :", response.json())  
                lcd.user_cmd_resulf(response.json())
            else:
                print(f"Error http post, code error is :{response.status_code}.")
        except requests.exceptions.RequestException as e:
            print(f"requests.exceptions.RequestException by phuong: {e}")

observer = Observer()
event_handler = MyHandler()

path_to_watch = "/home/phuong/nodejs/esp32_cam/uploads"  
observer.schedule(event_handler, path=path_to_watch, recursive=False)

observer.start()

print("Start monitor barcode image")

# try:
#     while True:
#         time.sleep(1)  
# except KeyboardInterrupt:
#     observer.stop()

# observer.join()


# while loop
while True:
    # print("Start key event")
    event = keyboard.read_event()
    if event.event_type == keyboard.KEY_DOWN:  
        print(f"Bạn vừa nhấn: {event.name}")
        print(f"{event.name} have been press")
        if(event.name == "up" or event.name == "down") :
            # print("up press")
            lcd.switch_row(event.name)
        elif (event.name == "backspace"):
            lcd.del_char(event.name)
        elif (event.name == "enter"):
            # print("end state machine")
            print(f"book = {lcd.book} ibsn = {lcd.isbn}")
            lcd.enter()
        elif (event.name == "space"):
            lcd.add_char(" ")
        elif (event.name == "tab"):
            lcd.switch_row("down")
        else :
            lcd.add_char(event.name)
    if event.name == "esc":  
        lcd.__init__(True)



# listen_keyboard(on_press=press)



# last_time = int(time.time())

