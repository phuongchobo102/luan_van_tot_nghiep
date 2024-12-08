const { spawn } = require('child_process');

// Chạy file Python
// const pythonProcess = spawn('python3', ['lcd_2004.py']); 

const pythonPath = path.resolve('~/python/venv/bin/python3');  // Chuyển ~ thành đường dẫn tuyệt đối
const scriptPath = path.resolve('lcd_2004.py');  // Đảm bảo đường dẫn tuyệt đối cho script

// Chạy lệnh với sudo
const pythonProcess = spawn('sudo', [pythonPath, scriptPath]);
// Lắng nghe output của Python (stdout)
pythonProcess.stdout.on('data', (data) => {
    // Chuyển đổi data thành string và chia thành các dòng
    const output = data.toString();
    const lines = output.split('\n');
    lines.forEach(line => {
        if (line) {
            console.log(`Output: ${line}`);
        }
    });
});

// Xử lý khi tiến trình Python gặp lỗi
pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data.toString()}`);
});

// Xử lý khi tiến trình Python kết thúc
pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
});
