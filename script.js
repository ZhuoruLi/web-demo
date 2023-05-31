// Model
const state = {
  movieList: [],
  page: 1,
  total: 0,
  curr: 'popular',
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
        console.log(response);
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
        console.log(response);
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
        console.log(response);
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
        console.log(response);
        renderView();
      })
      .catch((err) => console.error(err));
  }
}

loadMovies(state.page);
// fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
//   .then(response => response.json())
//   .then(response => {
//     console.log(response.results[0])
//   })
//   .catch(err => console.error(err));

// Viewpoint
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
  return div;
}

function renderView() {
  const postion = document.querySelector('#total-position');
  postion.innerHTML = `${state.page} / ${state.total}`;
  const movieContainer = document.querySelector('.list-container');

  movieContainer.innerHTML = '';
  state.movieList.forEach((movie) => {
    const li = createMovieNode(movie);
    movieContainer.append(li);
  });

  // const neighborsContainer = document.querySelector('.neighbors');
  // const neighborsTitle = document.querySelector('.neighbors-title');

  // if (state.neighbors.length) {
  //   neighborsTitle.className = 'neighbors-title show';
  // } else {
  //   neighborsTitle.className = 'neighbors-title';
  // }
  // neighborsContainer.innerHTML = '';
  // state.neighbors.forEach((country) => {
  //   const li = createCountryNode(country);
  //   neighborsContainer.append(li);
  // });
}
