#ifndef __I2C_INTF_H__
#define __I2C_INTF_H__
#include "driver/i2c.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"


#define SDA_PIN GPIO_NUM_15
#define SCL_PIN GPIO_NUM_2




typedef struct{
    char name[20];
    uint8_t *w_data;
    uint8_t *r_data;
    uint8_t length;
    uint8_t addr;
} i2c_intf_t;

esp_err_t i2c_write_data(i2c_intf_t *intf);
esp_err_t i2c_read_data(i2c_intf_t *intf);
esp_err_t esp_i2c_master_init(void);

#endif
