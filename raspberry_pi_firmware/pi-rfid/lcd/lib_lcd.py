from RPLCD import *
from time import sleep
from RPLCD.i2c import CharLCD
import unicodedata
import requests
import threading
import subprocess
from unidecode import unidecode

SEARCH = 0
CHOOSE = 1
RESULT = 2
SEARCH_FAIL = 3
MAIN_MENU = 4
ADMIN_ACTION = 5
ADMIN_RESULT = 6
USER_COMMAND = 7
USER_RESULT = 8

ROW1 = 0
ROW2 = 1
ROW3 = 2
ROW4 = 3

VALID = 1
INVALID = 2

NOTTHING = 0
BOOK_INVALID = 1
BOOK_NOT_BORROW = 2
BOOK_ONTIME = 3
BOOK_LATE = 4 
BORROW_SUCESS = 5
BORROW_FAIL = 6

def remove_accents(input_str):
    nfkd_form = unicodedata.normalize('NFD', input_str)
    return ''.join([c for c in nfkd_form if not unicodedata.combining(c)])

def get_last_20_chars(input_string):
    if len(input_string) < 15:
        return input_string
    return input_string[-15:]

def get_last_13_chars(input_string):
    if len(input_string) < 13:
        return input_string
    return input_string[-13:]

def get_last_chars(input_string, number):
    if len(input_string) < number:
        return input_string
    return input_string[-number:]

# script_path = "/home/phuong/nodejs/pi-rfid/write.py " 



