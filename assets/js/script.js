// script for UofA Bootcamp Project 1 index.html

// api.nasa.gov key: bAkwC8fyPvowqus1b73c6wRxPBMW2e6F15AiO19h
// ZipCodeAPI key: b0X4iXItTVdZoS1CfXvXbWfU22ypPqx4RtQIeEdcaY2ZAsGaG8TpZt9VU7Ju2cyj
// AstronomyAPI Id : 56da1f12-1fb0-4e18-bb33-667658fb19cb
// AstronomyAPI secret : a1f73a59acef108b3022eb96205e5b919065c34bdb8b3b11dcf09861b8964a90d8381b3ba21d1879130522e4ac2c4ada82f5416c3176a72a333f8cef3fc2a23acfd90807868117a75877eea3bbce1e8707a3efc21cd6f25ac48421ea710a57260aa3f36138a0ad71c7600883eb9db186

let searchHistory = JSON.parse(localStorage.getItem("lookUpSearchHistory")) || [];

var keyImage = "bAkwC8fyPvowqus1b73c6wRxPBMW2e6F15AiO19h";
var keyZip = "b0X4iXItTVdZoS1CfXvXbWfU22ypPqx4RtQIeEdcaY2ZAsGaG8TpZt9VU7Ju2cyj";
var idAstronomy = "56da1f12-1fb0-4e18-bb33-667658fb19cb";
var secretAstronomy = "a1f73a59acef108b3022eb96205e5b919065c34bdb8b3b11dcf09861b8964a90d8381b3ba21d1879130522e4ac2c4ada82f5416c3176a72a333f8cef3fc2a23acfd90807868117a75877eea3bbce1e8707a3efc21cd6f25ac48421ea710a57260aa3f36138a0ad71c7600883eb9db186";

const astronomyHash = btoa(`${idAstronomy}:${secretAstronomy}`);

let showGeoLocate = 0;
var latitude;
var longitude;

// Get longitude & latitude from Geolocation (browser). TO DO: Best Practice is to request access on a user gesture (See Issues)

// function to show lat/lon input fields when needed.
let showLatLonFields = function () {
  if (showGeoLocate === 0) {
    $(".no-geo-inputs").removeClass("hidden");
    $("#no-geolocation").addClass("hidden");
    showGeoLocate = 1;
  } else if (showGeoLocate === 1) {
    $(".no-geo-inputs").addClass("hidden");
    $("#no-geolocation").removeClass("hidden");
    showGeoLocate = 0;
  }
}

//function to access web geolocation
let accessGeolocation = function () {

  // Step 1. Check if browser supports Geolocation
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
  }
  else {
    // NOT WORKING!! Initialize Modal message about modal
    $(".modal").modal();
    $("#modal-content").innerHTML = "<p>Geolocation is not supported for this browser.</p>";
    showGeoLocate = 0;
    showLatLonFields();
  }

  // Step 2. Set user's position
  function setPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    $("#geolocation i").text("check");
    $(".no-geolocation").addClass("hidden");
    $(".no-geo-inputs").addClass("hidden");
  }

  // Step 3. Show error if issue with Geolocation (and block)
  function showError(error) {
    //NOT WORKING!! Initialize Modal message about modal
    $(".modal").modal();
    $("#modal-content").innerHTML = `<p> ${error.message} </p>`;
    showGeoLocate = 0;
    showLatLonFields();
  }
}
// TO DO: Get longitude & latitude from user input (city name) Use ZipCodeAPI or similar for conversion

// Use brower geolocation result to find planets/sun/moon on AstronomyAPI
function getAstronomyData(latitude, longitude, date, time, elevation) {
  var url = `https://api.astronomyapi.com/api/v2/bodies/positions/?latitude=${latitude}&longitude=${longitude}&from_date=${date}&to_date=${date}&time=${time}&elevation=${elevation}`;

  fetch(url, {
    headers: { "Authorization": "Basic " + astronomyHash }
  })
    .then(function (response) {
      return response.json();
    }).then(function (data) {
      var visibleList = [];
      var rows = data.data.table.rows;

      for (var i = 0; i < rows.length; i++) {
        if (rows[i].cells[0].position.horizonal.altitude.degrees > 0) {
          visibleList.push(rows[i].entry.name);
          getImagesFromNasa(rows[i].entry.name)
        }
      }
      if (!visibleList[0]) {
        let thisImage = $("<div>").addClass("result-none search-result");
        $("<p>")
          .addClass("search-name no-result")
          .text("There doesn't seem to be anything overhead on the time in question...")
          .appendTo(thisImage)
        $("<img>")
          .addClass("img-none search-img")
          .addClass("materialboxed")
          .attr("src", "https://static9.depositphotos.com/1011382/1144/i/600/depositphotos_11444953-stock-photo-shoulder-shrug.jpg")
          .attr("alt", "Missing Picture!")
          .appendTo(thisImage)
          .materialbox()
        thisImage.appendTo(".search-display");
      }
    });
}

// TO DO: Use ZipCodeAPI result to find planets/sun/moon on AstronomyAPI

$(document).ready(function () {
  $('.parallax').parallax();
  $('.materialboxed').materialbox();
  $('.datepicker').datepicker();
  $('.timepicker').timepicker();
});

