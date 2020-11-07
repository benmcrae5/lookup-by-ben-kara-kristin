// script for UofA Bootcamp Project 1 index.html

// api.nasa.gov Key: bAkwC8fyPvowqus1b73c6wRxPBMW2e6F15AiO19h

let searchHistory = JSON.parse(localStorage.getItem("lookUpSearchHistory")) || [];

var key = "bAkwC8fyPvowqus1b73c6wRxPBMW2e6F15AiO19h";

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

// takes in location,date,time and updates the Search history on the page and in Local Storage
let searchHistoryUpdate = function (viewLocation, viewDate, viewTime) {
    let repeatIndex = 0;
    if (searchHistory[0]) {
        for (let i = 0; i < searchHistory.length; i++) {
            if (viewLocation === searchHistory[i].location && viewDate === searchHistory[i].date && viewTime === searchHistory[i].time) {
                repeatIndex++;
                break;
            }
        }
    }
    if (repeatIndex === 0) {
        let saveObject = {"location": viewLocation, "date": viewDate, "time": viewTime, };
        searchHistory.push(saveObject);
        localStorage.setItem("lookUpSearchHistory", JSON.stringify(searchHistory));
    }

    // NEED a function to update visual search history and add that here
}

//validates input, displays missing parameters in red, changes correct ones back
let validateInputs = function(viewLocation, viewDate, viewTime) {
    if (!viewLocation) {
        $(".location-title").removeClass("white-text").addClass("red-text");
    } else {
        $(".location-title").removeClass("red-text").addClass("white-text");
    }
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

// Submit Button function:
let submitForm = function () {
    let userLocation = $("#city-name").val();
    let userViewDate = $("#view-date").val();
    let userViewTime = $("#view-time").val();
    validateInputs(userLocation, userViewDate, userViewTime);
    if (userLocation && userViewDate && userViewTime) {
        searchHistoryUpdate(userLocation, userViewDate, userViewTime);
        // function for API calls 
    }
}

// Click event listener for the Submit Button
$("#submit-btn").on("click", submitForm);