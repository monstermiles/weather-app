var inputField = document.querySelector("#city")
var button = document.querySelector("#get-weather")
var weatherContainer = document.querySelector("#weather-container")
var forecastContainer = document.querySelector("#forecast-container")
var cityNameEl = document.querySelector("#city-name-el")
var dateAndIcon = document.querySelector("#date-and-icon")
var container = document.querySelector(".container")
var cityName = inputField.value
var searchHistoryContainer = document.querySelector("#history")
var searchHistory = []


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

            
            
            function renderSearchHistory() {
                searchHistoryContainer.innerHTML = '';

                for (var i = searchHistory.length - 1; i >= 0; i--) {
                    var btn = document.createElement("button");
                    btn.setAttribute("type", "button");
                    btn.classList.add("history-btn", "btn-history");


                    btn.setAttribute("data-search", searchHistory[i]);
                    btn.textContent = searchHistory[i];
                    searchHistoryContainer.append(btn);
                }
            }

            function appendToHistory(cityName){
                if (searchHistory.indexOf(cityName) !== -1) {
                    return;
                }
                searchHistory.push(cityName);
                localStorage.setItem('search-history', JSON.Stringify(searchHistory));
                renderSearchHistory();
            }


            function initSearchHistory() {
                var storedHistory = localStorage.getItem('search-history');
                if (storedHistory) {
                    searchHistory = JSON.parse(storedHistory);
                }
                renderSearchHistory();
            }
            


            
            //add date and time 
            function getTimeAndDate() {
                var timeAndDateEl = document.getElementById("time-and-date")
                var timeAndDate = moment();
                timeAndDateEl.textContent = timeAndDate.format("L" + ",  " + 'h' + ":" + "mm")
            }
            getTimeAndDate();

            //weather icon
            var iconEl = document.getElementById("icon-img")
            var icon = weatherData.weather[0].icon;
            iconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png")
            
            //temperature  
            var temp = document.createElement("p")
            temp.textContent = "Temperature: " + weatherData.main.temp + " °F"
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
                uvIndex.textContent = "UV Index: " + UVData.current.uvi
                weatherContainer.append(uvIndex);
                var uvi = UVData.current.uvi
                if (uvi >= 0 && uvi <= 2) {
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

                    var forecastContainer = document.createElement("div")
                    container.append(forecastContainer)
                    forecastContainer.classList.add("forecast-container")
                    forecastContainer.classList.add("row")

                    var forecastText = document.createElement("h2")
                    forecastText.textContent = "5 Day Forecast"
                    forecastContainer.append(forecastText)
                    
                    //for loop to get data for each day's weather at 3pm
                    for (var i = 5; i < forecast.length; i = i + 8) {
                        //create div/card
                        var forecastCard = document.createElement("div")
                        forecastContainer.append(forecastCard)
                        forecastCard.classList.add("forecast-card")
                        forecastCard.classList.add("col-2")
                        
                        //add date 
                        var forecastDate = document.createElement("h5")
                        forecastDate.textContent = moment.unix(forecast[i].dt).format("L")
                        forecastCard.append(forecastDate)
                        
                        //add icon 
                        var forecastIconEl = document.createElement("img")
                        var forecastIcon = forecast[i].weather[0].icon;
                        forecastIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png")
                        forecastCard.append(forecastIconEl)

                        //add temp
                        var forecastTempK = forecast[i].main.temp
                        function convertTemp(forecastTempK) {
                            return Math.floor(((forecastTempK - 273) * 9) / 5) + 32 
                            }
                        var forecastTempF = convertTemp(forecastTempK)
                        var forecastTempEl = document.createElement("p")
                        forecastTempEl.textContent = forecastTempF + " °F"
                        forecastCard.append(forecastTempEl)

                        //add wind
                        var forecastWindMS = forecast[i].wind.speed
                        function convertWindSpeed(forecastWindMS) {
                            return Math.floor(forecastWindMS * 2.237)
                            }
                        var forecastWindMph = convertWindSpeed(forecastWindMS)
                        var forecastWindEl = document.createElement("p")
                        forecastWindEl.textContent = "Wind: " + forecastWindMph + " mph"
                        forecastCard.append(forecastWindEl)
                        
                        //add humidity
                        var forecastHumidity = document.createElement("p")
                        forecastHumidity.textContent = forecast[i].main.humidity + " % humidity"
                        forecastCard.append(forecastHumidity)
                        

                    }
                })
            }
            fetchForecastData();
        })  
}



button.addEventListener("click", megaFunction)


