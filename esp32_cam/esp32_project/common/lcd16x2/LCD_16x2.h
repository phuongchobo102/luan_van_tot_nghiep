#ifndef THU_VIEN_VJP_H_
#define THU_VIEN_VJP_H_

#include "driver/i2c.h"
#include "esp_log.h"
#include "i2c_intf.h"

#define SLAVE_ADDRESS_LCD 0x27 // change this according to ur setup



void start_lcd(void);

void lcd_init (void);   // initialize lcd

void lcd_send_cmd (char cmd);  // send command to the lcd

void lcd_send_data (char data);  // send data to the lcd

void lcd_send_string (char *str);  // send string to the lcd

void lcd_put_cur(int row, int col);  // put cursor at the entered position row (0 or 1), col (0-15);

void lcd_clear (void);   // clear screen

void lcd_begin(void);    // begin send data to lcd
#endif
