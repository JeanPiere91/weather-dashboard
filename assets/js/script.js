var APIKey = "2a1a5c3de88988ae44ddb183dc82e64c"
var searchFormEl = document.querySelector('#search-form');
var searchInputEl = document.querySelector('#search-input');
var resultCityEl = document.querySelector('#result-city');
var resultContentEl1 = document.querySelector('#result-content-1');
var resultContentEl2 = document.querySelector('#result-content-2');
var titletForecastEl = document.querySelector('#title-forecast');

//Clean City container
function clearContainerCity() {

    while(resultCityEl.hasChildNodes())
    resultCityEl.removeChild(resultCityEl.firstChild);
}

//Clean Cities Weather container
function clearContainerWeather() {

    while(resultContentEl1.hasChildNodes())
    resultContentEl1.removeChild(resultContentEl1.firstChild);

    while(resultContentEl2.hasChildNodes())
    resultContentEl2.removeChild(resultContentEl2.firstChild);
}

//Convert Kelvin degrees to Fahrenheit
function convertToDegreesFahrenheit(degreesKelvin) {
    return ((((parseFloat(degreesKelvin) - 273.15) * 9) / 5) + 32).toFixed(2);
}

/* Display Cities on the left side */
function printCities(city) {
    
    var buttonCity = document.createElement('button');
    buttonCity.classList.add('btn', 'btn-secondary', 'w-100', 'my-2', 'text-dark', 'custom-city-btn');
    buttonCity.textContent = city;
    buttonCity.addEventListener('click', printResults)
    resultCityEl.append(buttonCity);
}

/* Display Cities Weather on the right side */
function printResults(event) {
    /* Before to display, make sure to clean all previous information and elements */
    clearContainerWeather();
    var resultObj;
    var cities = readWeatherCitiesFromStorage();

    /* I'm forcing to display the information when is searched first time*/
    var city = event != null ? event.target.textContent:cities[0].name;
    
    for(var i = 0 ; i < cities.length; i++) {
        if(city === cities[i].name) {
            resultObj = cities[i];
            break;
        }
    }
    
    /* Display card above (first day) */
    var resultCardAbow = document.createElement('div');
    resultCardAbow.classList.add('p-1', 'border', 'border-dark');

    var imgWeather = document.createElement('img');
    imgWeather.src = resultObj.information[0].ico;
    imgWeather.setAttribute("width", '32px');

    var resultCity = document.createElement('h4');
    resultCity.textContent = resultObj.name + '(' + resultObj.information[0].date + ')'
    resultCity.classList.add('fw-folder');
    resultCity.append(imgWeather);
    resultCardAbow.append(resultCity);

    var resultTemp = document.createElement('h6');
    resultTemp.textContent = 'Temp: ' + resultObj.information[0].temp;
    resultCardAbow.append(resultTemp);

    var resultWind = document.createElement('h6');
    resultWind.textContent = 'Wind: ' + resultObj.information[0].wind;
    resultCardAbow.append(resultWind);

    var resultHumidity = document.createElement('h6');
    resultHumidity.textContent = 'Humidity: ' + resultObj.information[0].humidity;
    resultCardAbow.append(resultHumidity);

    resultContentEl1.append(resultCardAbow);
    
    /* Display title for elements below */
    titletForecastEl.textContent = '5-Day Forecast:';

    /* Display cards below (left days) */
    for (var i = 1; i < 5 ; i++) {

        /* I created this structure according to BootStrap "Gutters" */
        var resultCardBelow = document.createElement('div');
        resultCardBelow.classList.add('col-12', 'col-sm-6', 'col-lg-3');

        var divCol = document.createElement('div');
        divCol.classList.add('p-3', 'border', 'custom-card');

        var resultCityBelow = document.createElement('h4');
        resultCityBelow.textContent = resultObj.information[i].date;
        resultCityBelow.classList.add('fw-folder', 'text-white');
        divCol.append(resultCityBelow);

        var imgWeatherBelow = document.createElement('img');
        imgWeatherBelow.src = resultObj.information[i].ico;
        imgWeatherBelow.setAttribute("width", '32px');
        divCol.append(imgWeatherBelow);

        var resultTempBelow = document.createElement('h6');
        resultTempBelow.textContent = 'Temp: ' + resultObj.information[i].temp;
        resultTempBelow.classList.add('text-white');
        divCol.append(resultTempBelow);

        var resultWindBelow = document.createElement('h6');
        resultWindBelow.textContent = 'Wind: ' + resultObj.information[i].wind;
        resultWindBelow.classList.add('text-white');
        divCol.append(resultWindBelow);

        var resultHumidityBelow = document.createElement('h6');
        resultHumidityBelow.textContent = 'Humidity: ' + resultObj.information[i].humidity;
        resultHumidityBelow.classList.add('text-white');
        divCol.append(resultHumidityBelow);

        resultCardBelow.append(divCol);
        resultContentEl2.append(resultCardBelow);
    }
}

