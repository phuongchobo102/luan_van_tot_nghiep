function renderPage(res,page,inputData){
    // user_name,books,ban,time_unlock, admin
    res.render(page, {...inputData});
}

function calculateDaysSince(dateString) {
    // Chuyển đổi chuỗi ngày từ định dạng YYYY-MM-DD sang đối tượng Date
    const startDate = new Date(dateString + 'T00:00:00'); // Đảm bảo giờ là 00:00:00
    const currentDate = new Date(); // Ngày hiện tại

    // Đặt giờ của currentDate về 00:00:00 để chỉ so sánh ngày
    currentDate.setHours(0, 0, 0, 0);

    // Tính số ngày giữa hai ngày
    const timeDifference = currentDate - startDate; // Đơn vị là milliseconds
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Chuyển đổi milliseconds sang days

    return daysDifference; // Trả về số ngày
}

function formatDate(dateString) {
    // Chuyển đổi chuỗi ngày thành đối tượng Date
    const date = new Date(dateString);

    // Lấy năm, tháng và ngày rồi ghép lại thành chuỗi 'YYYY-MM-DD'
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

module.exports = {
    renderPage,
    calculateDaysSince,
    formatDate,
}