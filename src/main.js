//DATA

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
        "language": navigator.language || "es-ES"
    }
});

function likedMoviesList() {
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if (item) {
        movies = item;
    } else {
        movies = {};
    }

    return movies;
}

function likeMovie(movie) {
    // movie.id
    const likedMovies = likedMoviesList();

    console.log(likedMovies)

    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
}


//-------------UTILS-------------

//Intersection Observer - Lazy Loader
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img')
            entry.target.setAttribute('src', url);
        }
    });
});

//GENERADOR DE LISTADO DE PELICULAS
function createMovies(
    movies,
    container, {
        lazyLoad = false,
        clean = true,
    } = {}
) {

    if (clean) {
        container.innerHTML = ""; // Limpiar el contenedor
    }

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('loading', 'lazy');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src',
            'https://image.tmdb.org/t/p/w300' + movie.poster_path,
        );

        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src', 'https://media.istockphoto.com/id/1222249647/photo/creative-illustration.jpg?s=612x612&w=0&k=20&c=N6foEeJRoGSTl1LcN1RJ1aP_G3FhZ8aWku30iwtmT4A=');
        });

        movieImg.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id
        })

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn')
        likedMoviesList()[movie.id] && movieBtn.classList.toggle('movie-btn--liked');
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
            getLikedMovies();
            //
        });



        if (lazyLoad) {
            lazyLoader.observe(movieImg)
        }

        movieContainer.appendChild(movieImg);
        movieContainer.append(movieBtn)
        container.appendChild(movieContainer);
    });
}

//GENERADOR DE LISTADO DE CATEGORIAS
function createCategories(categories, container) {
    container.innerHTML = ""; // Limpiar el contenedor

    categories.forEach(category => {

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });
}


//GET -  PELICULAS EN TENDENDIA PARA EL HOME - PREVIEW
async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day')

    const movies = data.results;
    //console.log({ data, movies }); //revisar datos que traemos

    trendingMoviesPreviewList.innerHTML = " ";

    createMovies(movies, trendingMoviesPreviewList, true);
}

//GET - PELICULAS EN TENDENCIA - TRENDS
async function getTrendingMovies() {
    const { data } = await api('trending/movie/day')

    const movies = data.results;
    maxPage = data.total_pages
    genericSection.innerHTML = " ";

    createMovies(movies, genericSection, { lazyLoad: true, clean: true });
}

async function getPaginatedTrendingMovies() {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
        page++;
        const { data } = await api('trending/movie/day', {
            params: {
                page,
            },
        });
        const movies = data.results;

        createMovies(
            movies,
            genericSection,
            { lazyLoad: true, clean: false },
        );
    }
}

//console.log({ data, movies }); //revisar datos que traemos
// const btnLoadMore = document.getElementById('btnLoadMore');
// genericSection.removeChild(btnLoadMore);

// btnLoadMore.innerText = 'Cargas más';
// btnLoadMore.id = 'btnLoadMore';
// btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
// genericSection.appendChild(btnLoadMore);

//GET - LISTA DE CATEGORIAS

async function getCategoriesPreview() {
    const { data } = await api('genre/movie/list');
    const categories = data.genres;

    categoriesPreviewList.innerHTML = "";

    createCategories(categories, categoriesPreviewList);
}

//GET -  CATEGORIAS ID 
async function getMoviesByCategory(id) {
    const { data } = await api('discover/movie', {
        params: {
            with_genres: id,
        },
    })

    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, genericSection, { lazyLoad: true });
}

function getPaginatedMoviesByCategory(id) {
    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;

        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const { data } = await api('discover/movie', {
                params: {
                    with_genres: id,
                    page,
                },
            });
            const movies = data.results;

            createMovies(
                movies,
                genericSection,
                { lazyLoad: true, clean: false },
            );
        }
    }
}

//GET - SEARCH
async function getMoviesBySearch(query) {
    window.scrollTo(0, 0)

    const { data } = await api('search/movie', {
        params: {
            query,
        },
    })

    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage)

    genericSection.innerHTML = " ";
    createMovies(movies, genericSection);
}

function getPaginatedMoviesBySearch(query) {
    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
        const pageIsNotMax = page < maxPage;

        if (scrollIsBottom && pageIsNotMax) {
            page++;
            const { data } = await api('search/movie', {
                params: {
                    query,
                    page,
                },
            });
            const movies = data.results;

            createMovies(
                movies,
                genericSection,
                { lazyLoad: true, clean: false },
            );
        }
    }
}
//GET MOVIE BY ID DETAIL
async function getMovieById(id) {
    window.scrollTo(0, 0)

    const { data: movie } = await api('movie/' + id);

    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;

    headerSection.style.background = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), 
        url(${movieImgUrl})
    `

    movieDetailTitle.textContent = movie.title
    movieDetailDescription.textContent = movie.overview
    movieDetailScore.textContent = movie.vote_average

    createCategories(movie.genres, movieDetailCategoriesList)

    getRelatedMoviesId(id)
}

async function getRelatedMoviesId(id) {
    const { data } = await api(`movie/${id}/similar`);
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer)
}

//GET LOCAL STORAGE 
function getLikedMovies() {

    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies);

    createMovies(moviesArray, likedMoviesListArticle, { lazyLoad: true, clean: true })
}


