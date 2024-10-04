"use strict";

import { sidebar } from "./sidebar.js";
import { api_key } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

 const pageContent =document.getElementById("container");  
 sidebar();
 search();

const homePageSections = [
  { title: "Upcoming Movies", path: "/movie/upcoming" },
  { title: "Weekly Trending Movies", path: "/trending/movie/week" },
  { title: "Top Rated Movies", path: "/movie/top_rated" }
];

const genreList = {
  asString(genreIdList) {
    let genreNames = [];
    for (const genreId of genreIdList) {
      if (this[genreId]) genreNames.push(this[genreId]);
    }
    return genreNames.join(", ");
  }
};

fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`)
  .then(response => {
    return response.json();
  })
  .then(data => {
    for (const genre of data.genres) genreList[genre.id] = genre.name;
  })
  .then(() => {
    homePageSections.forEach(section => {
      fetch(`https://api.themoviedb.org/3${section.path}?api_key=${api_key}&page=1`)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then(data => displayMovieSection(data, section.title))
        .catch(error => console.error('Error:', error));
    });
  })
  .catch(error => console.error('Error fetching genres:', error));

function displayMovieSection(data, title) {
  const section = document.createElement("section");
  section.classList.add("movie-list");

  section.innerHTML = `
    <h3>${title}</h3>
    <div class="slider-list">
      <div class="slider-inner"></div>
    </div>
  `;

  data.results.forEach(movie => {
    const movieCard = createMovieCard(movie);
    section.querySelector(".slider-inner").appendChild(movieCard);
  });
  pageContent.appendChild(section);
}