// function to add searches to search dropdown
let populateDropDown = function () {
  $('#search-history').empty();
  if (searchHistory[0]) {
    for (let i = (searchHistory.length - 1); i >= 0 && i > (searchHistory.length - 10); i--) {
      $("<option>")
        .addClass("search-value searchHistory[" + i + "]")
        .attr("value", i)
        .text(searchHistory[i].date + " - " + searchHistory[i].time)
        .appendTo($("#search-history"));
    }
  }
  $('#search-history').formSelect();
}

// takes in location,date,time and updates the Search history on the page and in Local Storage
let searchHistoryUpdate = function (viewDate, viewTime) {
  let repeatIndex = 0;
  if (searchHistory[0]) {
    for (let i = 0; i < searchHistory.length; i++) {
      if (viewDate === searchHistory[i].date && viewTime === searchHistory[i].time) {
        repeatIndex++;
        break;
      }
    }
  }
  if (repeatIndex === 0) {
    let saveObject = {
      "date": moment(viewDate, "YYYY-MM-DD").format("ll"),
      "time": moment(viewTime, "kk:mm:ss").format("HH:mm A"),
    };
    searchHistory.push(saveObject);
    localStorage.setItem("lookUpSearchHistory", JSON.stringify(searchHistory));
  }
  //re-populates drop-down with the 10 most recent searches
  populateDropDown();
}

// method for ValidateInputs
let toggleErrorColor = function (item, classCall) {
  if (!item) {
    $(classCall).removeClass("white-text").addClass("red-text");
  } else {
    $(classCall).removeClass("red-text").addClass("white-text");
  }
}

//validates input, displays missing parameters in red, changes correct ones back
let validateInputs = function (viewDate, viewTime, coordinates) {
  toggleErrorColor(viewDate, ".date-title");
  toggleErrorColor(viewTime, ".time-title");
  if (showGeoLocate === 1) {
    toggleErrorColor(coordinates, ".no-geo-location");
  }
}

// Populates search criteria with search history parameters
let bringHistoryBack = function () {
  let userIndex = $("#search-history").val();
  console.log(userIndex);
  if (userIndex !== "none") {
    $("#view-date").val(searchHistory[userIndex].date);
    $("#view-time").val(searchHistory[userIndex].time);
  }
}

// Submit Button function:
let submitForm = function () {
  $(".search-display").empty();
  let coordinates = {};
  if (showGeoLocate === 1) {
    coordinates = {
      "lat": parseFloat($("#lat-input").val()),
      "lon": parseFloat($("#lon-input").val()),
    };
  } else {
    coordinates = {
      "lat": latitude,
      "lon": longitude,
    };
  }
  //console.log("Lat: " + typeof coordinates.lat + " - Lon: " + typeof coordinates.lon);
  //console.log("Lat: " + coordinates.lat + " - Lon: " + coordinates.lon);
  let userViewDate;
  let userViewTime;
  if ($("#view-date").val()) {
    console.log($("#view-date").val());
    userViewDate = moment($("#view-date").val(), "ll").format("YYYY-MM-DD");
  }
  if ($("#view-time").val()) {
    console.log($("#view-time").val());
    userViewTime = moment($("#view-time").val(), "HH:mm A").format("kk:mm:ss");
  }
  console.log(userViewDate, userViewTime, coordinates);
  validateInputs(userViewDate, userViewTime, coordinates);
  if (userViewDate && userViewTime && coordinates.lat && coordinates.lon) {
    searchHistoryUpdate(userViewDate, userViewTime);
    getAstronomyData(coordinates.lat, coordinates.lon, userViewDate, userViewTime, 0);
  }
}

let displayInformation = function (planet, imgUrl) {
  let thisImage = $("<div>").addClass("result-" + planet + " search-result");
  $("<p>")
    .addClass("search-name")
    .text(planet)
    .appendTo(thisImage)
  $("<img>")
    .addClass("img-" + planet + " search-img")
    .addClass("materialboxed")
    .attr("src", imgUrl)
    .attr("alt", "Picture-of-" + planet)
    .appendTo(thisImage)
    .materialbox()
  thisImage.appendTo(".search-display");
}

// Use Astonomy API result to display corresponding random image from NASA images
function getImagesFromNasa(planetName) {
  let nasaApiUrl = "https://images-api.nasa.gov/search?q=" + planetName;
  fetch(nasaApiUrl)
    .then(function (response) {
      if (response.ok) {
        return response.json()
      }
    })
    .then(function (obj) {
      //uses random number to find photo
      let randomIndex = Math.floor(Math.random() * 50);
      displayInformation(planetName, obj.collection.items[randomIndex].links[0].href);
    })
}



// initial dropdown population from localStorage
populateDropDown();

// Click event listener for "No Thanks" geolocation button
$("#no-geolocation").on("click", showLatLonFields);

// Click event listener for the Submit Button
$("#submit-btn").on("click", submitForm);

// Change event listener for activating the search history
$(".history").change(bringHistoryBack);

// Use Geolocation button to access web geolocation
$("#geolocation").on("click", accessGeolocation);