function printProjectData() { 
    // get Weather from localStorage
    var weatherCities = readWeatherCitiesFromStorage();
    
    // loop through each project and create a row
    for (var i = 0; i < weatherCities.length; i++) {
        printCities(weatherCities[i].name);
    }
}

// Reads Weather Cities from local storage and returns array of Weather Cities objects.
// Returns an empty array ([]) if there aren't any Weather Cities.

function readWeatherCitiesFromStorage() {
    var weatherCities = localStorage.getItem('weatherCities');
    if (weatherCities) {
        weatherCities = JSON.parse(weatherCities);
    } else {
        weatherCities = [];
    }
    return weatherCities;
}

// Save data within local storage
function saveCitiesWeatherToStorage(weatherCities) {
    localStorage.setItem('weatherCities', JSON.stringify(weatherCities));
}

// Normalize data response from API
function normalizeData(data){
    /* Get hour to get information for the next days*/
    var hour = dayjs(data.list[0].dt_txt).format('HH')

    /* Array information weather for current City */
    var information = [];
    for (var i = 0; i < data.list.length; i++) {
        if(dayjs(data.list[i].dt_txt).format('HH') == hour){
            var weather = {
                date: dayjs(data.list[i].dt_txt).format('MM/DD/YY'),
                ico: 'https://openweathermap.org/img/wn/'+ data.list[i].weather[0].icon+'@2x.png',
                temp: convertToDegreesFahrenheit(data.list[i].main.temp) + ' °F',
                wind: data.list[i].wind.speed + ' MPH',
                humidity: data.list[i].main.humidity + ' %',
            }
            information.push(weather)
        }
    }

    var weatherCity = {
        name: data.city.name,
        information: information
    }

    return weatherCity;
    
}

function searchApi(query) {
    
    var locQueryUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='+ query + '&appid=' + APIKey;

    fetch(locQueryUrl)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
  
        return response.json();
      })
      .then(function (locRes) {
  
        if (!locRes.list.length) {
          console.log('No results found!');
        } else {
            // standardize data 
            var weatherCity = normalizeData(locRes);

            // add Weather City to local storage
            var weatherCities = readWeatherCitiesFromStorage();

            weatherCities.unshift(weatherCity);
            saveCitiesWeatherToStorage(weatherCities)
            clearContainerCity();
            printProjectData();
            printResults(null);
            searchInputEl.value = '';
            searchInputEl.focus();
        }
      })
      .catch(function (error) {
        console.error(error);
    });
}

/* Display Cities in local storage */
function handleSearchFormSubmit(event) {
    event.preventDefault();
  
    searchInputVal = document.querySelector('#search-input').value;
  
    if (!searchInputVal) {
      console.error('You need a search input value!');
      return;
    }
  
    searchApi(searchInputVal);
}
  
searchFormEl.addEventListener('submit', handleSearchFormSubmit);

/* Display Cities saved in local storage */
printProjectData();