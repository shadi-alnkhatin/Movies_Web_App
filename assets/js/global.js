"use strict";

// Add event on multiple elements
const addEventOnElements = function (elements, eventType, callback) {
  for (const elem of elements) elem.addEventListener(eventType, callback);
};

// Toggle search box in mobile device || small screen
const searchBox = document.querySelector("[search-box]");
const searchTogglers = document.querySelectorAll("[search-toggler]");

addEventOnElements(searchTogglers, "click", function () {
  searchBox.classList.toggle("active");
});

// store movieID in `LocalStorage` when you click any card
function getMovieDetail (movieId) {
  localStorage.setItem("movieId", String(movieId));
};

const getMovieList = function (genreId, genreName) {
 localStorage.setItem("urlParam", genreId);
 localStorage.setItem("genreName", genreName);
};
