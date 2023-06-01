// Model
const state = {
  movieList: [],
  page: 1,
  total: 0,
  curr: 'popular',
  folder: 'Home',
  likedList:[]
};
const details = {
  overview: '',
  genres: [],
  production_companies: [],
  rating: 0,
  path: '',
  title: '',
};

// Controller
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjkwNzZhYzZlYzYwNjZiYzIzNzQwNDI3YThjNjUzMSIsInN1YiI6IjY0NzY0ZDU0YjMzOTAzMDBjMWVhYWIxNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FcBflcpWbgtPUzwZvmuoJkgotC0djBkYCmUT6a65yXc',
  },
};
function loadMovies(page) {
  // if current state is popular
  if (state.curr === 'popular') {
    fetch(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
      options
    )
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        state.movieList = response.results;

        state.total = response.total_pages;
        
        renderView();
      })
      .catch((err) => console.error(err));
  } else if (state.curr === 'Now playing') {
    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`,
      options
    )
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        state.movieList = response.results;

        state.total = response.total_pages;

        renderView();
      })
      .catch((err) => console.error(err));
  } else if (state.curr === 'Top rated') {
    fetch(
      `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`,
      options
    )
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        state.movieList = response.results;

        state.total = response.total_pages;

        renderView();
      })
      .catch((err) => console.error(err));
  } else if (state.curr === 'Up coming') {
    fetch(
      `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${page}`,
      options
    )
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        state.movieList = response.results;

        state.total = response.total_pages;

        renderView();
      })
      .catch((err) => console.error(err));
  }
}

loadMovies(state.page);

function loadModel(movieId) {

  fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options)
    .then((response) => response.json())
    .then((response) => {
      details.overview = response.overview;
      details.rating = response.vote_average;
      details.genres = response.genres;
      details.production_companies = response.production_companies;
      details.title = response.title;
      details.path = response.poster_path;
      

      renderModel();
    })
    .catch((err) => console.error(err));
}


// Viewpoint
document.querySelector('.nav-bar').addEventListener('click', (e) => {
  if (e.target.matches('[name = "Liked"]')) {
    state.folder = 'Liked';
    renderView();
  } else if (e.target.matches('[name = "HOME"]')) {
    state.folder = 'Home';
    renderView();
  }
});
document
  .querySelector('.filter-select')
  .addEventListener('change', function () {
    state.curr = this.value;
    state.page = 1;
    loadMovies(1);
  });

document
  .querySelector('.pagination-container')
  .addEventListener('click', function (e) {
    if (e.target && e.target.matches('.btn')) {
      console.log('Button clicked:', e.target.textContent);

      if (e.target.textContent.trim() == 'prev') {
        if (state.page > 1) {
          state.page -= 1;
          loadMovies(state.page);
        }
      } else if (e.target.textContent.trim() == 'next') {
        if (state.page < state.total) {
          state.page += 1;
          loadMovies(state.page);
        }
      }
    }
  });

function createModal() {
  const div = document.createElement('div');
  div.id = 'modal';

  div.innerHTML = `
      <div class = "modal-container">
        <div class = "close-modal">
            <ion-icon name="close"></ion-icon>
        </div>
        <div class= "modal-content">
            <div class="modal-img">
                <img src="https://image.tmdb.org/t/p/w500${details.path}" >
            </div>
            <div class="modal-info">
                <h2>${details.title}</h2>
                <br>
                <h3>Overview</h3>
                <p class="modal-overview">${details.overview}</p>
                <h3>Genres</h3>
                <div class="genre-container">
                    
                </div>
                <h3>Rating</h3>
                <p>${details.rating}</p>
                <h3>Production companies</h3>
                <div class="production-container">
                </div>
            </div>
        </div>
      </div>
  `;
  const genreContainer = div.querySelector('.genre-container');
  details.genres.forEach((genre) => {
    const genreItems = document.createElement('div');
    genreItems.className = 'genre-item';
    genreItems.innerText = genre.name;
    genreContainer.appendChild(genreItems);
  });
  const productionContainer = div.querySelector('.production-container');
  details.production_companies.forEach((company) => {
    if (company.logo_path) {
      const companyIcons = document.createElement('div');
      companyIcons.className = 'production-item';

      companyIcons.innerHTML = `<img src="https://image.tmdb.org/t/p/w500/${company.logo_path}">`;
      productionContainer.appendChild(companyIcons);
    }
  });
  const closeModalIcon = div.querySelector('.close-modal ion-icon');
  closeModalIcon.addEventListener('click', function () {
    div.style = 'display : none';
  });

  return div;
}
function renderModel() {
  document.querySelector('.modal-container').innerHTML = '';
  document.querySelector('.modal-container').append(createModal());
}
function createMovieNode(movie) {
  const div = document.createElement('div');
  div.className = 'movieCard';
  div.id = movie.id;

  div.innerHTML = `
        <div class="movie-card-image">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" >
        </div>
        <h4 class="movie-card-title">${movie.original_title}</h4>
        <div class="movie-card-rating">
          <div class="rating">
            <ion-icon name="star"></ion-icon>
            <span>${movie.vote_average}</span>
          </div>
          <div>
            <ion-icon name="heart-empty"></ion-icon>
            
          </div>
        </div>
  `;
  let heartIcon = div.querySelector(
    'ion-icon[name="heart-empty"], ion-icon[name="heart"]'
  );

  liked = false;
  state.likedList.forEach(e => {
    if (e.id === movie.id) {
      liked = true;
    }
  })
  if (liked === true) {
    heartIcon.name = 'heart';
    heartIcon.style.color = 'red';
  }

  heartIcon.addEventListener('click', function () {
    if (heartIcon.name === 'heart') {
      heartIcon.name = 'heart-empty';
      heartIcon.style.color = 'black';
      
      state.likedList = state.likedList.filter((movie) => {
        return movie.id !== Number(div.id)
      });
    } else {
      heartIcon.name = 'heart';
      heartIcon.style.color = 'red';
      state.likedList.push(movie);
    }
    console.log(state.likedList);
  });

  return div;
}

function renderView() {
  const postion = document.querySelector('#total-position');
  postion.innerHTML = `${state.page} / ${state.total}`;
  const movieContainer = document.querySelector('.list-container');

  movieContainer.innerHTML = '';
  if (state.folder === 'Home') {
    state.movieList.forEach((movie) => {
      const li = createMovieNode(movie);
      movieContainer.append(li);
    });

    movieContainer.addEventListener('click', function (e) {
      const element = e.target;
      if (element.matches('.movie-card-title')) {
        const movie = element.closest('.movieCard');

        loadModel(movie.id);
      }
    });
  } else if (state.folder === 'Liked') {

    state.likedList.forEach((movie) => {
      const li = createMovieNode(movie);
      movieContainer.append(li);
    });

    movieContainer.addEventListener('click', function (e) {
      const element = e.target;
      if (element.matches('.movie-card-title')) {
        const movie = element.closest('.movieCard');

        loadModel(movie.id);
      }
    });
  }
}
