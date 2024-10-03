"use strict";

import { api_key } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";


const genreName = window.localStorage.getItem("genreName");
const urlParam = window.localStorage.getItem("urlParam");

const pageContent = document.querySelector("[page-content]");

sidebar();

let currentPage = 1;
let totalPages = 0;

console.log(favorite_Arr);

function fetchMovies(page) {


document.title = `${genreName} Movies - Tvflix`; // Set the page title

      // Create or clear the section for the movie list
      let movieListElem = document.querySelector('.movie-list');
      if (!movieListElem) {
        movieListElem = document.createElement("section");
        movieListElem.classList.add("movie-list", "genre-list");
        movieListElem.ariaLabel = `${genreName} Movies`;

        // Add the title and a grid list to the movie list section
        movieListElem.innerHTML = `
          <div class="title-wrapper">
            <h1 class="heading">All ${genreName} Movies</h1>
          </div>
          <div class="grid-list"></div>
          <div class="pagination">
            <button class="btn prev" ${page === 1 ? 'disabled' : ''}>Previous</button>
            <button class="btn next">Next</button>
          </div>
        `;
        pageContent.appendChild(movieListElem); // Add the movie list section to the page
      } else {
        movieListElem.querySelector(".grid-list").innerHTML = ''; // Clear existing movie cards
      }


      favorite_Arr.forEach(element => {
        const url = `https://api.themoviedb.org/3/movie/${element}?api_key=${api_key}&append_to_response=casts,videos,images,releases`;
        fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
        console.log(data);
        const movieCard = createMovieCard(data);
        movieListElem.querySelector(".grid-list").appendChild(movieCard); 
    });
      });
};

fetchMovies(currentPage);

// Add event listeners for pagination buttons
pageContent.addEventListener('click', function(event) {
  if (event.target.classList.contains('prev')) {
    if (currentPage > 1) {
      currentPage--;
      fetchMovies(currentPage);
    }
  } else if (event.target.classList.contains('next')) {
    if (currentPage < totalPages) {
      currentPage++;
      fetchMovies(currentPage);
    }
  }
});

search();