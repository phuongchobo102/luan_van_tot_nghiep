set(app_src LCD_16x2.c)
set(pri_reg )
idf_component_register(SRCS ${app_src}
                    INCLUDE_DIRS "."
                    PRIV_REQUIRES driver esp_timer i2c_interface nvs_flash
                    REQUIRES ${pri_reg})
