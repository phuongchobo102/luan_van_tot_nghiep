const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function sendImage() {
  try {
    // Tạo form data và thêm file vào
    const formData = new FormData();
    formData.append('image', fs.createReadStream('./test_upload_file/barcode_image.jpg')); // Đường dẫn đến file ảnh

    // Gửi yêu cầu POST đến server
    const response = await axios.post('http://localhost:7000/upload', formData, {
      headers: {
        ...formData.getHeaders(), // Thiết lập headers cho form-data
      },
    });

    console.log('Upload successful:', response.data);
  } catch (error) {
    console.error('Error uploading image:', error.response ? error.response.data : error.message);
  }
}
function normalizeText(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function areStringsEquivalent(str1, str2) {
    return normalizeText(str1) === normalizeText(str2);
}

// Example usage:
const str1 = "giáo trình";
const str2 = "giao trinh";

if (areStringsEquivalent(str1, str2)) {
    console.log("The strings are equivalent.");
} else {
    console.log("The strings are different.");
}
sendImage();