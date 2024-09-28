
async function updateHumidity(sensorId, circleBorder) {
//    const targetHumidity = Math.floor(Math.random() * 101); // giá trị mà sensor gửi lên
    try {
        const response = await fetch(`/get_values?sensorId=${sensorId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data.value);
        const targetHumidity = data.value; // Adjust based on your response structure
        console.log(targetHumidity);
        animateHumidityChange(sensorId, targetHumidity, circleBorder);
    } catch (error) {
        console.error('Error fetching humidity:', error);
    }
//    animateHumidityChange(sensorId, targetHumidity);
}

function animateHumidityChange(sensorId, targetHumidity, circleBorder) {
    let currentHumidity = parseInt(document.getElementById(`${sensorId}`).innerText) || 0; // Giá trị bắt đầu
    const stepTime = 20; // Thay đổi thời gian giữa các bước (ms)
    const totalSteps = Math.abs(targetHumidity - currentHumidity); // Tổng số bước cần thực hiện
    let currentStep = 0;

    const interval = setInterval(() => {
        if (currentStep < totalSteps) {
            currentHumidity += (targetHumidity > currentHumidity ? 1 : -1);
            const percentage = currentHumidity; // Giá trị độ ẩm từ 0 đến 100
            if (sensorId != "air-temperature") {
                document.getElementById(`${sensorId}`).textContent = currentHumidity + '%';
                document.getElementById(`${circleBorder}`).style.background = `conic-gradient(#4dd0e1 ${percentage * 3.6}deg, #e0e0e0 ${percentage * 3.6}deg)`;
            }
            else {
                
                    const maxTemperature = 80; // Nhiệt độ tối đa
                    const minTemperature = 10; // Nhiệt độ tối thiểu
                    // Lấy giá trị ngẫu nhiên để mô phỏng
                    // const targetTemperature = Math.floor(Math.random() * (maxTemperature - minTemperature + 1)) + minTemperature; 
                    const fill = document.getElementById('circleBorder3');
                    const temperatureText = document.getElementById('air-temperature');
                    
                    temperatureText.textContent = targetHumidity + '°C'; // Hiển thị giá trị nhiệt độ

                    // Cập nhật chiều cao của phần màu đỏ
                    const heightPercentage = ((targetHumidity - minTemperature) / (maxTemperature - minTemperature)) * 100;
                    fill.style.height = `${heightPercentage}%`;
            
//                fix this, change this to a thermometer
                // document.getElementById(`${sensorId}`).textContent = currentHumidity + ' degrees';
                // document.getElementById(`${circleBorder}`).style.background = `conic-gradient(#4dd0e1 ${percentage * 3.6}deg, #e0e0e0 ${percentage * 3.6}deg)`;
            }

            currentStep++;
        } else {
            clearInterval(interval);
        }
    }, stepTime);
}



// Cập nhật giá trị độ ẩm mỗi 4 giây cho từng cảm biến
setInterval(() => updateHumidity("air-humidity", "circleBorder1"), 1000);
setInterval(() => updateHumidity("dirt-humidity", "circleBorder2"), 1000);
setInterval(() => updateHumidity("air-temperature", "circleBorder3"), 1000);
