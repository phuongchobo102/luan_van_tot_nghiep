import subprocess

def run_script(script_path):
    try:
        # Chạy file Python khác và thu thập output
        result = subprocess.run(
            ['python3', script_path],  # Lệnh chạy script
            text=True,                # Output ở dạng chuỗi thay vì byte
            capture_output=True,      # Ghi nhận output
            check=True                # Ném lỗi nếu script trả về mã lỗi khác 0
        )
        print("Output của script:")
        print(result.stdout)  # In ra output của script
        return result.stdout
    except subprocess.CalledProcessError as e:
        print("Script gặp lỗi:")
        print(e.stderr)  # In ra lỗi từ script
        return None

if __name__ == "__main__":
    script_path = "/home/phuong/nodejs/pi-rfid/read.py"  # Đường dẫn tới tệp Python khác
    output = run_script(script_path)
    if output:
        print("Kết quả:", output)
