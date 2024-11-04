import cv2
from pyzbar.pyzbar import decode
import matplotlib.pyplot as plt
def detect_and_decode_barcode(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Detect barcodes in the grayscale image
    barcodes = decode(gray)

    # Loop over detected barcodes
    for barcode in barcodes:
        # Extract barcode data and type
        barcode_data = barcode.data.decode("utf-8")

        # Print barcode data and type
        print(barcode_data)
        # print("Barcode Type:", barcode_type)
# Read input image
image = cv2.imread("uploads/barcode.jpg")

detect_and_decode_barcode(image)