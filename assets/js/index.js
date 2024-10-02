"use strict"; // This makes sure we write clean code

// Importing functions and variables from other files
import { sidebar } from "./sidebar.js"; // Handles sidebar functionality
import { api_key, imageBaseURL } from "./api.js"; // API key, base URL, and data fetch function
import { createMovieCard } from "./movie-card.js"; // Creates movie cards
import { search } from "./search.js"; // Handles the search functionality

// Select the main content area in the HTML where the movie data will be displayed
const pageContent = document.querySelector("[page-content]");

// Show the sidebar on the page
sidebar();

// Set up the different sections that will be displayed on the home page
const homePageSections = [
  {
    title: "Upcoming Movies", // This section will show upcoming movies
    path: "/movie/upcoming",  // Path to get upcoming movies from the API
  },
  {
    title: "Weekly Trending Movies", // This section will show trending movies of the week
    path: "/trending/movie/week",    // Path to get trending movies from the API
  },
  {
    title: "Top Rated Movies",  // This section will show top-rated movies
    path: "/movie/top_rated",   // Path to get top-rated movies from the API
  },
];

// This object will store movie genres (e.g., Action, Comedy)
const genreList = {
  // This function will take a list of genre IDs and return them as a string (e.g., "Action, Comedy")
  asString(genreIdList) {
    let genreNames = []; // An array to store genre names

    // For each genre ID in the list, check if it exists in the genreList object
    for (const genreId of genreIdList) {
      if (this[genreId]) { // If it exists, add the genre name to the array
        genreNames.push(this[genreId]);
      }
    }

    // Return the genre names as a comma-separated string
    return genreNames.join(", ");
  },
};

// Fetch the list of movie genres from the API
// Fetch the genre list
fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Store each genre (with its ID and name) in the genreList object
    for (const genre of data.genres) {
      genreList[genre.id] = genre.name;
    }

    // After getting the genres, fetch popular movies for the hero banner
    return fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`);
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(popularMovies => {
    displayHeroBanner(popularMovies); // Call the function to display the hero banner with popular movies
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error); // Handle any errors
  });

// Function to display the hero banner (the large slider on top of the page)
function displayHeroBanner(data) {
  // Create a section for the banner
  const banner = document.createElement("section");
  banner.classList.add("banner");

  // Add empty containers for the slider and control buttons
  banner.innerHTML = `
    <div class="banner-slider"></div>
    <div class="slider-control">
      <div class="control-inner"></div>
    </div>
  `;

  // Loop through the list of popular movies
  data.results.forEach(function (movie, index) {
    // Create a slide for each movie
    const slide = document.createElement("div");
    slide.classList.add("slider-item");

    // Add the movie details to the slide
    slide.innerHTML = `
      <img src="${imageBaseURL}w1280${movie.backdrop_path}" alt="${movie.title}">
      <div class="banner-content">
        <h2>${movie.title}</h2>
        <p>Released: ${movie.release_date ? movie.release_date.split("-")[0] : "N/A"}</p>
        <p>Rating: ${movie.vote_average.toFixed(1)}</p>
        <p>Genres: ${genreList.asString(movie.genre_ids)}</p>
        <p>${movie.overview}</p>
        <a href="./detail.html" onclick="getMovieDetail(${movie.id})">Watch Now</a>
      </div>
    `;

    // Add the slide to the banner slider
    banner.querySelector(".banner-slider").appendChild(slide);

    // Create a control button for the slide
    const controlButton = document.createElement("button");
    controlButton.classList.add("slider-item");
    controlButton.innerHTML = `<img src="${imageBaseURL}w154${movie.poster_path}" alt="${movie.title}">`;
    
    // Add the control button to the banner controls
    banner.querySelector(".control-inner").appendChild(controlButton);
  });

  // Add the completed banner to the page content
  pageContent.appendChild(banner);

  // Activate the slider functionality
  activateSlider();

  // After the hero banner is displayed, fetch and display the home page sections (e.g., Upcoming Movies)
  homePageSections.forEach(function (section) {
    fetch(`https://api.themoviedb.org/3${section.path}?api_key=${api_key}&page=1`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        displayMovieSection(data, section.title); // Call the function to display the movie section
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error); // Handle any errors
      });
  });
  
}

// Function to activate the slider (so users can click through the slides)
function activateSlider() {
  const sliderItems = document.querySelectorAll(".slider-item");
  const controlButtons = document.querySelectorAll(".slider-control button");

  // Start with the first slide active
  sliderItems[0].classList.add("active");
  controlButtons[0].classList.add("active");

  // Add a click event to each control button to change the slide
  controlButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      // Remove the "active" class from the current slide and button
      document.querySelector(".slider-item.active").classList.remove("active");
      document.querySelector(".slider-control button.active").classList.remove("active");

      // Add the "active" class to the clicked button and corresponding slide
      sliderItems[index].classList.add("active");
      controlButtons[index].classList.add("active");
    });
  });
}

// Function to display movie sections like "Upcoming Movies" or "Top Rated Movies"
function displayMovieSection(data, title) {
  // Create a section for the movie list
  const section = document.createElement("section");
  section.classList.add("movie-list");

  // Add the title of the section
  section.innerHTML = `
    <h3>${title}</h3>
    <div class="slider-list">
      <div class="slider-inner"></div>
    </div>
  `;

  // Loop through the list of movies and create movie cards
  data.results.forEach(function (movie) {
    const movieCard = createMovieCard(movie); // This function creates a card for each movie
    section.querySelector(".slider-inner").appendChild(movieCard); // Add the card to the section
  });

  // Add the section to the page content
  pageContent.appendChild(section);
}

// Initialize the search functionality on the page
search();
