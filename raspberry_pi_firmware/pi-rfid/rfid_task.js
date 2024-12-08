const { spawn } = require('child_process');
const axios = require('axios');
const { exec } = require('child_process');// use for run python code
const path = require('path');

const structToSend = {
        user: "test",
        book_id: 30
    };


function runPythonScript() {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', ['./pi-rfid/read.py']); // Thay path/to/your_script.py bằng đường dẫn đến file Python
        // const pythonPath = path.resolve('~/python/venv/bin/python3');  // Chuyển ~ thành đường dẫn tuyệt đối
        // const scriptPath = path.resolve('lcd_2004.py');  // Đảm bảo đường dẫn tuyệt đối cho script
        // const pythonProcess = spawn('sudo', [pythonPath, scriptPath]);
        let output = '';

        // Nhận dữ liệu từ stdout
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        // Nhận lỗi từ stderr nếu có
        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        // Khi script hoàn thành, xử lý output
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(`Process exited with code ${code}`);
            }
        });
    });
}

async function sendData(data) {
    structToSend.user = data.trim().replace(/\n$/, '');
    // structToSend.book = 30 ;


    // try {
    //     const response = await axios.post('http://192.168.137.1:7000/home/account', structToSend);
    //     console.log('Response from server:', response.data);
    // } catch (error) {
    //     console.error('Error:', error.message);
    // }
}

// Hàm để lặp lại chạy file Python
async function rfid_task() {
    try {
        const result = await runPythonScript();
        //console.log('Output from Python script:', result);
        if(result.trim()== "time out"){
	     console.log("timout in read rfid process");
	     setTimeout(rfid_task, 1000);
	}
	else{
        console.log('RFID data :', result);
        sendData(result);
        // Lặp lại sau một khoảng thời gian, ví dụ 5 giây
        setTimeout(rfid_task, 2000);
	}	
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// console.log("Start RFID task")
// Bắt đầu chạy lần đầu tiên
/**
 * Ch?y do?n m� Python d? hi?n th? text l�n LCD
 * @param {string} text - Chu?i c?n hi?n th?
 * @param {number} line - S? d�ng (1 ho?c 2)
 */
function lcd(text, line) {
    console.log("lcd calling", text, line);
        // Command d? ch?y Python script
        const command = `python3 ./pi-rfid/lcd.py "${text}" ${line}`;
	console.log(command);
        // Ch?y l?nh Python
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(new Error(`Error executing Python script: ${error.message}`));
            }

            if (stderr) {
                return reject(new Error(`Python script error: ${stderr}`));
            }
        });
}

module.exports = {
    rfid_task,
    // structToSend,
    // lcd
}
