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

// function to add searches to search dropdown
let populateDropDown = function() {
    if (searchHistory[0]) {
        for (let i = (searchHistory.length - 1); i >= 0 && i > (searchHistory.length - 10); i--) {
            console.log(searchHistory[i])
            let thisSearch = $("<option>")
                .addClass("search-value searchHistory[" + i + "]")
                .attr("value", i)
                .text(searchHistory[i].location + "\n" + searchHistory[i].date  + "\n" + searchHistory[i].time)
                .appendTo($("#search-history"));
        }
    }
}

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
    //re-populates drop-down with the 10 most recent searches
    populateDropDown();
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

// Populates search criteria with search history parameters
let bringHistoryBack = function() {
    let userIndex = $("#search-history").val();
    console.log(userIndex);
    if (userIndex !== "none") {
        $("#city-name").val(searchHistory[userIndex].location);
        $("#view-date").val(searchHistory[userIndex].date);
        $("#view-time").val(searchHistory[userIndex].time);
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

// initial dropdown population from localStorage
populateDropDown();

// Click event listener for the Submit Button
$("#submit-btn").on("click", submitForm);

// Change event listener for activating the search history
$(".history").change(bringHistoryBack);