getTrendingMoviesPreview();
getCategoriesList();

//GET -  PELICULAS EN TENDENDIA PARA EL HOME - PREVIEW
async function getTrendingMoviesPreview() {
    const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY)
    const data = await res.json();

    const movies = data.results;
    //console.log({ data, movies }); //revisar datos que traemos

    movies.forEach(movie => {
        const trendingPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList')

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            'src',
            'https://image.tmdb.org/t/p/w300' + movie.poster_path,
        );

        movieContainer.appendChild(movieImg);
        trendingPreviewMoviesContainer.appendChild(movieContainer);
    });
}

//GET - LISTA DE CATEGORIAS
async function getCategoriesList() {
    const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=' + API_KEY + '&language=es')
    const data = await res.json();

    const categories = data.genres;
    console.log({ data, categories }); //revisar datos que traemos

    categories.forEach(category => {

        const categoriesPreview = document.getElementById('categoriesPreview')

        const categoriesPreviewList = document.createElement('article')
        categoriesPreviewList.classList.add('categoriesPreview-list')

        const categoryContainer = document.createElement('div')
        categoryContainer.classList.add('category-container')

        const categoryTitle = document.createElement('h3')
        categoryTitle.classList.add('category-title')
        categoryTitle.setAttribute('id', 'id' + category.id)
        const categoryTitleText = document.createTextNode(category.name)

        categoriesPreview.appendChild(categoriesPreviewList)
        categoriesPreviewList.appendChild(categoryContainer);
        categoryContainer.appendChild(categoryTitle);
        categoryTitle.appendChild(categoryTitleText)

    });
}