class my_lcd :
    def __init__(self,first_time):
        if(first_time == True):
            # self.stop_scrolling()
            self.stop_thread = True
            self.state = MAIN_MENU
            self.lcd = CharLCD('PCF8574', 0x27)
            self.books = ""
            self.scroll_thread = None
            # self.stop_thread = False
        # self.point = (0,6)
        if(self.state == MAIN_MENU):
            self.main_menu_init()
        if(self.state == SEARCH):
            self.search_init()
        elif(self.state == SEARCH_FAIL):
            self.search_fail_init()
        elif(self.state == CHOOSE):
            self.choose_init()
        elif(self.state == RESULT):
            self.result_init()
        elif(self.state == ADMIN_ACTION):
            self.admin_command_init()
        elif(self.state == USER_COMMAND):
            self.user_command_init()

    def add_char(self,char):
        if(self.state == SEARCH):
            if(self.dir == ROW2) :
                self.book += char
                # self.lcd.write_string(str(char))
                self.lcd.cursor_pos = (ROW2, 5)
                self.lcd.write_string(get_last_20_chars(self.book ))
            elif (self.dir == ROW3):
                self.author += char
                self.lcd.cursor_pos = (ROW3, 7) 
                # self.lcd.write_string(str(char))
                self.lcd.write_string(get_last_13_chars(self.author ))
            elif (self.dir == ROW4):
                self.isbn += char
                self.lcd.cursor_pos = (ROW4, 5) 
                # self.lcd.write_string(str(char))
                self.lcd.write_string(get_last_20_chars(self.isbn ))
        if(self.state == ADMIN_ACTION):
            self.user_id += char
            self.lcd.cursor_pos = (ROW4, 8)
            self.lcd.write_string(get_last_chars(self.user_id, 12))

    def del_char(self,char):
        if(self.state == SEARCH):
            if(self.dir == ROW2) :
                self.book  = self.book[:-1]
                self.lcd.cursor_pos = (ROW2, 5)
                self.lcd.write_string(" " * 15)
                self.lcd.cursor_pos = (ROW2, 5)
                self.lcd.write_string(get_last_20_chars(self.book ))
                # self.lcd.cursor_pos = (ROW2, len(self.book) + 5) 
                # self.lcd.write_string(" ")
                # self.lcd.cursor_pos = (ROW2, len(self.book) + 5) 
            elif (self.dir == ROW4):
                self.isbn  = self.isbn[:-1]
                self.lcd.cursor_pos = (ROW4, 5)
                self.lcd.write_string(" " * 15)
                self.lcd.cursor_pos = (ROW4, 5)
                self.lcd.write_string(get_last_20_chars(self.isbn ))
                # self.lcd.cursor_pos = (ROW4, len(self.isbn) + 5)
                # self.lcd.write_string(" ") 
                # self.lcd.cursor_pos = (ROW4, len(self.isbn) + 5) 
            elif (self.dir == ROW3):
                self.author  = self.author[:-1]
                self.lcd.cursor_pos = (ROW3, 7)
                self.lcd.write_string(" " * 13)
                self.lcd.cursor_pos = (ROW3, 7)
                self.lcd.write_string(get_last_13_chars(self.author ))
                # self.lcd.cursor_pos = (ROW3, len(self.isbn) + 5)
                # self.lcd.write_string(" ") 
                # self.lcd.cursor_pos = (ROW3, len(self.isbn) + 5) 
        if(self.state == ADMIN_ACTION):
            self.user_id  = self.user_id[:-1]
            self.lcd.cursor_pos = (ROW4, 8)
            self.lcd.write_string(" " * 12)
            self.lcd.cursor_pos = (ROW4, 8)
            self.lcd.write_string(get_last_chars(self.user_id , 12))

    def switch_row(self,dir):
        if(self.state == SEARCH):
            print(dir)
            print(self.dir)
            if (dir == "up"):
                direction = -1
            else:
                direction = 1
            if(self.dir == ROW2 and dir == "up"):
                print("up press")
                self.dir = ROW4
                if(len(self.isbn)  < 15):
                        self.lcd.cursor_pos = (self.dir, len(self.isbn) + 5) 
                else:
                    self.lcd.cursor_pos = (self.dir, 19) 
            elif(self.dir == ROW4 and dir == "down"):
                print("down press")
                self.dir = ROW2
                if(len(self.book)  < 15):
                        self.lcd.cursor_pos = (self.dir, len(self.book) + 5) 
                else:
                    self.lcd.cursor_pos = (self.dir, 19) 
            else:
                print("normal switch")
                self.dir += direction
                if(self.dir == ROW2):
                    if(len(self.book)  < 15):
                        self.lcd.cursor_pos = (self.dir, len(self.book) + 5) 
                    else:
                        self.lcd.cursor_pos = (self.dir, 19) 
                elif(self.dir == ROW3):
                    if(len(self.author)  < 15):
                        self.lcd.cursor_pos = (self.dir, len(self.author) + 7) 
                    else:
                        self.lcd.cursor_pos = (self.dir, 19)
                elif(self.dir == ROW4):
                    if(len(self.isbn)  < 15):
                        self.lcd.cursor_pos = (self.dir, len(self.isbn) + 5) 
                    else:
                        self.lcd.cursor_pos = (self.dir, 19) 
                    # self.lcd.cursor_pos = (self.dir, len(self.isbn) + 5)  
            # if(self.dir == ROW4 ) :
            #     print("up press")
            #     self.dir = ROW2
            #     self.lcd.cursor_pos = (ROW2, len(self.book) + 5) 
            # elif(self.dir == ROW2 ) :
            #     print("down press")
            #     self.dir = ROW4
            #     self.lcd.cursor_pos = (ROW4, len(self.isbn) + 5) 

        elif(self.state == CHOOSE):
            self.stop_scrolling()
            self.write_text(self.books[self.dir_choose - 1]["book"][0:(20)],self.dir_choose)
            if(dir == "down"):
                if(self.dir_choose != self.choose_len):
                    self.dir_choose += 1
                else:
                    self.dir_choose = 1
            if(dir == "up"):
                if(self.dir_choose != 1):
                    self.dir_choose -= 1
                else:
                    self.dir_choose = self.choose_len
            # sleep(0.2)
            self.lcd.cursor_pos = (self.dir_choose, 0) 
            self.force_scroll(self.books[self.dir_choose - 1]["book"],self.dir_choose)
            # self.lcd.cursor_pos = (self.dir_choose, 0) 
            # self.lcd.write_string("~")
            # self.lcd.cursor_pos = (self.dir_choose, 0) 

    def enter(self):
        # print("am in enter function" + self.state)
        if(self.state == MAIN_MENU):
            self.state = SEARCH
            self.reset()
        elif(self.state == SEARCH):   
            self.books = self.query_book()
            for book in self.books:
                book["author"] = unidecode(book["author"])  # Decode từ bytes sang string
            # books=""
            self.choose_len = len(self.books)
            if (self.choose_len == 0) :
                self.state = SEARCH_FAIL
                self.reset()
            else :
                # have result
                self.state = CHOOSE
                self.reset()
        elif(self.state == SEARCH_FAIL):
            self.state = MAIN_MENU
            self.reset()
        elif(self.state == CHOOSE):
            self.stop_scrolling()
            self.state = RESULT
            self.reset()
        elif(self.state == RESULT):
            self.stop_scrolling()
            self.state = MAIN_MENU
            self.reset()
        elif(self.state == ADMIN_ACTION):
            print("Change from admin to main menu")
            self.stop_scrolling()
            self.rfid_data = self.write_rfid_card()
            if(self.rfid_data["status"] == "yes"):
                print("query sucess !!!")
                # self.query_rfid_status = True
                output = self.run_script( self.rfid_data["user_name"])
                print(output)
                self.query_rfid_status = False
                self.lcd.cursor_pos = (ROW4, 0) 
                self.lcd.write_string("    WRITE SUCESS")
            else:
                self.query_rfid_status = False
                print("query False !!!")
                self.lcd.cursor_pos = (ROW4, 0) 
                self.lcd.write_string("   WRONG USER ID!")
            print(self.rfid_data)
            self.state = ADMIN_RESULT
        elif(self.state == ADMIN_RESULT):
            self.stop_scrolling()
            self.state = MAIN_MENU
            self.reset()
        elif(self.state == USER_RESULT):
            self.stop_scrolling()
            self.state = MAIN_MENU
            self.reset()
            
            

    def reset(self):
        print("Resetting object...")
        self.__init__(False)  

    def search_init(self):
        self.lcd.clear()
        self.state = SEARCH
        self.books = None
        self.book = ""
        self.isbn = ""
        self.author = ""
        self.dir = ROW2
        self.lcd.cursor_mode = 'blink'
        self.lcd.cursor_pos = (ROW1, 0) 
        self.lcd.write_string("  Search book here")
        self.lcd.cursor_pos = (ROW2, 0) 
        self.lcd.write_string("book:")
        self.lcd.cursor_pos = (ROW3, 0) 
        self.lcd.write_string("author:")
        self.lcd.cursor_pos = (ROW4, 0) 
        self.lcd.write_string("isbn:")
        self.lcd.cursor_pos = (ROW2, 5)

    def main_menu_init(self):
        self.lcd.clear()
        self.state = MAIN_MENU
        self.books = None
        self.book = ""
        self.isbn = ""
        self.author = ""
        self.lcd.cursor_mode = 'hide'
        self.lcd.cursor_pos = (ROW1, 0) 
        self.lcd.write_string("********************")
        self.lcd.cursor_pos = (ROW2, 0) 
        self.lcd.write_string(" WELCOME TO LIBRARY")
        self.lcd.cursor_pos = (ROW3, 0) 
        self.lcd.write_string("********************")
        # self.lcd.cursor_pos = (ROW4, 0) 
        # self.lcd.write_string("isbn:")
        # self.lcd.cursor_pos = (ROW2, 5)

    def choose_init(self) :
        self.lcd.cursor_mode = 'hide'
        self.dir_choose = ROW2
        self.lcd.clear()
        self.lcd.cursor_pos = (ROW1, 0) 
        self.lcd.write_string("    Your result") 
        for i, book in enumerate(self.books, start=1):  # Bắt đầu đánh số từ 1
            print(f"Sách {i}:")
            print(f"  Tên sách: {book['book']}")
            print(f"  Tác giả: {book['author']}")
            print("-" * 20)
            if (i == 4):
                break
            if(book['book'] != None):
                self.lcd.cursor_pos = (i, 0) 
                self.lcd.write_string(book['book'][0:(20)])
        self.force_scroll(self.books[0]["book"],1)


    def search_fail_init(self):
        self.lcd.cursor_mode = 'hide'
        self.lcd.clear()
        self.lcd.cursor_pos = (ROW1, 0) 
        self.lcd.write_string("    Your result")
        self.lcd.cursor_pos = (ROW2, 0) 
        self.lcd.write_string("     ~ Sorry ~")
        self.lcd.cursor_pos = (ROW3, 0) 
        self.lcd.write_string("This book does not")
        self.lcd.cursor_pos = (ROW4, 0) 
        self.lcd.write_string("exist in database!")

    def result_init(self):
        self.lcd.cursor_mode = 'hide'
        self.lcd.clear()
        self.lcd.cursor_pos = (ROW1, 0) 
        self.lcd.write_string("  Your book status")
        # self.lcd.write_string(self.books[self.dir_choose - 1]["book"])
        self.lcd.cursor_pos = (ROW3, 0) 
        self.lcd.write_string( self.books[self.dir_choose - 1]["author"][0:15])
        self.lcd.cursor_pos = (ROW4, 0) 
        if(self.books[self.dir_choose - 1]["issue"] == 0):
            self.lcd.write_string("status: YES.")
        else :
            self.lcd.write_string("status: NO.")
        # sleep(2)
        self.lcd.cursor_pos = (ROW2, 0) 
        self.write_text(self.books[self.dir_choose - 1]["book"],ROW2)

    def query_book(self):
        data = {
            "book": self.book,
            "isbn": self.isbn, 
            "author" : self.author
        }
        url = 'http://192.168.137.1:7000/pi_2w_query'

        response = requests.post(url, json=data)
        # self.books = response.json()
        if response.status_code == 200:
            print("Dữ liệu từ server:", response.json())
        else:
            print("Lỗi khi gửi yêu cầu:", response.status_code)
        return response.json()
    
    def write_rfid_card(self):
        data = {
            "user_id": self.user_id
        }
        url = 'http://192.168.137.1:7000/pi_2w_query/write_rfid'

        response = requests.post(url, json=data)
        # self.books = response.json()
        if response.status_code == 200:
            print("Dữ liệu từ server:", response.json())
        else:
            print("Lỗi khi gửi yêu cầu:", response.status_code)
            return False
        
        return response.json()
    
    def write_text(self, text, row):
        if len(text) > 20:
            self.stop_thread = False  
            if self.scroll_thread is None or not self.scroll_thread.is_alive():
                self.scroll_thread = threading.Thread(target=self.scroll_text, args=(text,row))
                self.scroll_thread.start()
        else:
            self.lcd.cursor_pos = (row, 0) 
            self.lcd.write_string(text)  
    
    def force_scroll(self, text, row):
        
        # if len(text) > 20:
        self.stop_thread = False 
        if self.scroll_thread is None or not self.scroll_thread.is_alive():
            self.scroll_thread = threading.Thread(target=self.scroll_text, args=(text,row))
            self.scroll_thread.start()
        # else:
        #     self.lcd.cursor_pos = (row, 0) 
        #     self.lcd.write_string(text) 

    def scroll_text(self, text, row):
        text = text + " " * 5 + text 
        while not self.stop_thread:
            for i in range(len(text) - 19):  
                # self.lcd.clear()
                if (self.stop_thread == True):
                    break
                self.lcd.cursor_pos = (row, 0) 
                self.lcd.write_string(text[i:(i+20)]) 
                sleep(0.39)  

    def stop_scrolling(self):
        self.stop_thread = True
        if self.scroll_thread is not None:
            self.scroll_thread.join() 
    
    def change_to_admin_state(self):
        self.stop_scrolling()
        self.state = ADMIN_ACTION
        self.reset()

    def change_to_user_state(self):
        self.stop_scrolling()
        self.state = USER_COMMAND
        self.reset()

    def user_command_init(self):
        self.state = USER_COMMAND
        self.lcd.clear()
        # self.state = MAIN_MENU
        # self.query_rfid_status = True
        self.books = None
        self.book = ""
        self.isbn = ""
        self.author = ""
        self.user_id = ""
        self.lcd.cursor_mode = 'hide'
        self.lcd.cursor_pos = (ROW1, 0) 
        self.lcd.write_string("********************")
        self.lcd.cursor_pos = (ROW2, 0) 
        self.lcd.write_string("    WELCOME USER")
        self.lcd.cursor_pos = (ROW3, 0) 
        self.lcd.write_string("********************")
        self.lcd.cursor_pos = (ROW4, 0) 
        self.lcd.write_string("  on processing...")

    def user_cmd_resulf(self,data):
        self.lcd.clear()
        self.state = USER_RESULT
        # self.query_rfid_status = True
        self.books = None
        self.book = ""
        self.isbn = ""
        self.author = ""
        self.user_id = ""
        self.lcd.cursor_mode = 'hide'
        self.lcd.cursor_pos = (ROW1, 0) 
        self.lcd.write_string("********************")
        self.lcd.cursor_pos = (ROW2, 0) 
        self.lcd.write_string("    WELCOME USER")
        self.lcd.cursor_pos = (ROW3, 0) 
        self.lcd.write_string("********************")
        self.lcd.cursor_pos = (ROW4, 0) 
        if(data["user"] == INVALID):
            self.lcd.write_string("   WRONG USER !!!")
        elif(data["processCode"] == BOOK_LATE):
            self.lcd.write_string("  RETURN BOOK LATE")
        elif(data["processCode"] == BOOK_ONTIME):
            self.lcd.write_string(" RETURN BOOK SUCESS")
        elif(data["processCode"] == BORROW_FAIL):
            self.lcd.write_string("  BORROW FAILURE !")
        elif(data["processCode"] == BORROW_SUCESS):
            self.lcd.write_string(" BORROW BOOK SUCESS")
        print(data)

    def admin_command_init(self):
        self.state = ADMIN_ACTION
        self.lcd.clear()
        # self.state = MAIN_MENU
        self.query_rfid_status = True
        self.books = None
        self.book = ""
        self.isbn = ""
        self.author = ""
        self.user_id = ""
        self.lcd.cursor_mode = 'hide'
        self.lcd.cursor_pos = (ROW1, 0) 
        self.lcd.write_string("********************")
        self.lcd.cursor_pos = (ROW2, 0) 
        self.lcd.write_string("    WELCOME ADMIN")
        self.lcd.cursor_pos = (ROW3, 0) 
        self.lcd.write_string("********************")
        self.lcd.cursor_pos = (ROW4, 0) 
        self.lcd.write_string("USER ID:")

    def run_script(self,args):
        print("Run write script")
        try:
            script_path = "/home/phuong/nodejs/pi-rfid/write.py" 
            # Đảm bảo args là một danh sách
            if isinstance(args, str):
                args = [args]
            command = ['/home/phuong/python/venv/bin/python', script_path] + args
            result = subprocess.run(
                # ['/home/phuong/python/venv/bin/python', script_path], 
                command, 
                text=True,                
                capture_output=True,      
                check=True               
            )
            # print("Output của script:")
            # print(result.stdout) 
            print("Write RFID sucess")
            self.query_rfid_status = False
            return result.stdout
        except subprocess.CalledProcessError as e:
            print("Script gặp lỗi:")
            self.query_rfid_status = False

            print(e.stderr)  # In ra lỗi từ script
            return None
 






         
