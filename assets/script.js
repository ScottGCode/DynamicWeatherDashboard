//Variables to be used.
var cityValue = document.getElementById('cityValue');
var searchButton = document.getElementById('searchButton');
var weatherData = document.getElementById('weatherData');
var forecastData = document.getElementById('forecastData');
var searchHistory = document.getElementById('searchHistory');
var apiKey = 'fabb2fdea9e337183e448943fab19d82';
var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=chicago&appid=fabb2fdea9e337183e448943fab19d82'
var city;

// Event listener for the search button. Get city value. Display error if input is empty. 
searchButton.addEventListener('click', function () {
   city = cityValue.value.trim(); 

  if (city === '') {
       window.alert('Please enter a city name.');
    return;
    }
    
    // Construct the API URL with the user's input.
var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

// Function to display weather data in html. 
function displayWeatherData(data) {
    console.log(data);
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
 //      if (!response.ok) {
    //        throw new Error('City not found');
    //    }
       return response.json();
   })
   .then(data => {
       displayWeatherData(data);
       addToSearchHistory(city);
       saveSearchHistory();
   })
   .catch(error => {
       console.error('Error:', error);
       window.alert('City not found. Please enter a valid city name.');
   });
});

//Function to add city input to search history as button.
function addToSearchHistory(city) {
    var listItem = document.createElement('button');
    listItem.textContent = city;
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
    const city = cityValue.value.trim(); // Get the city input value

    if (city === '') {
        alert('Please enter a city name.'); // Display an alert if the input is empty
        return;
    }

    // Construct the API URL with the user's input for current weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

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
            // Add the city to the search history
            addToSearchHistory(city);

            // Construct the API URL with the user's input for the 5-day forecast
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

            // Fetch the 5-day forecast data
            return fetch(forecastUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast not available for this city');
            }
            return response.json();
        })
        .then(data => {
            // Display the 5-day forecast data on the page
            displayForecastData(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('City not found. Please enter a valid city name.');
        });
});

// Function to display weather data
function displayWeatherData(data) {
    // Display current weather data as before
    // ...
}

// Function to display the 5-day forecast data
function displayForecastData(data) {
    const forecastList = data.list;
    let forecastHTML = '';

    for (const forecast of forecastList) {
        const timestamp = forecast.dt * 1000;
        const date = new Date(timestamp);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temperature = forecast.main.temp;
        const weatherDescription = forecast.weather[0].description;

        forecastHTML += `
            <div class="forecast-item">
                <p>${dayOfWeek}</p>
                <p>Temp: ${temperature}°C</p>
                <p>${weatherDescription}</p>
            </div>
        `;
    }

    forecastData.innerHTML = `
        <h2>5-Day Forecast</h2>
        ${forecastHTML}
    `;
}

