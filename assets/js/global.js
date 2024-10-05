"use strict";

const searchBox = document.querySelector("[search-box]");
const searchTogglers = document.querySelectorAll("[search-toggler]");
searchTogglers.forEach(toggler => {
  toggler.addEventListener("click", () => {
    searchBox.classList.toggle("active");
  });
});

// store movieID in `LocalStorage` when you click any card
function getMovieDetail (movieId) {
  localStorage.setItem("movieId", String(movieId));
};

const getMovieList = function (urlParam, genreName) {
  window.localStorage.setItem("urlParam", urlParam);
  window.localStorage.setItem("genreName", genreName);
};

let favorite_Arr = JSON.parse(localStorage.getItem("array"));
if(favorite_Arr == null){
  favorite_Arr=[]
  let temp = JSON.stringify(favorite_Arr);
localStorage.setItem("array",temp);
}

function favorite_status(id){
  console.log(id);
  let b = document.querySelector("#favorite-button-id"+id);
  
  if(favorite_Arr.includes(id))
    b.classList.add("favorite-button");
}



function favorite_togle(id){
  let b = document.querySelector("#favorite-button-id"+id);

  if(b.getAttribute("favotite") == "false"){
    favorite_Arr.push(id);
    b.setAttribute("favotite","true");
  } else {
    favorite_Arr.splice(favorite_Arr.indexOf(id),1);
    console.log(favorite_Arr.indexOf(id)+1);
    
    b.setAttribute("favotite","false");

  }
console.log(favorite_Arr);
let temp = JSON.stringify(favorite_Arr);
localStorage.setItem("array",temp);
let array = JSON.parse(localStorage.getItem("array"));
console.log(array);
}


function logout(){
 location.href("./index.html")
}
