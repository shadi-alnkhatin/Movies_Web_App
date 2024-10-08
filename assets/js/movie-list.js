"use strict";

import { api_key } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";


const genreName = window.localStorage.getItem("genreName");
const urlParam = window.localStorage.getItem("urlParam");

const pageContent =document.getElementById("container"); 

sidebar();
search();



let currentPage = 1;
let totalPages = 0;

function fetchMovies(page) {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${page}&${urlParam}`;
 
  // Use fetch to get the movie data
  fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {
      const { results: movieList, total_pages } = data; // Destructure the movie list and total pages
      totalPages = total_pages;




      // Create or clear the section for the movie list
      let movieListElem = document.querySelector('.movie-list');//t
      if (!movieListElem) {
        movieListElem = document.createElement("section");
        movieListElem.classList.add("movie-list", "genre-list");
   

        // Add the title and a grid list to the movie list section
        movieListElem.innerHTML = `
          <div id="start" class="title-wrapper">
            <h1 class="heading">All ${genreName} Movies</h1>
          </div>

          <div  class="grid-list"></div>

          <div  href="#start" class="pagination">
            <a href="#start" class="btn prev" ${page === 1 ? 'disabled' : ''}>Previous</a>
            <a href="#start" class="btn next">Next</a>
            </div>
          <div class="grid-list"></div>

       
        `;
        pageContent.appendChild(movieListElem); // Add the movie list section to the page
      } else {
        movieListElem.querySelector(".grid-list").innerHTML = ''; // Clear existing movie cards
      }

      // Add movie cards based on fetched items
      for (const movie of movieList) {
        const movieCard = createMovieCard(movie);
        movieListElem.querySelector(".grid-list").appendChild(movieCard); 
      }

      // Enable or disable buttons based on the current page


      movieListElem.querySelector('.next').disabled = currentPage >= totalPages; // Disable "Next" if on the last page
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error); // Handle any errors
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






