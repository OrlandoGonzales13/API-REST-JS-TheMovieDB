const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
        'language': 'es-ES'
    }
});

//GET -  PELICULAS EN TENDENDIA PARA EL HOME - PREVIEW
async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day')

    const movies = data.results;
    //console.log({ data, movies }); //revisar datos que traemos

    trendingMoviesPreviewList.innerHTML = " ";

    createMovies(movies, trendingMoviesPreviewList);

}

//GET - PELICULAS EN TENDENCIA - TRENDS
async function getTrendingMovies() {
    const { data } = await api('trending/movie/day')

    const movies = data.results;
    //console.log({ data, movies }); //revisar datos que traemos

    genericSection.innerHTML = " ";

    createMovies(movies, genericSection);
}

//GET - LISTA DE CATEGORIAS
async function getCategoriesPreview() {
    const { data } = await api('genre/movie/list');
    const categories = data.genres;

    categoriesPreviewList.innerHTML = "";

    createCategories(categories, categoriesPreviewList);
}

//GET -  CATEGORIAS ID 
async function getMoviesByCategory(id) {
    window.scrollTo(0, 0)

    const { data } = await api('discover/movie', {
        params: {
            with_genres: id,
        },
    })

    const movies = data.results;
    //console.log({ data, movies }); //revisar datos que traemos

    genericSection.innerHTML = " ";

    createMovies(movies, genericSection);
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
    //console.log({ data, movies }); //revisar datos que traemos

    genericSection.innerHTML = " ";

    createMovies(movies, genericSection);
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

//-------------UTILS-------------

//GENERADOR DE LISTADO DE PELICULAS
function createMovies(movies, container) {
    container.innerHTML = ""; // Limpiar el contenedor

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id
        })

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            'src',
            'https://image.tmdb.org/t/p/w300' + movie.poster_path,
        );

        movieContainer.appendChild(movieImg);
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

