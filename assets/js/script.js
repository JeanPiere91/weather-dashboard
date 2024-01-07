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
                temp: convertToDegreesFahrenheit(data.list[i].main.temp) + ' °F', //'76.62°F',
                wind: data.list[i].wind.speed + ' MPH', //'8.43 MPH',
                humidity: data.list[i].main.humidity + ' %', //'44 %',
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