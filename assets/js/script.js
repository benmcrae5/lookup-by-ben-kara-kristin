// script for UofA Bootcamp Project 1 index.html

// api.nasa.gov Key: bAkwC8fyPvowqus1b73c6wRxPBMW2e6F15AiO19h

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

// Submit Button function:
let submitForm = function () {
    let userLocation = $("#city-name").val();
    let userViewDate = $("#view-date").val();
    let userViewTime = $("#view-time").val();

}

// Click event listener for the Submit Button
$("#submit-btn").on("click", submitForm);