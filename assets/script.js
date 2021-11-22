var inputField = document.querySelector("#city")
var button = document.querySelector("#get-weather")
var weatherContainer = document.querySelector("#weather-container")


function fetchData(){
  var cityName = inputField.value
  var apiKey = "836bcbaeb262be6529a98dc6c216e199"
  var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey
  fetch(requestUrl)
    .then(function(response) {
      return response.json()
    })
    .then(function(weatherData) {
      console.log(weatherData)
        //temperature  
        var temp = document.createElement("p")
        temp.textContent = "Temperature: " + weatherData.main.temp + "F"
        weatherContainer.append(temp)
        //wind speed
        var windSpeed = document.createElement("p");
        windSpeed.textContent = "Wind Speed: " + weatherData.wind.speed;
        weatherContainer.append(windSpeed);
        //humidity
        var humidity = document.createElement("p");
        humidity.textContent = "Humidity: " + weatherData.main.humidity + " %"
        weatherContainer.append(humidity);
        //UV Index
        var uvIndex = document.createElement("p");
        // uvIndex.textContent = "UV Index: " + weatherData.main. + " %"
        weatherContainer.append(uvIndex);
        
        //grabbing lat and long to use in second API call
        console.log(weatherData.coord.lat)
        var lat = weatherData.coord.lat
        var lon = weatherData.coord.lon

        var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=&appid=" + apiKey
        fetch(requestUrl)
            .then(function(response){
                return response.json()
            })
            .then(function(uvWeatherData){
                console.log(uvWeatherData)
            }
            )
    
    
    })
    
}

button.addEventListener("click", fetchData)


