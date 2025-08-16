const form = document.querySelector('form');
const input = document.querySelector('input');
const resultDiv = document.querySelector('.result');
const toggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;

// Search Functionality
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const word = input.value.trim();
    if (!word) {
        resultDiv.innerHTML = '<p>Please enter a word.</p>';
        return;
    }

    resultDiv.innerHTML = '<p>Searching...</p>';

    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!res.ok) throw new Error('Word not found');
        const data = await res.json();

        const { word: foundWord, phonetics, meanings } = data[0];

        const pronunciation = phonetics.find(p => p.text)?.text || '';
        const audio = phonetics.find(p => p.audio)?.audio || '';
        const meaning = meanings[0];

        resultDiv.innerHTML = `
            <h2>${foundWord}</h2>
            ${pronunciation ? `<p><strong>Pronunciation:</strong> ${pronunciation}</p>` : ''}
            ${audio ? `<audio controls src="${audio}"></audio>` : ''}
            <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
            <p><strong>Definition:</strong> ${meaning.definitions[0].definition}</p>
        `;
    } catch (err) {
        resultDiv.innerHTML = `<p>❌ Could not find the word "${word}". Try another one.</p>`;
    }
});

// Theme Toggle
toggleBtn.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    toggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});
