document.addEventListener('DOMContentLoaded', () => {

    const API_KEY = 'e88ee1c2ce97cb411a92370791add809';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
    const IMAGE_ORIGINAL = 'https://image.tmdb.org/t/p/original';

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
    const GolBtn = document.querySelector('.GolBtn');
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

    async function searchMovieByTitle(title) {
        try {
            const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}&language=uk-UA`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return data.results[0];
            }
            return null;
        } catch (error) {
            console.error('Помилка пошуку:', error);
            return null;
        }
    }

    async function getMovieDetails(movieId) {
        try {
            const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=uk-UA&append_to_response=credits`);
            return await response.json();
        } catch (error) {
            console.error('Помилка отримання деталей:', error);
            return null;
        }
    }

    async function loadMovies() {
        try {
            const randomTitles = getRandomMovies(18);
            const movies = [];

            for (const title of randomTitles) {
                const movie = await searchMovieByTitle(title);
                if (movie) {
                    const details = await getMovieDetails(movie.id);
                    if (details) {
                        movies.push(details);
                    }
                }
            }

            recommend.innerHTML = movies.map(movie => `
                <div class="movie-card" data-movie='${JSON.stringify(movie).replace(/'/g, "&#39;")}'>
                    <img src="${movie.poster_path ? IMAGE_URL + movie.poster_path : 'placeholder.jpg'}" alt="${movie.title || movie.original_title}">
                    <h3 id="h31">${movie.title || movie.original_title}</h3>
                    <p id="p2">Рік: ${movie.release_date ? movie.release_date.split('-')[0] : 'Невідомо'}</p>
                    <p id="p2">Оцінка: ${movie.vote_average ? movie.vote_average.toFixed(1) : 'Немає'}</p>
                </div>
            `).join('');

            document.querySelectorAll('.movie-card').forEach(card => {
                card.addEventListener('click', function() {
                    const movieData = JSON.parse(this.dataset.movie);
                    openMovieModal(movieData);
                });
            });

        } catch (error) {
            recommend.innerHTML = `<p>Помилка: ${error.message}</p>`;
        }
    }

    function openMovieModal(movie) {
        const modal = document.getElementById('movieModal');
        const modalBody = document.getElementById('modalBody');
        
        const poster = movie.poster_path ? IMAGE_ORIGINAL + movie.poster_path : 'placeholder.jpg';
        const title = movie.title || movie.original_title || 'Невідомо';
        const year = movie.release_date ? movie.release_date.split('-')[0] : 'Невідомо';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'Немає оцінки';
        const genres = movie.genres ? movie.genres.map(g => g.name).join(', ') : 'Невідомо';
        const overview = movie.overview || 'Опис відсутній';
        const director = movie.credits && movie.credits.crew ? 
            movie.credits.crew.find(person => person.job === 'Director')?.name || 'Невідомо' : 'Невідомо';
        const actors = movie.credits && movie.credits.cast ? 
            movie.credits.cast.slice(0, 5).map(a => a.name).join(', ') || 'Невідомо' : 'Невідомо';
        const countries = movie.production_countries ? 
            movie.production_countries.map(c => c.name).join(', ') || 'Невідомо' : 'Невідомо';
        const languages = movie.spoken_languages ? 
            movie.spoken_languages.map(l => l.name).join(', ') || 'Невідомо' : 'Невідомо';
        const budget = movie.budget ? `$${movie.budget.toLocaleString()}` : 'Немає інформації';
        const revenue = movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'Немає інформації';
        const imdbId = movie.imdb_id || 'Немає';
        const homepage = movie.homepage || '';

        modalBody.innerHTML = `
            <div class="movie-modal-layout">
                <div class="movie-modal-poster">
                    <img src="${poster}" alt="${title}">
                </div>
                <div class="movie-modal-info">
                    <h2>${title}</h2>
                    <div class="movie-year">${year}</div>
                    <div class="movie-rating">⭐ ${rating}</div>
                    <div>
                        ${movie.genres ? movie.genres.map(genre => 
                            `<span class="movie-genre">${genre.name}</span>`
                        ).join('') : ''}
                    </div>
                    <div class="movie-plot">
                        <strong>Сюжет:</strong>
                        <p>${overview}</p>
                    </div>
                    <div class="movie-detail-item">
                        <strong>Режисер:</strong>
                        <span>${director}</span>
                    </div>
                    <div class="movie-detail-item">
                        <strong>Актори:</strong>
                        <span>${actors}</span>
                    </div>
                    <div class="movie-detail-item">
                        <strong>Країна:</strong>
                        <span>${countries}</span>
                    </div>
                    <div class="movie-detail-item">
                        <strong>Мова:</strong>
                        <span>${languages}</span>
                    </div>
                    <div class="movie-detail-item">
                        <strong>Бюджет:</strong>
                        <span>${budget}</span>
                    </div>
                    <div class="movie-detail-item">
                        <strong>Прибуток:</strong>
                        <span>${revenue}</span>
                    </div>
                    <div class="movie-detail-item">
                        <strong>IMDb ID:</strong>
                        <span>${imdbId}</span>
                    </div>
                    ${homepage ? `
                        <div style="margin-top: 20px;">
                            <a href="${homepage}" target="_blank" style="color: #3c82f8; text-decoration: underline;">
                                Офіційний сайт
                            </a>
                        </div>
                    ` : ''}
                    ${imdbId !== 'Немає' ? `
                        <div style="margin-top: 10px;">
                            <a href="https://www.imdb.com/title/${imdbId}/" target="_blank" style="color: #3c82f8; text-decoration: underline;">
                                Дивитись на IMDb
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
            const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}&language=uk-UA`);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const movies = [];
                for (const movie of data.results.slice(0, 6)) {
                    const details = await getMovieDetails(movie.id);
                    if (details) {
                        movies.push(details);
                    }
                }

                recommend.innerHTML = movies.map(movie => `
                    <div class="movie-card" data-movie='${JSON.stringify(movie).replace(/'/g, "&#39;")}'>
                        <img src="${movie.poster_path ? IMAGE_URL + movie.poster_path : 'https://via.placeholder.com/300x450?text=No+Poster'}" alt="${movie.title || movie.original_title}">
                        <h3 id="h31">${movie.title || movie.original_title}</h3>
                        <p id="p2">Рік: ${movie.release_date ? movie.release_date.split('-')[0] : 'Невідомо'}</p>
                        <p id="p2">Оцінка: ${movie.vote_average ? movie.vote_average.toFixed(1) : 'Немає'}</p>
                    </div>
                `).join('');

                document.querySelectorAll('.movie-card').forEach(card => {
                    card.addEventListener('click', function() {
                        const movieData = JSON.parse(this.dataset.movie);
                        openMovieModal(movieData);
                    });
                });
            } else {
                recommend.innerHTML = `
                    <div class="not-found-container">
                        <p class="not-found">Нажаль фільмів за цим запитом не було знайдено :(</p>
                        <p class="not-found">Спробуйте перефразувати назву або перевірити правильність написання</p>
                    </div>`;
            }
        } catch (error) {
            errorDisplay.innerHTML = `<p>Помилка: ${error.message}</p>`;
        }
    }

    GolBtn.addEventListener('click', () => {
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