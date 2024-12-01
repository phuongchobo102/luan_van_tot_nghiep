
#include "i2c_intf.h"
#include "esp_log.h"
#include "unistd.h"
#include "stdio.h"

#include "FreeRTOSConfig.h"

#define I2C_NUM I2C_NUM_0
#define I2C_WAIT_TRACE (100/portTICK_PERIOD_MS)

#define IDLE 0
#define RESEVERSE 1

static const char *TAG = "I2C interface";

typedef struct {
    char* pt_name_w;
    char* pt_name_r;
    uint8_t sema4_read;
    uint8_t sema4_write;
}i2c_sm4_obj_t;

i2c_sm4_obj_t sema4 = {
    .sema4_read = 0,
    .sema4_write = 0,
    .pt_name_r = NULL,
    .pt_name_w = NULL
};


esp_err_t esp_i2c_master_init(void)
{
    int i2c_master_port = I2C_NUM;
    i2c_config_t conf = {
    .mode = I2C_MODE_MASTER,
    .sda_io_num = SDA_PIN,
    .scl_io_num = SCL_PIN,
    .sda_pullup_en = GPIO_PULLUP_ENABLE,
    .scl_pullup_en = GPIO_PULLUP_ENABLE,
    .master.clk_speed = 100000,
    };

    i2c_param_config(i2c_master_port, &conf);

    return i2c_driver_install(i2c_master_port, conf.mode, 0, 0, 0);
}

esp_err_t i2c_write_data(i2c_intf_t *intf){
    // check sema4 resource
    if(sema4.sema4_write != IDLE){
        uint8_t time_out =0 ;
        //resource busy now - > wait for resource release
        ESP_LOGE(TAG, "i2c_write_data resource busy !!!\n");
        printf("Wait for %s release i2c resource\n",sema4.pt_name_w);
        while(sema4.sema4_write != IDLE){
            // wait until sema4.sema4_write = IDLE
            time_out ++;
            vTaskDelay(10/portTICK_PERIOD_MS);
            if(time_out == 5){
                ESP_LOGE(TAG, "i2c_write_data wait time out\n");
                return ESP_FAIL;
            }
        }
        ESP_LOGE(TAG, "i2c_write_data register resource now\n");
    }
    // register sema4 resource 
    sema4.sema4_write = RESEVERSE;
    sema4.pt_name_w = intf->name;

	esp_err_t ret =  i2c_master_write_to_device(I2C_NUM, intf->addr, intf->w_data, intf->length , I2C_WAIT_TRACE);

    //release resource
    sema4.sema4_write = IDLE;
    sema4.pt_name_w = NULL;

    return ret;
}

esp_err_t i2c_read_data(i2c_intf_t *intf){
    // check sema4 resource
    if(sema4.sema4_read != IDLE){
        uint8_t time_out =0 ;
        //resource busy now - > wait for resource release
        ESP_LOGE(TAG, "i2c_read_data resource busy !!!\n");
        printf("Wait for %s release i2c resource\n",sema4.pt_name_r);
        while(sema4.sema4_read != IDLE){
            // wait until sema4.sema4_write = IDLE
            time_out ++;
            vTaskDelay(10/portTICK_PERIOD_MS);
            if(time_out == 5){
                ESP_LOGE(TAG, "i2c_read_data wait time out\n");
                return ESP_FAIL;
            }
        }
        ESP_LOGE(TAG, "i2c_read_data register resource now\n");
    }
    // register sema4 resource 
    sema4.sema4_read = RESEVERSE;
    sema4.pt_name_r = intf->name;

	esp_err_t ret = i2c_master_read_from_device(I2C_NUM, intf->addr, intf->r_data, intf->length , I2C_WAIT_TRACE);

    //release resource
    sema4.sema4_read = IDLE;
    sema4.pt_name_r = NULL;

    return ret;
}
