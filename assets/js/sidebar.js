"use strict";
import { api_key } from "./api.js";


export function sidebar() {
  const genreList = {};

 // Fetch the list of movie genres
fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`)
.then(response => {
  return response.json(); 
})
.then(data => {
  const { genres } = data; // Destructure the genres

  // Loop through each genre and store it in the genreList object
  for (const { id, name } of genres) {
    genreList[id] = name;
  }

  genreLink(); // Call the genreLink function after populating genreList
})
.catch(error => {
  console.error('There has been a problem with your fetch operation:', error); // Handle any errors
});

  const sidebarInner = document.createElement("div");
  sidebarInner.classList.add("sidebar-inner");

  sidebarInner.innerHTML = `
    <div class="sidebar-list">
      <p class="title">Genre</p>

    </div>
    <div class="sidebar-list">
      <a href="./favorite-list.html" menu-close="" class="sidebar-link" style="color: crimson;" >Watch Later list</a>

      <p class="title">Language</p>

      <a href="./movie-list.html" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=en", "English")'>English</a>
         <a href="./movie-list.html" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=ar", "Arabic")'>Arabic</a>
      <a href="./movie-list.html" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=tr", "Turkish")'>Turkish</a>


     <p class="title">Account</p>
    <a href="./index.html" menu-close class="sidebar-link"
        onclick='logout()'>Logout</a>
        <a href="./about-us.html" menu-close class="sidebar-link"
        >About Us</a>
    </div>
  `;

  const genreLink = function () {
    for (const [genreId, genreName] of Object.entries(genreList)) {
      const link = document.createElement("a");
      link.classList.add("sidebar-link");
      link.setAttribute("href", "./movie-list.html");
      link.setAttribute("menu-close", "");
      link.setAttribute(
        "onclick",
        `getMovieList("with_genres=${genreId}", "${genreName}")`
      );
      link.textContent = genreName;


      sidebarInner.querySelector(".sidebar-list").appendChild(link);
    }

    const sidebar = document.getElementById("sidebar");
    sidebar.appendChild(sidebarInner);
    toggleSidebar(sidebar);
  };

  const toggleSidebar = function (sidebar) {
    const sidebarBtn = document.querySelector("[menu-btn]");
    const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
    const sidebarClose = document.querySelectorAll("[menu-close]");

    const overlay = document.querySelector("#overlay");
  
    // Add click event listeners to sidebar buttons
    sidebarTogglers.forEach(function (toggler) {
      toggler.addEventListener("click", function () {
        sidebar.classList.toggle("active"); // Ensure you're toggling the sidebar here
        sidebarBtn.classList.toggle("active");
        overlay.classList.toggle("active");
      });
    });
  
    // Add click event listeners to sidebar close buttons
    sidebarClose.forEach(function (closer) {
      closer.addEventListener("click", function () {
        sidebar.classList.remove("active");
        sidebarBtn.classList.remove("active");
        overlay.classList.remove("active");
      });
    });
  };
}
