document.addEventListener('DOMContentLoaded', () => {

    const API_KEY = '48b3e8cb';
    const BASE_URL = 'https://www.omdbapi.com/';

    const email = 'rty2791@gmail.com';

    const MOVIE_LIST = [
    'Inception', 'The Dark Knight', 'Interstellar', 'The Matrix',
    'Pulp Fiction', 'Fight Club', 'Forrest Gump', 'The Godfather',
    'The Shawshank Redemption', 'Gladiator', 'Titanic', 'Avatar',
    'The Lord of the Rings', 'Harry Potter', 'Star Wars',
    'Jurassic Park', 'The Lion King', 'The Avengers', 'Iron Man',
    'Spider-Man', 'Batman Begins', 'Django Unchained',
    'The Wolf of Wall Street', 'The Departed', 'Goodfellas',
    'The Silence of the Lambs', 'The Fast and the Furious', 'The Prestige',
    'The Social Network', 'The Big Lebowski', 'Fargo',
    'The Revenant', 'Whiplash', 'La La Land', 'The Grand Budapest Hotel',
    'Mad Max: Fury Road', 'The Martian', 'Gravity', 'Arrival',
    'Blade Runner 2049', 'Joker', '1917', 'Parasite',
    'The Irishman', 'Marriage Story', 'Home Alone',
    'Oppenheimer', 'Barbie', 'Killers of the Flower Moon',
    'Everything Everywhere All At Once', 'The Batman', 'Top Gun: Maverick',
    'John Wick: Chapter 4', 'The Creator', 'Napoleon',
    'The Sixth Sense', 'The Green Mile', 'The Usual Suspects',
    'The Game', 'Lost in Translation', 'Eternal Sunshine of the Spotless Mind',
    '2 Fast 2 Furious', 'Reservoir Dogs', 'V for Vendetta', 'Watchmen', '300',
    'Back to the Future', 'The Terminator', 'Terminator 2: Judgment Day',
    'The Shining', 'Taxi Driver', 'Raging Bull', 'Apocalypse Now',
    'Toy Story', 'Finding Nemo', 'The Incredibles', 'Monsters Inc.',
    'Ratatouille', 'WALL-E', 'Up', 'Inside Out', 'Shrek',
    'Kung Fu Panda', 'How to Train Your Dragon', 'The Godfather Part II'
    ];

    const recommend = document.querySelector('.recommend');
    const Golbtn = document.querySelector('.GolBtn');
    const OnBtn = document.querySelector('.OnBtn');
    const scrollBtn = document.querySelector('.top-btn');
    const searchBtn = document.querySelector('.searchBtn');
    const searchInput = document.querySelector('.search-input');
    const errorDisplay = document.querySelector('.error');
    const WelcomeTXT = document.querySelector('.Welcome');

    function getRandomMovies(count = 18) {
        const shuffled = [...MOVIE_LIST].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }


    async function loadMovies() {
        try {
            const randomTitles = getRandomMovies(18);
            
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
            
            document.querySelectorAll('.movie-card').forEach(card => {
                card.addEventListener('click', function() {
                    openMovieModal(JSON.parse(this.dataset.movie));
                });
            });

        } catch (error) {
            recommend.innerHTML = `<p>Помилка: ${error.message}</p>`;
        }
    }
    function openMovieModal(movie) {
        const modal = document.getElementById('movieModal');
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = `
            <div class="movie-modal-layout">
                <div class="movie-modal-poster">
                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
                </div>
                <div class="movie-modal-info">
                    <h2>${movie.Title}</h2>
                    <div class="movie-year">${movie.Year || 'Невідомо'}</div>
                    <div class="movie-rating">⭐ ${movie.imdbRating !== 'N/A' ? movie.imdbRating : 'Немає оцінки'}</div>
                    <div>
                        ${movie.Genre ? movie.Genre.split(', ').map(genre => 
                            `<span class="movie-genre">${genre}</span>`
                        ).join('') : ''}
                    </div>
                    <div class="movie-plot">
                        <strong>Сюжет:</strong>
                        <p>${movie.Plot || 'Опис відсутній'}</p>
                    </div>
                    <div class="movie-detail-item">
                        <strong>Режисер:</strong>
                        <span>${movie.Director || 'Невідомо'}</span>
                    </div>
                    <div class="movie-detail-item">
                        <strong>Актори:</strong>
                        <span>${movie.Actors || 'Невідомо'}</span>
                    </div>
                    <div class="movie-detail-item">
                        <strong>Країна:</strong>
                        <span>${movie.Country || 'Невідомо'}</span>
                    </div>
                    <div class="movie-detail-item">
                        <strong>Мова:</strong>
                        <span>${movie.Language || 'Невідомо'}</span>
                    </div>
                    <div class="movie-detail-item">
                        <strong>Нагороди:</strong>
                        <span>${movie.Awards || 'Немає інформації'}</span>
                    </div>
                    <div class="movie-detail-item">
                        <strong>IMDb ID:</strong>
                        <span>${movie.imdbID || 'Немає'}</span>
                    </div>
                    ${movie.Website && movie.Website !== 'N/A' ? `
                        <div style="margin-top: 20px;">
                            <a href="${movie.Website}" target="_blank" style="color: #ffd700; text-decoration: underline;">
                                🔗 Офіційний сайт
                            </a>
                        </div>
                    ` : ''}
                    ${movie.imdbID ? `
                        <div style="margin-top: 10px;">
                            <a href="https://www.imdb.com/title/${movie.imdbID}/" target="_blank" style="color: #ffd700; text-decoration: underline;">
                                🎬 Дивитись на IMDb
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        modal.querySelector('.close-button').onclick = closeMovieModal;
        modal.onclick = (event) => { if (event.target === modal) closeMovieModal(); };
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMovieModal(); });
    }

    function closeMovieModal() {
        const modal = document.getElementById('movieModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    async function searchMovie(title) {
        try {
            const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}`);
            const movie = await response.json();
            if (movie.Response === 'True') {
                recommend.innerHTML = `
                    <div class="movie-card">
                        <img src="${movie.Poster}" alt="${movie.Title}">
                        <h3 id="h31">${movie.Title}</h3>
                        <p id="p2">Рік: ${movie.Year}</p>
                        <p id="p2">Оцінка: ${movie.imdbRating}</p>
                        </div>
                    `;
            } else {
                recommend.innerHTML = `
                <div class="not-found-container">
                <p class="not-found">Нажаль ваш фільм не було знайдено :(</p>
                <p class="not-found">Спробуйте перефразувати назву або перевірити правильність написання</p>
                </div>`;
            }
        } catch (error) {
            errorDisplay.innerHTML = `<p>Помилка: ${error.message}</p>`;
        }
    }

    Golbtn.addEventListener('click', () => {
       window.location.href = 'index.html';
    });

    OnBtn.addEventListener('click', () => {
        loadMovies();
    });

    loadMovies();

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    searchBtn.addEventListener('click', () => {
        const title = searchInput.value.trim();
        if (title) {
            searchMovie(title);
            WelcomeTXT.classList.add('hidden');
        } else {
            alert('Будь ласка, введіть назву фільму');
            loadMovies();
        }
    });

});
