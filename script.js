document.addEventListener('DOMContentLoaded', async () => {
    let quotes = [];
    let currentQuote = null;
    const favorites = JSON.parse(localStorage.getItem('favoriteQuotes') || '[]');

    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const quoteCategory = document.getElementById('quote-category');
    const notification = document.getElementById('notification');
    const favoritesList = document.getElementById('favorites-list');

    function showNotification(message, isError = false) {
        notification.textContent = message;
        notification.className = isError ? 'error-message' : '';
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }

    async function fetchQuotes() {
        try {
            const response = await fetch('quotes.json');
            if (!response.ok) {
                throw new Error('Failed to load quotes');
            }
            quotes = await response.json();
        } catch (error) {
            console.error('Error loading quotes:', error);
            showNotification('Error loading quotes. Please try again later.', true);
            quotes = [];
        }
    }

    async function loadQuote() {
        if (quotes.length === 0) {
            await fetchQuotes();
        }
        
        if (quotes.length > 0) {
            currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
            quoteText.textContent = `"${currentQuote.Quote}"`;
            quoteAuthor.textContent = `- ${currentQuote.Author}`;
            quoteCategory.textContent = `Category: ${currentQuote.Category}`;
        }
    }

    function updateFavoritesList() {
        favoritesList.innerHTML = '';
        favorites.forEach((quote, index) => {
            const quoteElement = document.createElement('div');
            quoteElement.className = 'favorite-quote';
            quoteElement.innerHTML = `
                <p class="favorite-quote-text">"${quote.Quote}"</p>
                <p class="favorite-quote-author">- ${quote.Author}</p>
                <button class="remove-favorite" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            favoritesList.appendChild(quoteElement);
        });

        const favoriteCount = document.querySelector('.favorite-count');
        favoriteCount.textContent = favorites.length;

        document.querySelectorAll('.remove-favorite').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                favorites.splice(index, 1);
                localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
                updateFavoritesList();
                showNotification('Quote removed from favorites!');
            });
        });
    }

    const toggleTheme = document.getElementById('toggle-theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (prefersDarkScheme.matches) {
        document.body.classList.add('dark-mode');
    }

    toggleTheme.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    const toggleFavoritesBtn = document.getElementById('toggle-favorites');
    const favoritesContainer = document.querySelector('.favorites-container');
    
    toggleFavoritesBtn.addEventListener('click', () => {
        const isVisible = favoritesContainer.classList.contains('visible');
        favoritesContainer.classList.toggle('visible');
        toggleFavoritesBtn.classList.toggle('active');
        
        const icon = toggleFavoritesBtn.querySelector('i');
        icon.className = isVisible ? 'fas fa-heart' : 'fas fa-times';
    });

    await loadQuote();
    updateFavoritesList();

    document.getElementById('new-quote').addEventListener('click', loadQuote);

    document.getElementById('copy-quote').addEventListener('click', () => {
        const textToCopy = `${quoteText.textContent} ${quoteAuthor.textContent}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('Quote copied to clipboard!');
        });
    });

    document.getElementById('favorite-quote').addEventListener('click', () => {
        if (!currentQuote) return;

        const quoteExists = favorites.some(q => q.Quote === currentQuote.Quote);
        
        if (quoteExists) {
            showNotification('Quote already in favorites!', true);
            return;
        }

        favorites.push(currentQuote);
        localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
        updateFavoritesList();
        showNotification('Quote added to favorites!');
        
        if (favorites.length === 1) {
            favoritesContainer.classList.add('visible');
            toggleFavoritesBtn.classList.add('active');
            const icon = toggleFavoritesBtn.querySelector('i');
            icon.className = 'fas fa-times';
        }
    });
});