//Variables to be used.
var cityValue = document.getElementById('cityValue');
var searchButton = document.getElementById('searchButton');
var weatherData = document.getElementById('weatherData');
var forecastData = document.getElementById('forecastData');
var searchHistory = document.getElementById('searchHistory');
var apiKey = 'fabb2fdea9e337183e448943fab19d82';
var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=chicago&appid=fabb2fdea9e337183e448943fab19d82'
var city;

// Event listener for the search button.
searchButton.addEventListener('click', function () {
   city = cityValue.value.trim(); 

  if (city === '') {
    return;
    }
    
// Weather api with parameters set to user inputs.
var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

// Function to display weather data in html. 
function displayWeatherData(data) {
    var { name, main, weather } = data;
    var temperature = main.temp;
    var weatherDescription = weather[0].description;
    var windSpeed = data.wind.speed;
    var humidityLevel = main.humidity;

    weatherData.innerHTML = `
        <h2>in ${name}</h2>
        <p>Temperature: ${temperature}°F</p>
        <p>Wind: ${windSpeed} mph</p>
        <p>Humidity: ${humidityLevel}%</p>
        <p>Condition: ${weatherDescription}</p>
    `;
}

// Fetch weather data and display. 
   fetch(apiUrl)
   .then(response => {
       return response.json();
   })
   .then(data => {
       displayWeatherData(data);
       addToSearchHistory(city);
       saveSearchHistory();
   })
   .catch(error => {
       window.alert('Please enter a valid city name.');
   });
});

//Function to add city input to search history as button with a clickable link.
function addToSearchHistory(city) {
    var listItem = document.createElement('a');
    listItem.textContent = city;
    listItem.dataset.city = city;
    listItem.href = '#';
    listItem.classList.add('history-link');
    listItem.addEventListener('click', function () {
// When a history link is clicked, perform a new weather search for that city
        searchWeatherForCity(city);
        displayWeatherData();
    });
    listItem.dataset.city = city;
    searchHistory.appendChild(listItem);
}

// Function to save the search history to local storage.
function saveSearchHistory() {
    var historyItems = Array.from(searchHistory.children).map(item => item.textContent);
    localStorage.setItem('searchHistory', JSON.stringify(historyItems));
}

// Function to retrieve the search history from local storage.
function getSearchHistoryFromLocalStorage() {
    var historyItems = localStorage.getItem('searchHistory');
    return historyItems ? JSON.parse(historyItems) : [];
}

// Load and display search history when page content is loaded. 
document.addEventListener('DOMContentLoaded', function () {
    var historyFromStorage = getSearchHistoryFromLocalStorage();
    historyFromStorage.forEach(city => {
        addToSearchHistory(city);
    });
});

searchButton.addEventListener('click', function () {
    var city = cityValue.value.trim(); 

    if (city === '') {
        alert('Please enter a city name.'); // Display an alert if the input is empty
        return;
    }

// Construct the API URL with the user's input for current weather
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

// Fetch current weather data for the user's input
    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
// Display the current weather data on the page
            displayWeatherData(data);

// Construct the API URL with the user's input for the 5-day forecast
            var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

            return fetch(forecastUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast not available for this city');
            }
            return response.json();
        })
        .then(data => {
            displayForecastData(data);
        })
});

// Function to display weather data
function displayWeatherData(data) {
  
}

function displayForecastData(data) {
    var forecastList = data.list;
    let dailyForecasts = {};

    // Loop through the forecast list and group by date
    for (var forecast of forecastList) {
        var timestamp = forecast.dt * 1000;
        var date = new Date(timestamp);
        var dayKey = date.toLocaleDateString('en-US', { weekday: 'long' });

        if (!dailyForecasts[dayKey]) {
            dailyForecasts[dayKey] = {
                dayOfWeek: dayKey,
                temperature: forecast.main.temp,
                weatherDescription: forecast.weather[0].description,
            };
        }
    }

    // Create HTML for the 5-day forecast
    let forecastHTML = '';
    for (var dayKey in dailyForecasts) {
         var { dayOfWeek, temperature, weatherDescription } = dailyForecasts[dayKey];
   
        forecastHTML += `
            <div class="forecast-item">
                <p>${dayOfWeek}</p>
                <p>Temp: ${temperature}°F</p>
                <p>${weatherDescription}</p>
            </div>
        `;
    }

    forecastData.innerHTML = `
        <h2>5-Day Forecast for ${city}</h2>
        ${forecastHTML}
    `;
}

function searchWeatherForCity(city) {
    var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
            addToSearchHistory(city);
            var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
            return fetch(forecastUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast not available for this city');
            }
            return response.json();
        })
        .then(data => {
            displayForecastData(data, city);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('City not found. Please enter a valid city name.');
        });
}