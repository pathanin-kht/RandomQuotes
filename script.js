document.addEventListener('DOMContentLoaded', () => {
    async function fetchQuotes() {
        try {
            const response = await fetch('quotes.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading quotes:', error);
            return [];
        }
    }

    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const quoteCategory = document.getElementById('quote-category');
    const notification = document.getElementById('notification');

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 2000);
    }

    async function loadQuote() {
        const quotes = await fetchQuotes();
        if (quotes && quotes.length > 0) {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            quoteText.textContent = `"${randomQuote.Quote}"`;
            quoteAuthor.textContent = `- ${randomQuote.Author}`;
            quoteCategory.textContent = `Category: ${randomQuote.Category}`;
        }
    }

    loadQuote();

    document.getElementById('new-quote').addEventListener('click', loadQuote);

    document.getElementById('copy-quote').addEventListener('click', () => {
        const textToCopy = `${quoteText.textContent} ${quoteAuthor.textContent}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('Quote copied to clipboard!');
        });
    });
});

