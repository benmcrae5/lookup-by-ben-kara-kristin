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

var latitude;
var longitude;

// Get longitude & latitude from Geolocation (browser). TO DO: Best Practice is to request access on a user gesture (See Issues)

// Step 1. Check if browser supports Geolocation
if("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
    }
    else{
        notificationElement.style.display = "block";
        notificationElement.innerHTML = "<p>Geolocation is not supported for this browser.</p>";
    }

// Step 2. Set user's position
function setPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;   
}

// Step 3. Show error if issue with Geolocation
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// TO DO: Get longitude & latitude from user input (city name) Use ZipCodeAPI or similar for conversion

// Use brower geolocation result to find planets/sun/moon on AstronomyAPI
function getAstronomyData(latitude, longitude, date, time, elevation) {
    var url = `https://api.astronomyapi.com/api/v2/bodies/positions/?latitude=${latitude}&longitude=${longitude}&from_date=${date}&to_date=${date}&time=${time}&elevation=${elevation}`;

    fetch(url, {
        headers: {"Authorization": "Basic " + astronomyHash}
    })
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        var visibleList = [];
        var rows = data.data.table.rows;

        for (var i = 0; i < rows.length; i++) {
            if (rows[i].cells[0].position.horizonal.altitude.degrees > 0) {
                visibleList.push(rows[i].entry.name);
                getImagesFromNasa(rows[i].entry.name)
            }
        }        
    });
}

// TO DO: Use ZipCodeAPI result to find planets/sun/moon on AstronomyAPI

// material box for the search result image
$(document).ready(function () {
  $('.materialboxed').materialbox();
});

// materialize datepicker
$(document).ready(function () {
  $('.datepicker').datepicker();
});

// materialize timepicker
$(document).ready(function () {
  $('.timepicker').timepicker();
});

// function to add searches to search dropdown
let populateDropDown = function() {
    if (searchHistory[0]) {
        for (let i = (searchHistory.length - 1); i >= 0 && i > (searchHistory.length - 10); i--) {
            $("<option>")
                .addClass("search-value searchHistory[" + i + "]")
                .attr("value", i)
                .text(searchHistory[i].date  + "\n" + searchHistory[i].time)
                .appendTo($("#search-history"));
        }
    }
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
        let saveObject = {"date": viewDate, "time": viewTime, };
        searchHistory.push(saveObject);
        localStorage.setItem("lookUpSearchHistory", JSON.stringify(searchHistory));
    }
    //re-populates drop-down with the 10 most recent searches
    populateDropDown();
}

//validates input, displays missing parameters in red, changes correct ones back
let validateInputs = function(viewDate, viewTime) {
    if (!viewDate) {
        $(".date-title").removeClass("white-text").addClass("red-text");
    } else {
        $(".date-title").removeClass("red-text").addClass("white-text");
    }
    if (!viewTime) {
        $(".time-title").removeClass("white-text").addClass("red-text");
    } else {
        $(".time-title").removeClass("red-text").addClass("white-text");
    }
}

// Populates search criteria with search history parameters
let bringHistoryBack = function() {
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
    let userViewDate = moment($("#view-date").val(), "ll").format("YYYY-MM-DD");
    let userViewTime = moment($("#view-time").val(), "HH:mm A").format("kk:mm:ss");
    validateInputs(userViewDate, userViewTime);
    if (userViewDate && userViewTime) {
        searchHistoryUpdate(userViewDate, userViewTime);
        // function for API calls
        getAstronomyData(latitude, longitude, userViewDate, userViewTime, 0);
    }
}

let displayInformation = function(planet, imgUrl) {
    let thisImage = $("<div>").addClass("result-" + planet + " search-result");
    $("<p>")
        .addClass("search-name")
        .text(planet)
        .appendTo(thisImage)
    $("<img>")
        .addClass("img-" + planet + " search-img")
        .attr("src", imgUrl)
        .appendTo(thisImage)
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
        .then( function(obj) {
            //uses random number to find photo
            let randomIndex = Math.floor(Math.random() * 50);
            displayInformation(planetName, obj.collection.items[randomIndex].links[0].href);
        })
}

// initial dropdown population from localStorage
populateDropDown();

// Click event listener for the Submit Button
$("#submit-btn").on("click", submitForm);

// Change event listener for activating the search history
$(".history").change(bringHistoryBack);