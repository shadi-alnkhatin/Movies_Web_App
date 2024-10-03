"use strict";

import { imageBaseURL } from "./api.js";

// movie card

export function createMovieCard(movie) {
  
  const { poster_path, title, vote_average, release_date, id } = movie;

  const card = document.createElement("div");
  card.classList.add("movie-card");



  let favorite_Arr = [];

favorite_Arr = JSON.parse(localStorage.getItem("array"));
if(favorite_Arr == null){
  localStorage.setItem("array",JSON.stringify(favorite_Arr))
  favorite_Arr = [];
}
  
  let favorite = "false";

  if (favorite_Arr.includes(id)){
    favorite = "true";
  }
   

  card.innerHTML = `
    <figure class="poster-box card-banner" style="display: relative;">
      <img src="${imageBaseURL}w342${poster_path}" alt="${title}" class="img-cover" loading="lazy">
    </figure>
    
    <div class="flex_container">
    <h4 class="title">${title}</h4>
      <button id="favorite-button-id${id}" class="favorite" href="" style="z-index=1000; display: abslute;" onclick="favorite_togle(${id});" favotite="${favorite}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
</svg></button>
    </div>
          <a href="./detail.html" class="details-button" title="${title}" onclick="getMovieDetail(${id})">Go to details</a>
    <div class="meta-list">
      <div class="meta-item">
        <img src="./assets/images/star.png" width="20" height="20" loading="lazy" alt="rating">
    
        <span class="span">${vote_average.toFixed(1)}</span>
      </div>
    
      <div class="card-badge">${release_date.split("-")[0]}</div>
    </div>
    
     
  `;

  
  // if (favorite_Arr.includes(id))
  //   document.getElementById("favorite-button-id"+id).setAttribute("favotite","ture");
  // else
  //   document.getElementById("favorite-button-id"+id).setAttribute("favotite","false");

  
  return card;
  
}

