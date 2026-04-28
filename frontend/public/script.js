// ===== EVENIMENTUL PENTRU SCHIMBAREA TEMEI DAY/NIGHT =====
document.addEventListener('DOMContentLoaded', () => {
    const htmlEl = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');

    themeToggleBtn.addEventListener('click', () => {
        // Redam animatia adaugand clasa CSS si stergand-o dupa completare
        themeIcon.classList.add('rotate-animation');
        setTimeout(() => {
            themeIcon.classList.remove('rotate-animation');
        }, 400);

        // Verificam care e tema setata si comutam
        const currentTheme = htmlEl.getAttribute('data-bs-theme');
        if (currentTheme === 'dark') {
            htmlEl.setAttribute('data-bs-theme', 'light');

            // Schimbam culoarea si iconita pe Day (Soare) la Moon (Luna pt. intoarcere)
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            themeToggleBtn.classList.replace('btn-outline-success', 'btn-outline-dark');
        } else {
            htmlEl.setAttribute('data-bs-theme', 'dark');

            // Schimbam culoarea si iconita la loc pe Night (Luna) la Sun (Soare pt. intoarcere)
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            themeToggleBtn.classList.replace('btn-outline-dark', 'btn-outline-success');
        }
    });
});

// ===== LOGICA FORMULARULUI =====
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const textInput = document.getElementById('textInput');

    const file = fileInput.files[0];
    const text = textInput.value.trim();

    if (!file && !text) {
        alert('Te rog să introduci text sau să selectezi un fișier!');
        return;
    }

    try {
        let response;

        if (file) {
            // Analizăm un fișier .txt
            const formData = new FormData();
            formData.append('textFile', file);

            response = await fetch('/api/analyze-file', {
                method: 'POST',
                body: formData
            });
        } else {
            // Analizăm textul direct din input
            response = await fetch('/api/analyze-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text })
            });
        }

        const result = await response.json();

        if (response.ok) {
            displayHistogram(result.data, result.totalWords, result.timeTakenMs);
        } else {
            alert('Eroare: ' + result.error);
        }
    } catch (error) {
        console.error('A apărut o eroare:', error);
        alert('Eroare la comunicarea cu serverul.');
    }
});

function displayHistogram(data, totalWords, timeTakenMs) {
    const resultsSection = document.getElementById('resultsSection');
    const container = document.getElementById('histogramContainer');

    document.getElementById('totalWordsCount').textContent = totalWords;
    document.getElementById('timeTakenText').textContent = timeTakenMs;

    container.innerHTML = ''; // Curățăm rezultatele anterioare

    if (data.length === 0) {
        container.innerHTML = '<p class="text-muted">Nu au fost găsite cuvinte valide.</p>';
    } else {
        // Găsim cea mai mare frecvență pentru a calcula lățimea barelor relativ
        const maxCount = data[0].count;

        data.forEach(item => {
            const row = document.createElement('div');
            row.className = 'histogram-row';

            const label = document.createElement('div');
            label.className = 'word-label';
            label.textContent = item.word;
            label.title = item.word;

            const barWrapper = document.createElement('div');
            barWrapper.className = 'bar-wrapper';

            const bar = document.createElement('div');
            bar.className = 'bar';
            // Calculam procentul din latimea maxima
            const widthPercentage = Math.max((item.count / maxCount) * 100, 1); // Minim 1%
            bar.style.width = widthPercentage + '%';

            const countLabel = document.createElement('span');
            countLabel.className = 'count-label';
            countLabel.textContent = item.count;

            barWrapper.appendChild(bar);
            barWrapper.appendChild(countLabel);

            row.appendChild(label);
            row.appendChild(barWrapper);
            container.appendChild(row);
        });
    }

    resultsSection.style.display = 'block';
}