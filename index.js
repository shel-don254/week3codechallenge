const URL = "https://project-code-challenge-3.vercel.app/db.json";
const listHolder = document.getElementById("films");

document.addEventListener("DOMContentLoaded", () => {
  document.getElementsByClassName("film item")[0].remove();
  fetchOne(URL);
  fetchMovies(URL);
});

function fetchOne(URL) {
  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      setUpMovieDetails(data.films[0]);
    });
}

function fetchMovies(URL) {
  fetch(URL)
    .then((resp) => resp.json())
    .then((movies) => {
      movies.films.forEach((movie) => {
        displayMovie(movie);
      });
    });
}

function displayMovie(movie) {
  const list = document.createElement("li");
  list.classList.add("film", "item");
  list.textContent = movie.title;
  listHolder.appendChild(list);
  addClickEvent();
}

function addClickEvent() {
  let children = listHolder.children;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    child.addEventListener("click", () => {
      fetch(`${URL}`)
        .then((res) => res.json())
        .then((movie) => {
          document.getElementById("buy-ticket").textContent = "Buy Ticket";
          setUpMovieDetails(movie.films[i]);
        });
    });
  }
}

function setUpMovieDetails(funMovie) {
  const preview = document.getElementById("poster");
  preview.src = funMovie.poster;

  const movieTitle = document.querySelector("#title");
  movieTitle.textContent = funMovie.title;

  const movieTime = document.querySelector("#runtime");
  movieTime.textContent = `${funMovie.runtime} minutes`;

  const movieDescription = document.querySelector("#film-info");
  movieDescription.textContent = funMovie.description;

  const showTime = document.querySelector("#showtime");
  showTime.textContent = funMovie.showtime;

  const tickets = document.querySelector("#ticket-number");
  tickets.textContent = funMovie.capacity - funMovie.tickets_sold;
}

const btn = document.getElementById("buy-ticket");
btn.addEventListener("click", function (event) {
  let remainingTickets = document.querySelector("#ticket-number").textContent;
  event.preventDefault();
  if (remainingTickets > 0) {
    document.querySelector("#ticket-number").textContent = remainingTickets - 1;
  } else if (parseInt(remainingTickets, 10) === 0) {
    btn.textContent = "Sold Out";
  }
});
