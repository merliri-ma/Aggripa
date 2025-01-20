const planetNames = [
    "Sun", "Venus", "Mercury", "Moon", "Saturn", 
    "Jupiter", "Mars", "Sun", "Venus", "Mercury", 
    "Moon", "Saturn"
];

const planetColors = [
    "#ff9800", "#ff5722", "#9e9e9e", "#2196f3", "#9c27b0", 
    "#3f51b5", "#f44336", "#ff9800", "#ff5722", "#9e9e9e", 
    "#2196f3", "#9c27b0"
];

function calculatePlanetaryHours() {
    const sunriseTime = document.getElementById("sunrise").value;
    const sunsetTime = document.getElementById("sunset").value;
    const timePeriod = document.getElementById("timePeriod").value;
    const dateInput = document.getElementById("date").value;

    // Parse the sunrise and sunset times to Date objects
    const sunrise = new Date(`1970-01-01T${sunriseTime}:00`);
    const sunset = new Date(`1970-01-01T${sunsetTime}:00`);

    // Calculate the duration between sunrise and sunset (day duration) in minutes
    let dayDuration = (sunset - sunrise) / (1000 * 60); // in minutes

    // Calculate the duration between sunset and the next sunrise (night duration) in minutes
    const nextSunrise = new Date(sunset.getTime() + 1000 * 60 * 60 * 24); // 24 hours after sunset
    const nightDuration = (nextSunrise - sunset) / (1000 * 60); // in minutes

    // Calculate the length of each planetary hour for the day and night
    const dayHourLength = dayDuration / 12;
    const nightHourLength = nightDuration / 12;

    const results = document.getElementById("results");
    results.innerHTML = ''; // Clear previous results
    let ul = document.createElement('ul');

    let currentDate = new Date(dateInput);
    if (timePeriod === 'day') {
        // Calculate for one day
        let currentTime = new Date(sunrise);
        for (let i = 0; i < 12; i++) {
            let li = document.createElement('li');
            let planet = document.createElement('div');
            planet.classList.add('planet');
            planet.style.backgroundColor = planetColors[i];
            planet.innerHTML = planetNames[i].charAt(0); // First letter of the planet

            let hours = currentTime.getHours();
            let minutes = currentTime.getMinutes();
            let period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            if (hours === 0) hours = 12;
            let timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;

            li.innerHTML = `${planetNames[i]} - Time: ${timeString}`;
            li.prepend(planet);
            ul.appendChild(li);
            currentTime.setMinutes(currentTime.getMinutes() + dayHourLength);
        }
    } else if (timePeriod === 'week') {
        // Calculate for 7 days (week)
        for (let j = 0; j < 7; j++) {
            let weekDate = new Date(currentDate);
            let dayText = `Day ${j + 1} (${weekDate.toDateString()})`;
            let liHeader = document.createElement('li');
            liHeader.textContent = dayText;
            ul.appendChild(liHeader);
            
            let currentTime = new Date(sunrise);
            for (let i = 0; i < 12; i++) {
                let li = document.createElement('li');
                let planet = document.createElement('div');
                planet.classList.add('planet');
                planet.style.backgroundColor = planetColors[i];
                planet.innerHTML = planetNames[i].charAt(0); // First letter of the planet

                let hours = currentTime.getHours();
                let minutes = currentTime.getMinutes();
                let period = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                if (hours === 0) hours = 12;
                let timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;

                li.innerHTML = `${planetNames[i]} - Time: ${timeString}`;
                li.prepend(planet);
                ul.appendChild(li);
                currentTime.setMinutes(currentTime.getMinutes() + dayHourLength);
            }
            currentDate.setDate(currentDate.getDate() + 1); // Move to next day
        }
    } else if (timePeriod === 'month') {
        // Calculate for 30 days (month)
        for (let j = 0; j < 30; j++) {
            let monthDate = new Date(currentDate);
            let dayText = `Day ${j + 1} (${monthDate.toDateString()})`;
            let liHeader = document.createElement('li');
            liHeader.textContent = dayText;
            ul.appendChild(liHeader);

            let currentTime = new Date(sunrise);
            for (let i = 0; i < 12; i++) {
                let li = document.createElement('li');
                let planet = document.createElement('div');
                planet.classList.add('planet');
                planet.style.backgroundColor = planetColors[i];
                planet.innerHTML = planetNames[i].charAt(0); // First letter of the planet

                let hours = currentTime.getHours();
                let minutes = currentTime.getMinutes();
                let period = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                if (hours === 0) hours = 12;
                let timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;

                li.innerHTML = `${planetNames[i]} - Time: ${timeString}`;
                li.prepend(planet);
                ul.appendChild(li);
                currentTime.setMinutes(currentTime.getMinutes() + dayHourLength);
            }
            currentDate.setDate(currentDate.getDate() + 1); // Move to next day
        }
    }

    results.appendChild(ul);
}

function resetFields() {
    document.getElementById("sunrise").value = '';
    document.getElementById("sunset").value = '';
    document.getElementById("timePeriod").value = 'day';
}

function autoFillCurrent() {
    const now = new Date();
    const dateInput = document.getElementById("date");
    const sunriseInput = document.getElementById("sunrise");
    const sunsetInput = document.getElementById("sunset");

    dateInput.value = now.toISOString().split('T')[0];
    sunriseInput.value = "06:30";  // Default sunrise time
    sunsetInput.value = "18:30";   // Default sunset time
}

// Dark mode toggle function
document.getElementById("themeToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
});

// Auto-fill current date on load
document.addEventListener("DOMContentLoaded", function() {
    autoFillCurrent();
});
