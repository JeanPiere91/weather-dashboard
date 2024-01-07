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