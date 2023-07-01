// API endpoint:
const API_URL = "http://localhost:3000/films";

// fetch characters from API
const fetchFilms = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data;
};

const fetchFilm = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  const data = await response.json();
  return data;
};

// buy ticket function
const buyTicket = async (id) => {
  const movie = await fetchFilm(id);
  if (movie.tickets_sold === movie.capacity) {
    alert("Sold out");
    return;
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tickets_sold: movie.tickets_sold + 1,
    }),
  });
  const data = await response.json();
  return data;
};

// get the character section from the DOM
const filmSection = document.querySelector("#films");
const first_movie = document.querySelector("#first_movie");

const filmTemplate = (film) => {
  const availableTickets = film.capacity - film.tickets_sold;
  const soldOut = availableTickets === 0;

  return `
        <div class="movie" data-id="${film.id}">
            <img src="${film.poster}" alt="${film.title}" />
            <div class="movie_details">
                <div class="movie_details_header">
                    <h2>${film.title}</h2>
                    <p class="badge">Time: ${film.runtime} min</p>
                </div>
                <div class="flex movie_details_extra">
                    <p>📽 Showtime : ${film.showtime}</p>
                   ${
                     soldOut
                       ? `<p> 🎫 Sold Out</p>`
                       : `<p>🎫 Available : ${availableTickets}</p>`
                   }
                </div>
            
                <button type="button" id="buy_ticket" class='buy_ticket ${
                  soldOut ? "disabled" : ""
                }' data-id="${film.id}">
                    Buy Ticket
                </button>
                <p>${film.description}</p>
            </div>
        </div>
    `;
};

document.addEventListener("DOMContentLoaded", async () => {
  const films = await fetchFilms();
  first_movie.innerHTML = filmTemplate(films[0]);

  films.map((film, index) => {
    // remove the first film from the list
    if (index === 0) return;
    const listMovie = document.createElement("li", { id: film.id });

    listMovie.innerHTML = filmTemplate(film);
    filmSection.append(listMovie);
  });
});

// add event listener to the film section
const buyTicketButton = document.querySelector("#buy_ticket");

first_movie.addEventListener("click", async (e) => {
  if (e.target.id === "buy_ticket") {
    console.log(e.target.dataset.id);
    const id = e.target.dataset.id;
    const film = await buyTicket(id);
    first_movie.innerHTML = filmTemplate(film);
  }
});
