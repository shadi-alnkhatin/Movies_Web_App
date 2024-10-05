"use strict"; 

// Importing the necessary functions and constants from other files
import { api_key, imageBaseURL } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const movieId = localStorage.getItem("movieId");
const pageContent = document.getElementById("container");
sidebar();
search();
let favorite_Arr = [];

favorite_Arr = JSON.parse(localStorage.getItem("array"));
if(favorite_Arr == null){
  localStorage.setItem("array",JSON.stringify(favorite_Arr))
  favorite_Arr = [];
}
  let favorite = "false";
  if (favorite_Arr.includes(movieId)){
    favorite = "true";
  }



// Helper function to format genres into a readable list
function getGenres(genreList) {
  let newGenreList = [];

  for (let genre of genreList) {
    newGenreList.push(genre.name);
  }

  // Return genres as a comma-separated string
  return newGenreList.join(", ");
};

// Helper function to get the names of up to 10 cast members
function getCasts  (castList) {
  let newCastList = [];

  for (let i = 0; i < castList.length && i < 10; i++) {
    newCastList.push(castList[i].name);
  }


  return newCastList.join(", ");
};

// Helper function to get the names of directors from the crew list
function getDirectors (crewList) {
  let directors = crewList.filter( (crewMember)=> {
    return crewMember.job === "Director";
  });

  let directorNames = directors.map( (director)=> {
    return director.name; 
  });
  return directorNames.join(", ");
};


// Helper function to filter out only trailers and teasers from YouTube
function filterVideos(videoList) {

  let filteredVideos = [];

  // Loop through each video in the list
  for (let video of videoList) {
    // Check if the video is a Trailer or Teaser and is from YouTube
    if ((video.type === "Trailer" || video.type === "Teaser") && video.site === "YouTube") {

      // If it meets the condition, add it to the filtered videos array

      filteredVideos.push(video);
    }
  }
  return filteredVideos;
};

// Fetch the movie details from the TMDB API

fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`)
  .then(function (response) {
    return response.json(); 
  })
  .then(function (movie) {
    // Destructure the important details from the movie object
    const backdrop_path = movie.backdrop_path; 
    const poster_path = movie.poster_path;
    const title = movie.title; 
    const release_date = movie.release_date; 
    const runtime = movie.runtime; 
    const vote_average = movie.vote_average; 
    const certification = movie.releases.countries[0]?.certification || "N/A"; 
    const genres = movie.genres; 
    const overview = movie.overview; 
    const cast = movie.casts.cast; 
    const crew = movie.casts.crew; 
    const movieId=movie.id;
    const videos = movie.videos.results;
    let VideosFiltered=filterVideos(videos); 
    let favorite_Arr = [];

favorite_Arr = JSON.parse(localStorage.getItem("array"));
if(favorite_Arr == null){
  localStorage.setItem("array",JSON.stringify(favorite_Arr))
  favorite_Arr = [];
}

  let favorite = "false";

  if (favorite_Arr.includes(movieId)){
    favorite = "true";
  }
    // Create a container for the movie details
    let movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");

    movieDetail.innerHTML = `
      <div class="backdrop-image" style="background-image: url('${imageBaseURL}w1280${backdrop_path || poster_path}')"></div>
      
      <figure class="poster-box movie-poster">
        <img src="${imageBaseURL}w342${poster_path}" alt="${title} poster" class="img-cover">
      </figure>
      
      <div class="detail-box">
        <div class="detail-content">
          <h1 class="heading">${title}</h1>

          <div class="meta-list">
            <div class="meta-item">
              <img src="./assets/images/star.png" width="20" height="20" alt="rating">
              <span class="span">${vote_average.toFixed(1)}</span>
          
            </div>

            <div class="separator"></div>

            <div class="meta-item">${runtime}m</div>

            <div class="separator"></div>

            <div class="meta-item">${release_date ? release_date.split("-")[0] : "Not Released"}</div>

            <div class="meta-item card-badge">${certification}</div>
             <div class="separator"></div>
        <button id="favorite-button-id${movieId}" class="favorite" href="" style="z-index=1000; display: abslute;" onclick="favorite_togle(${movieId});" favotite="${favorite}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
</svg></button>
          </div>

          <p class="genre">${getGenres(genres)}</p>
          <p class="overview">${overview}</p>

          <ul class="detail-list">
            <div class="list-item">
              <p class="list-name">Starring</p>
              <p>${getCasts(cast)}</p>
            </div>

            <div class="list-item">
              <p class="list-name">Directed By</p>
              <p>${getDirectors(crew)}</p>
            </div>
          </ul>
        </div>

        <div class="title-wrapper">
          <h3 class="title-large">Trailers and Clips</h3>
        </div>

        <div class="slider-list">

          <div class="slider-inner">
          
          </div>

        </div>
      </div>
    `;

    // Loop over the filtered videos (trailers and teasers)
    for (let video of VideosFiltered) {
      let videoCard = document.createElement("div");
      videoCard.classList.add("video-card");

      videoCard.innerHTML = `
        <iframe width="500" height="294" src="https://www.youtube.com/embed/${video.key}?&theme=dark&color=white&rel=0"
          frameborder="0" allowfullscreen="1" title="${video.name}" class="img-cover" loading="lazy"></iframe>
      `;

      // Add each video to the slider
      movieDetail.querySelector(".slider-inner").appendChild(videoCard);
    }

    // Add the movie details to the page
    pageContent.appendChild(movieDetail);

    // Fetch movie recommendations based on the current movie
  return fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`);
  })
  .then(function (response) {
    return response.json(); 
  })
  .then(function (recommendations) {
    addSuggestedMovies(recommendations);
  })
  .catch(function (error) {
    console.error("Error fetching movie details:", error); 
  });


// Function to add suggested movies to the page
function addSuggestedMovies (response) {
  let movieList = response.results;

  // Create a section for suggested movies
  let movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = "You May Also Like";

  movieListElem.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">You May Also Like</h3>
    </div>

    <div class="slider-list">

      <div class="slider-inner">
      
      </div>

    </div>
  `;

  // Add each recommended movie to the list
  for (let movie of movieList) {
    let movieCard = createMovieCard(movie); // Uses createMovieCard function
    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  }

  // Add the recommended movies to the page
  pageContent.appendChild(movieListElem);
};
