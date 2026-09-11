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
    const LogBtn = document.querySelector('.LoginBtn');
    const scrollBtn = document.querySelector('.top-btn');
    const searchBtn = document.querySelector('.searchBtn');
    const searchInput = document.querySelector('.search-input');
    const errorDisplay = document.querySelector('.error');
    const WelcomeTXT = document.querySelector('.Welcome');

    const filterBtn = document.querySelector('.filterBtn');
    const filterPanel = document.querySelector('.filterPanel');
    const genreSelect = document.querySelector('.genre-select');
    const yearSelect = document.querySelector('.year-select');
    const sortSelect = document.querySelector('.sort-select');
    const applyFilterBtn = document.querySelector('.applyFilterBtn');
    const resetFilterBtn = document.querySelector('.resetFilterBtn');

    let currentFilters = { genre: '', year: '', sort: 'popularity.desc' };

    function getRandomMovies(count = 18) {
        const shuffled = [...MOVIE_LIST].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    async function fetchGenres() {
        try {
            const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=uk-UA`);
            const data = await response.json();
            if (data.genres) {
                data.genres.forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre.id;
                    option.textContent = genre.name;
                    genreSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Помилка завантаження жанрів:', error);
        }
    }

    function populateYears() {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= 1950; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    }

    function sortMoviesLocal(movies, sortBy) {
        const sorted = [...movies];
        if (sortBy === 'vote_average.desc') {
            sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        } else if (sortBy === 'release_date.desc') {
            sorted.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
        } else if (sortBy === 'release_date.asc') {
            sorted.sort((a, b) => (a.release_date || '').localeCompare(b.release_date || ''));
        } else {
            sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        }
        return sorted;
    }

    function hasActiveFilters() {
        return Boolean(currentFilters.genre || currentFilters.year);
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

    function renderMovieCards(movies) {
        if (!movies || movies.length === 0) {
            recommend.innerHTML = `
                <div class="not-found-container">
                    <p class="not-found">Нажаль фільмів за цим запитом не було знайдено :(</p>
                    <p class="not-found">Спробуйте перефразувати назву або змінити фільтри</p>
                </div>`;
            return;
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
    }

    async function loadMoviesFromBasicList(basicMovies) {
        const details = await Promise.all(basicMovies.map(movie => getMovieDetails(movie.id)));
        return details.filter(Boolean);
    }

    async function loadMovies() {
        try {
            const randomTitles = getRandomMovies(18);
            const basicMovies = (await Promise.all(randomTitles.map(title => searchMovieByTitle(title)))).filter(Boolean);
            const movies = await loadMoviesFromBasicList(basicMovies);
            renderMovieCards(movies);
        } catch (error) {
            recommend.innerHTML = `<p>Помилка: ${error.message}</p>`;
        }
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
        const budget = movie.budget ? `$${movie.budget.toLocaleString()}` : 'Невідомо';
        const revenue = movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'Невідомо';
        const imdbId = movie.imdb_id || 'Немає';
        const homepage = movie.homepage || '';

        modalBody.innerHTML = `
            <div class="movie-modal-layout">
                <div class="movie-modal-poster">
                    <img src="${poster}" alt="${title}">
                </div>
                <div class="movie-modal-info">
                    <button class="bazaneBtn">Додати у бажане</button>
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

    async function searchMovieWithFilters(title, filters) {
        try {
            let url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}&language=uk-UA`;
            if (filters.year) {
                url += `&year=${filters.year}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                renderMovieCards([]);
                return;
            }

            let results = data.results;

            if (filters.genre) {
                results = results.filter(movie =>
                    movie.genre_ids && movie.genre_ids.includes(Number(filters.genre))
                );
            }

            results = sortMoviesLocal(results, filters.sort);
            results = results.slice(0, 12);

            const movies = await loadMoviesFromBasicList(results);
            renderMovieCards(movies);

        } catch (error) {
            errorDisplay.innerHTML = `<p>Помилка: ${error.message}</p>`;
        }
    }

    async function discoverMovies(filters) {
        try {
            let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=uk-UA&sort_by=${filters.sort || 'popularity.desc'}`;
            if (filters.genre) {
                url += `&with_genres=${filters.genre}`;
            }
            if (filters.year) {
                url += `&primary_release_year=${filters.year}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                renderMovieCards([]);
                return;
            }

            const results = data.results.slice(0, 12);
            const movies = await loadMoviesFromBasicList(results);
            renderMovieCards(movies);

        } catch (error) {
            errorDisplay.innerHTML = `<p>Помилка: ${error.message}</p>`;
        }
    }

    function debounce(fn, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    }

    const liveSearch = debounce(() => {
        const title = searchInput.value.trim();

        if (!title) {
            if (hasActiveFilters()) {
                WelcomeTXT.classList.add('hidden');
                discoverMovies(currentFilters);
            } else {
                WelcomeTXT.classList.remove('hidden');
                loadMovies();
            }
            return;
        }

        WelcomeTXT.classList.add('hidden');
        searchMovieWithFilters(title, currentFilters);
    }, 300);

    function performSearch() {
        const title = searchInput.value.trim();

        if (!title && !hasActiveFilters()) {
            alert('Будь ласка, введіть назву фільму або оберіть фільтри');
            loadMovies();
            return;
        }

        WelcomeTXT.classList.add('hidden');

        if (title) {
            searchMovieWithFilters(title, currentFilters);
        } else {
            discoverMovies(currentFilters);
        }
    }

    OnBtn.addEventListener('click', () => {
        loadMovies();
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    searchBtn.addEventListener('click', () => {
        performSearch();
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    searchInput.addEventListener('input', liveSearch);

    filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterPanel.classList.toggle('hidden');
        filterBtn.classList.toggle('active');
    });

    filterPanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    document.addEventListener('click', () => {
        filterPanel.classList.add('hidden');
        filterBtn.classList.remove('active');
    });

    applyFilterBtn.addEventListener('click', () => {
        currentFilters = {
            genre: genreSelect.value,
            year: yearSelect.value,
            sort: sortSelect.value
        };
        filterPanel.classList.add('hidden');
        filterBtn.classList.remove('active');
        performSearch();
    });

    resetFilterBtn.addEventListener('click', () => {
        genreSelect.value = '';
        yearSelect.value = '';
        sortSelect.value = 'popularity.desc';
        currentFilters = { genre: '', year: '', sort: 'popularity.desc' };
        filterPanel.classList.add('hidden');
        filterBtn.classList.remove('active');
        loadMovies();
        WelcomeTXT.classList.remove('hidden');
        searchInput.value = '';
    });

    function updateAuthUI() {
        const user = JSON.parse(localStorage.getItem('logfilms_current') || 'null');
        if (user) {
            GolBtn.style.display = 'inline-block';
            GolBtn.onclick = () => {
                window.location.href = 'bazane.html';
            };
            LogBtn.textContent = 'Вийти (' + user.username + ')';
            LogBtn.onclick = () => {
                localStorage.removeItem('logfilms_current');
                window.location.reload();
            };
        } else {
            GolBtn.style.display = 'none';
            LogBtn.textContent = 'Увійти';
            LogBtn.onclick = () => {
                window.location.href = 'login.html';
            };
        }
    }

    updateAuthUI();
    fetchGenres();
    populateYears();
    loadMovies();
});
