document.addEventListener('DOMContentLoaded', () => {

    const API_KEY = '48b3e8cb';
    const BASE_URL = 'https://www.omdbapi.com/';

    const MOVIE_LIST = [
        'Inception', 'The Dark Knight', 'Interstellar', 'The Matrix',
        'Pulp Fiction', 'Fight Club', 'Forrest Gump', 'The Godfather',
        'The Shawshank Redemption', 'Gladiator', 'Titanic', 'Avatar',
        'The Lord of the Rings', 'Harry Potter', 'Star Wars',
        'Jurassic Park', 'The Lion King', 'The Avengers', 'Iron Man',
        'Spider-Man', 'Batman Begins', 'Django Unchained',
        'The Wolf of Wall Street', 'The Departed', 'Goodfellas',
        'The Silence of the Lambs', 'Se7en', 'The Prestige',
        'The Social Network', 'The Big Lebowski', 'Fargo',
        'The Revenant', 'Whiplash', 'La La Land', 'The Grand Budapest Hotel',
        'Mad Max', 'Fury Road', 'The Martian', 'Gravity', 'Arrival',
        'Blade Runner 2049', 'Dune', 'Joker',
        '1917', 'Parasite', 'The Irishman', 'Marriage Story'
    ];

    const recommend = document.querySelector('.recommend');
    const Golbtn = document.querySelector('.GolBtn');
    const OnBtn = document.querySelector('.OnBtn');

    function getRandomMovies(count = 6) {
        const shuffled = [...MOVIE_LIST].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    async function loadMovies() {
        try {
            const randomTitles = getRandomMovies(6);
            
            const movies = await Promise.all(
                randomTitles.map(title => 
                    fetch(`${BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}`)
                        .then(res => res.json())
                )
            );

            const validMovies = movies.filter(m => m.Response === 'True');

            recommend.innerHTML = validMovies.map(movie => `
                <div class="movie-card">
                    <img src="${movie.Poster}" alt="${movie.Title}">
                    <h3 id="h31">${movie.Title}</h3>
                    <p id="p2">Рік: ${movie.Year}</p>
                    <p id="p2">Оцінка: ${movie.imdbRating}</p>
                </div>
            `).join('');

        } catch (error) {
            recommend.innerHTML = `<p>Помилка: ${error.message}</p>`;
        }
    }

    Golbtn.addEventListener('click', () => {
       window.location.href = 'index.html';
    });

    OnBtn.addEventListener('click', () => {
        loadMovies();
    });

    loadMovies();

});