'use strict'


const searchUrl = 'https://api.nps.gov/api/v1/parks';
const apiKey = '6gJ6ehfGAICfdsYcTuv0OrqCQ8cvbLAb9czWN76s';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

function displayResults(responseJson) {
    console.log(responseJson);
    $('#results-list').empty();
    for (let i=0; i<responseJson.data.length; i++){
        $('#results-list').append(`
        <li><h3>${responseJson.data[i].fullName}<h3>
        <a href='${responseJson.data[i].url}'>${responseJson.data[i].url}</a>
        <p>${responseJson.data[i].description}</p>
        <p>${responseJson.data[i].directionsInfo}</p>
        </li>
        `)
    };
    $('#results').removeClass('hidden');
}

function getNationalParkInfo (query, limit=10, stateCode) {
    const params = {
        api_key:apiKey,
        q:query,
        limit:limit,
        stateCode:stateCode
    };
    const queryString =  formatQueryParams(params)
    const url = searchUrl + '?' + queryString;
    console.log(url);

    fetch(url)
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error(response.statusText);
      })
      .then(responseJson => displayResults(responseJson))
      .catch(err => {
          $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const limit = $('#js-max-results').val();
        const stateCode = $('#js-state-name').val().split(" ");
        getNationalParkInfo(searchTerm,limit, stateCode);
    });
}

$(watchForm);