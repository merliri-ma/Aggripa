const planetColors = {
    "Sun": "#ff9800", 
    "Venus": "#ff5722", 
    "Mercury": "#9e9e9e", 
    "Moon": "#2196f3", 
    "Saturn": "#9c27b0", 
    "Jupiter": "#3f51b5", 
    "Mars": "#f44336"
};

const chaldeanOrder = ["Saturn", "Jupiter", "Mars", "Sun", "Venus", "Mercury", "Moon"];

function getDayRuler(date) {
    const days = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
    return days[date.getDay()]; // getDay() returns 0-6 for Sunday-Saturday
}

function getPlanetSequence(dayRuler) {
    let startIndex = chaldeanOrder.indexOf(dayRuler);
    let sequence = [];
    for (let i = 0; i < 24; i++) {
        sequence.push(chaldeanOrder[startIndex]);
        startIndex = (startIndex + 1) % chaldeanOrder.length;
    }
    return sequence;
}

function calculatePlanetaryHours() {
    const sunriseTime = document.getElementById("sunrise").value;
    const sunsetTime = document.getElementById("sunset").value;
    const timePeriod = document.getElementById("timePeriod").value;
    const dateInput = document.getElementById("date").value;

    const sunrise = new Date(`1970-01-01T${sunriseTime}:00`);
    const sunset = new Date(`1970-01-01T${sunsetTime}:00`);
    let dayDuration = (sunset - sunrise) / (1000 * 60); // in minutes
    const nextSunrise = new Date(sunset.getTime() + 1000 * 60 * 60 * 24); // 24 hours after sunset
    const nightDuration = (nextSunrise - sunset) / (1000 * 60); // in minutes

    const dayHourLength = dayDuration / 12;
    const nightHourLength = nightDuration / 12;

    const results = document.getElementById("results");
    results.innerHTML = '';
    let ul = document.createElement('ul');

    let currentDate = new Date(dateInput);

    const daysToCalculate = {
        'day': 1,
        'week': 7,
        'month': 30, // Simplified to 30 days for a month
        'year': 365  // Simplified to 365 days for a year
    }[timePeriod] || 1;

    for (let day = 0; day < daysToCalculate; day++) {
        let dayDate = new Date(currentDate);
        dayDate.setDate(dayDate.getDate() + day);
        let dayText = `Day ${day + 1} (${dayDate.toDateString()})`;
        let liHeader = document.createElement('li');
        liHeader.textContent = dayText;
        ul.appendChild(liHeader);
        
        const dayRuler = getDayRuler(dayDate);
        const planets = getPlanetSequence(dayRuler);

        let currentTime = new Date(sunrise);
        for (let i = 0; i < 24; i++) { // Full 24 hours
            const hourLength = i < 12 ? dayHourLength : nightHourLength;
            addHourToList(ul, planets[i], currentTime, hourLength);
            currentTime.setMinutes(currentTime.getMinutes() + hourLength);
        }
    }

    results.appendChild(ul);

    // Update chart
    updateChart(ul);
}

function addHourToList(ul, planet, time, hourLength) {
    let li = document.createElement('li');
    let planetDiv = document.createElement('div');
    planetDiv.classList.add('planet');
    planetDiv.style.backgroundColor = planetColors[planet] || '#000';
    planetDiv.innerHTML = planet.charAt(0);
    planetDiv.title = planet; // Tooltip for planet name

    let hours = time.getHours();
    let minutes = time.getMinutes();
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    let timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;

    li.innerHTML = `${planet} - Time: ${timeString}`;
    li.prepend(planetDiv);
    ul.appendChild(li);
}

function updateChart(ul) {
    const ctx = document.getElementById('planetaryChart').getContext('2d');
    const labels = Array.from(ul.querySelectorAll('li')).map(li => li.textContent.split(' - ')[1]);
    const data = Array.from(ul.querySelectorAll('li')).map(li => li.textContent.split(' - ')[0]);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Planetary Hours',
                data: data,
                backgroundColor: data.map(planet => planetColors[planet] || '#000')
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.data[context.dataIndex];
                        }
                    }
                }
            }
        }
    });
}

function resetFields() {
    document.getElementById("sunrise").value = '';
    document.getElementById("sunset").value = '';
    document.getElementById("timePeriod").value = 'day';
}

function autoFillCurrent() {
    const now = new Date();
    document.getElementById("date").value = now.toISOString().split('T')[0];
    document.getElementById("sunrise").value = "06:30";  // Default sunrise time
    document.getElementById("sunset").value = "18:30";   // Default sunset time
}

function filterResults() {
    const search = document.getElementById("search").value.toLowerCase();
    Array.from(document.getElementById("results").querySelectorAll('li')).forEach(li => {
        if (li.textContent.toLowerCase().includes(search)) {
            li.style.display = '';
        } else {
            li.style.display = 'none';
        }
    });
}

function exportToCSV() {
    const rows = Array.from(document.getElementById("results").querySelectorAll('li'))
        .map(li => li.textContent.split(' - ').join(','));
    const csvContent = "data:text/csv;charset=utf-8," + 
        rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "planetary_hours.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
}

function exportToPDF() {
    // Dummy function for PDF export - actual implementation would require a PDF library
    alert("PDF export functionality not implemented yet.");
}

// Dark mode toggle function
document.getElementById("themeToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
});

// Auto-fill current date on load
document.addEventListener("DOMContentLoaded", function() {
    autoFillCurrent();
    
    // Setup flatpickr for better date selection
    flatpickr("#date", {
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        plugins: [new monthSelectPlugin({
            shorthand: true,
            dateFormat: "F Y",
        })],
        locale: "en"
    });

    // Populate timezone dropdown based on browser's timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.getElementById("timezone").innerHTML = `<option value="${tz}" selected>${tz}</option>`;
});