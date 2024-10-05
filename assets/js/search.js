"use strict";

import { api_key } from "./api.js";
import { createMovieCard } from "./movie-card.js";

export function search() {
  const searchWrapper = document.querySelector(".search-wrapper");
  const searchField = document.querySelector(".search-field");

  const searchResultModal = document.createElement("div");
  searchResultModal.classList.add("search-result");
  document.querySelector("main").appendChild(searchResultModal);

  let searchTimeout;

  searchField.addEventListener("input", function () {
    if (!searchField.value.trim()) {
      searchResultModal.classList.remove("active");
      searchWrapper.classList.remove("searching");
      clearTimeout(searchTimeout);
      return;
    }

    searchWrapper.classList.add("searching");
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searchField.value}&page=1&include_adult=false`;

      // Fetch movies directly using fetch.then.then
      fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const movieList = data.results;
    
        searchWrapper.classList.remove("searching");
        searchResultModal.classList.add("active");
        searchResultModal.innerHTML = ""; 
    
        searchResultModal.innerHTML = `
          <p class="label">Results for</p>
          <h1 class="heading">${searchField.value}</h1>
          <div class="movie-list">
            <div class="grid-list">
            
            </div>
          </div>
        `;
    
        for (const movie of movieList) {
          const movieCard = createMovieCard(movie);
          searchResultModal.querySelector(".grid-list").appendChild(movieCard);
        }
    
        // Check if there are fewer than 8 movies in the result
        if (movieList.length < 10) {
          // Fetch actor data if movie results are less than 8
          const actorSearchUrl = `https://api.themoviedb.org/3/search/person?api_key=${api_key}&query=${searchField.value}&page=1&include_adult=false`;
    
          fetch(actorSearchUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(actorData => {
              if (actorData.results.length > 0) {
                const actorId = actorData.results[0].id; 
    
                // Fetch movies for the actor
                const actorMoviesUrl = `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${api_key}`;
    
                fetch(actorMoviesUrl)
                  .then(response => {
                    if (!response.ok) {
                      throw new Error('Network response was not ok');
                    }
                    return response.json();
                  })
                  .then(actorMoviesData => {
                    const actorMovies = actorMoviesData.cast;
    
                    for (const movie of actorMovies) {
                      const movieCard = createMovieCard(movie);
                      searchResultModal.querySelector(".grid-list").appendChild(movieCard);
                    }
                  })
                  .catch(error => {
                    console.error('Error fetching actor movies:', error);
                  });
              } else {
                alert("No actor or movie found with the provided name.")
              }
            })
            .catch(error => {
              console.error('Error fetching actor data:', error);
            });
        }
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
    
    }, 500);
  });
}
