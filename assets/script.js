var inputField = document.querySelector("#city")
var button = document.querySelector("#get-weather")
var weatherContainer = document.querySelector("#weather-container")
var forecastContainer = document.querySelector("#forecast-container")

// var cityName = inputField.value
//   var apiKey = "836bcbaeb262be6529a98dc6c216e199"
//   var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey
function megaFunction() {
    var cityName = inputField.value
    var apiKey = "836bcbaeb262be6529a98dc6c216e199"
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + apiKey
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (weatherData) {
            console.log(weatherData)
            //add city name 
            var cityName = document.getElementById("city-name")
            cityName.textContent = weatherData.name
            //add date and time 
            function getTimeAndDate() {
                var timeAndDateEl = document.getElementById("time-and-date")
                var timeAndDate = moment();
                timeAndDateEl.textContent = timeAndDate.format("L" + ",  " + 'h' + ":" + "mm")
                weatherContainer.append(timeAndDateEl)
            }
            //weather icon
            var iconEl = document.getElementById("icon-img")
            var icon = weatherData.weather[0].icon;
            iconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png")
            getTimeAndDate();
            //temperature  
            var temp = document.createElement("p")
            temp.textContent = "Temperature: " + weatherData.main.temp + " F"
            weatherContainer.append(temp)
            //wind speed
            var windSpeed = document.createElement("p");
            windSpeed.textContent = "Wind Speed: " + weatherData.wind.speed;
            weatherContainer.append(windSpeed);
            //humidity
            var humidity = document.createElement("p");
            humidity.textContent = "Humidity: " + weatherData.main.humidity + " %"
            weatherContainer.append(humidity);

            //grabbing lat and long to use in second API call
            console.log(weatherData.coord.lat)
            var lat = weatherData.coord.lat
            var lon = weatherData.coord.lon
            
            //second API call for getting UV index
            function fetchUvData() {
            var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=&appid=" + apiKey
            fetch(requestUrl)
                .then(function (response) {
                    return response.json()
                })
                .then(function (UVData) {
                    console.log(UVData)

                //UV Index
                var uvIndex = document.createElement("p");
                uvIndex.textContent = "UV Index: " + UVData.current.uvi + " %"
                weatherContainer.append(uvIndex);
                var uvi = UVData.current.uvi
                if (uvi > 0 && uvi <= 2) {
                    uvIndex.classList.add("lowUVI")
                }
                if (uvi >= 2 && uvi < 5) {
                    uvIndex.classList.add("moderateUVI")
                }
                if (uvi >= 5)
                    uvIndex.classList.add("highUVI")
                })
            }
            fetchUvData();

            //third API call for forecast
            function fetchForecastData () {
                var cityName = inputField.value
                var apiKey = "836bcbaeb262be6529a98dc6c216e199"
                var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey
                fetch(requestUrl)
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (forecastData) {
                    
                    console.log(forecastData)

                    var forecast = forecastData.list
                    console.log(forecast)
                    
                    //for loop to get data for each day's weather at 3pm
                    for (var i = 5; i < forecast.length; i = i + 8) {
                        //create div/card
                        var forecastCard = document.createElement("div")
                        forecastContainer.append(forecastCard)
                        forecastCard.classList.add("forecast-card")
                        forecastCard.classList.add("col-2")
                        
                        //add date 
                        var forecastDate = moment.unix(forecast[i].dt).format("L")
                        forecastCard.append(forecastDate)

                        // var forecastTemp = document.createElement("h4")
                        // forecastTemp.textContent = 

                    }




                    })


            }
            fetchForecastData();

        })
    
}


button.addEventListener("click", megaFunction)


