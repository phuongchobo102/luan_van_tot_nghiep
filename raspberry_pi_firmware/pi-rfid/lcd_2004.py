import keyboard
import sys
sys.path.append('./lcd')

from lib_lcd import my_lcd 

lcd = my_lcd(True)

while True:
    event = keyboard.read_event()
    if event.event_type == keyboard.KEY_DOWN:  # Lắng nghe khi phím được nhấn
        print(f"Bạn vừa nhấn: {event.name}")
        print(f"{event.name} have been press")
        if(event.name == "up" or event.name == "down") :
            # print("up press")
            lcd.switch_row(event.name)
        elif (event.name == "backspace"):
            lcd.del_char(event.name)
        elif (event.name == "enter"):
            print("end state machine")
            print(f"book = {lcd.book} ibsn = {lcd.ibsn}")
            lcd.enter()
        elif (event.name == "space"):
            lcd.add_char(" ")
        elif (event.name == "tab"):
            lcd.switch_row("down")
        else :
            lcd.add_char(event.name)
    if event.name == "esc":  # Thoát nếu nhấn ESC
        break

# listen_keyboard(on_press=press)
