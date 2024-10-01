
async function updateHumidity(sensorId, circleBorder) {
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
}

function animateHumidityChange(sensorId, targetHumidity, circleBorder) {
    let currentHumidity = parseInt(document.getElementById(`${sensorId}`).innerText) || 0; 
    const stepTime = 20; 
    const totalSteps = Math.abs(targetHumidity - currentHumidity); 
    let currentStep = 0;

    const interval = setInterval(() => {
        if (currentStep < totalSteps) {
            currentHumidity += (targetHumidity > currentHumidity ? 1 : -1);
            const percentage = currentHumidity; 
            if (sensorId != "air-temperature") {
                document.getElementById(`${sensorId}`).textContent = currentHumidity + '%';
                document.getElementById(`${circleBorder}`).style.background = `conic-gradient(#4dd0e1 ${percentage * 3.6}deg, #e0e0e0 ${percentage * 3.6}deg)`;
            }
            else {
                
                    const maxTemperature = 80; 
                    const minTemperature = 10; 
                    const fill = document.getElementById('circleBorder3');
                    const temperatureText = document.getElementById('air-temperature');
                    
                    temperatureText.textContent = targetHumidity + '°C'; 

                    const heightPercentage = ((targetHumidity - minTemperature) / (maxTemperature - minTemperature)) * 100;
                    fill.style.height = `${heightPercentage}%`;
            }
            currentStep++;
        } else {
            clearInterval(interval);
        }
    }, stepTime);
}

setInterval(() => updateHumidity("air-humidity", "circleBorder1"), 1000);
setInterval(() => updateHumidity("dirt-humidity", "circleBorder2"), 1000);
setInterval(() => updateHumidity("air-temperature", "circleBorder3"), 1000);
