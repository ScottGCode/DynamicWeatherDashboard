//Variables to be used.

var cityValue = document.getElementById('cityValue');
var searchButton = document.getElementById('searchButton');
var weatherData = document.getElementById('weatherData');
var forecastData = document.getElementById('forecastData');
var searchHistory = document.getElementById('searchHistory');
var apiKey = 'fabb2fdea9e337183e448943fab19d82';
var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=chicago&appid=fabb2fdea9e337183e448943fab19d82'

// Event listener for the search button. Get city value. Display error if input is empty. 

searchButton.addEventListener('click', function () {
    var city = cityValue.value.trim(); 

    if (city === '') {
        window.alert('Please enter a city name.');
        return;
    }

    // Construct the API URL with the user's input
var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

// Function to display weather data in html. 
function displayWeatherData(data) {
    var { name, main, weather, wind, humidity } = data;
    var temperature = main.temp;
    var weatherDescription = weather[0].description;
    var humidityEl = main.humidity;

    weatherData.innerHTML = `
        <h2>in ${name}</h2>
        <p>Temperature: ${temperature}°F</p>
        <p>Wind: ${wind}mph</p>
        <p>Humidity: ${humidity}%</p>
        <p>Condition: ${weatherDescription}</p>
    `;
}

   // Fetch weather data and display. 
   fetch(apiUrl)
   .then(response => {
       if (!response.ok) {
           throw new Error('City not found');
       }
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

//Function to add city input to search history as li.
function addToSearchHistory(city) {
    var listItem = document.createElement('li');
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