var apiKey = "fabb2fdea9e337183e448943fab19d82"; 

var city; 

var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=chicago&appid=fabb2fdea9e337183e448943fab19d82"
fetch(queryURL);
console.log(queryURL); 

var searchBtn = document.getElementById("searchBtn");
    searchBtn.addEventListener("click", function(event){
        document.getElementById("searchHistory").innerHTML += (event);
        this.appendChild(li);
        console.log(event);

    });
  