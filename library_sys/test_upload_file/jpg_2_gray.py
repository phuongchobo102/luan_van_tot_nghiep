# import cv2
# import numpy as np

# # Đọc ảnh và chuyển sang grayscale
# image = cv2.imread("gray.jpg")  # Thay "input_image.jpg" bằng tên file của bạn
import cv2
import numpy as np

# Đọc ảnh và chuyển sang grayscale
image = cv2.imread("gray.jpg")  # Thay bằng tên file của bạn
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Làm mịn ảnh bằng bộ lọc Gaussian để giảm nhiễu
blurred = cv2.GaussianBlur(gray, (3, 3), 0)

# Tạo ảnh làm nét bằng kỹ thuật Unsharp Masking
sharp = cv2.addWeighted(gray, 1.5, blurred, -0.5, 0)

# Tạo ảnh làm nét thêm bằng bộ lọc Laplacian để tăng chi tiết
laplacian = cv2.Laplacian(sharp, cv2.CV_64F)
laplacian = cv2.convertScaleAbs(laplacian)
final_sharpened = cv2.addWeighted(sharp, 1.2, laplacian, 0.3, 0)





# Áp dụng bộ lọc Gaussian Blur để giảm nhiễu
blurred = cv2.GaussianBlur(gray, (5, 5), 0)

# Sử dụng phương pháp ngưỡng để tạo ảnh nhị phân
# Bạn có thể thay đổi giá trị ngưỡng (127) để điều chỉnh độ nhạy
for threshold in range(256):
    # Áp dụng phương pháp ngưỡng
    _, thresholded = cv2.threshold(blurred, threshold, 255, cv2.THRESH_BINARY)
    
    # Lưu ảnh nhị phân với tên file theo định dạng 'mức_ngưỡng_gray.jpg'
    output_filename = f"{threshold}_gray.jpg"
    cv2.imwrite(output_filename, thresholded)

print("Đã tạo xong 256 ảnh nhị phân với các mức ngưỡng từ 0 đến 255.")

# Lưu và hiển thị ảnh
# cv2.imwrite("final_sharpened_image.jpg", final_sharpened)
# cv2.imshow("Original Grayscale Image", gray)
# cv2.imshow("Sharpened Image", final_sharpened)
# cv2.waitKey(0)
# cv2.destroyAllWindows()