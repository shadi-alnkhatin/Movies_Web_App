"use strict";

import { api_key } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";


const genreName = localStorage.getItem("genreName");
const genreId= localStorage.getItem("urlParam");
const pageContent = document.getElementById("container");

sidebar();
search();

console.log(favorite_Arr);

function fetchMovies() {


document.title = `${genreName} Movies - MovieMaze`;

      // Create or clear the section for the movie list
      let movieListElem = document.querySelector('.movie-list');
      if (!movieListElem) {
        movieListElem = document.createElement("section");
        movieListElem.classList.add("movie-list", "genre-list");
        movieListElem.ariaLabel = `${genreName} Movies`;

        // Add the title and a grid list to the movie list section
        movieListElem.innerHTML = `
          <div class="title-wrapper">
            <h1 class="heading">Favorite Movies</h1>
          </div>
          <div class="grid-list"></div>
          
        `;
        pageContent.appendChild(movieListElem); // Add the movie list section to the page
      } else {
        movieListElem.querySelector(".grid-list").innerHTML = ''; // Clear existing movie cards
      }


      favorite_Arr.forEach(element => {
        const url = `https://api.themoviedb.org/3/movie/${element}?api_key=${api_key}&append_to_response=casts,videos,images,releases`;
        fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {
        console.log(data);
        const movieCard = createMovieCard(data);
        movieListElem.querySelector(".grid-list").appendChild(movieCard); 
    });
      });
};

fetchMovies();
