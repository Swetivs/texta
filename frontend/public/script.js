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

    // Apel initial pentru a popula topurile de-ndata ce intra userul pe pagina
    fetchGlobalStats();

    // Admin button: cere parola si incerca un verify, apoi redirectioneaza daca ok
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', async () => {
            const pw = prompt('Introdu parola admin:');
            if (!pw) return;
            try {
                const auth = 'Basic ' + btoa('admin:' + pw);
                const res = await fetch('/admin/verify', { method: 'POST', headers: { 'Authorization': auth } });
                if (res.ok) {
                    // redirect to admin page
                    window.location.href = '/admin.html';
                } else {
                    alert('Parolă incorectă');
                }
            } catch (e) {
                alert('Eroare la verificare');
            }
        });
    }
});

// ===== FETCH TOP 10 GLOBAL =====
async function fetchGlobalStats() {
    try {
        const response = await fetch('/api/global-stats');
        const data = await response.json();

        populateTopList("topEnList", data.en);
        populateTopList("topRoList", data.ro);
    } catch (err) {
        console.error("Eroare la aducerea topurilor.", err);
    }
}

function populateTopList(elementId, items) {
    const list = document.getElementById(elementId);
    list.innerHTML = '';
    if (!items || items.length === 0) {
        list.innerHTML = `<li class="list-group-item bg-transparent border-0 text-muted">Momentan gol.</li>`;
        return;
    }

    items.forEach(item => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-start bg-transparent border-bottom border-secondary border-opacity-25";
        li.innerHTML = `
        <div class="ms-2 me-auto">
        <div class="fw-bold">${item.word}</div>
        </div>
        <span class="badge bg-success rounded-pill">${item.count}</span>
    `;
        list.appendChild(li);
    });
}

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
            displayHistogram(result.data, result.totalWords, result.timeTakenMs, result.detectedLang);
            fetchGlobalStats(); // Update top in background
        } else {
            alert('Eroare: ' + result.error);
        }
    } catch (error) {
        console.error('A apărut o eroare:', error);
        alert('Eroare la comunicarea cu serverul.');
    }
});

function displayHistogram(data, totalWords, timeTakenMs, detectedLang) {
    const resultsSection = document.getElementById('resultsSection');
    const container = document.getElementById('histogramContainer');
    const alertBox = document.getElementById("detectedLangAlert");
    const msgBox = document.getElementById("detectedLangMsg");

    document.getElementById('totalWordsCount').textContent = totalWords;
    document.getElementById('timeTakenText').textContent = timeTakenMs;

    // Setam mesajul si vizibilitatea pentru limba
    if (detectedLang === 'ro') {
        msgBox.innerHTML = `<strong>A fost detectată limba: Română</strong>. S-a adăugat la topul RO.`;
        alertBox.style.display = "flex";
        alertBox.className = "alert alert-success d-flex align-items-center mb-3 mt-3";
    } else if (detectedLang === 'en') {
        msgBox.innerHTML = `<strong>A fost detectată limba: Engleză</strong>. S-a adăugat la topul EN.`;
        alertBox.style.display = "flex";
        alertBox.className = "alert alert-info d-flex align-items-center mb-3 mt-3";
    } else {
        msgBox.innerHTML = `<strong>Limbă Neidentificată</strong>. Nu s-a adunat în rezultatele globale.`;
        alertBox.style.display = "flex";
        alertBox.className = "alert alert-secondary d-flex align-items-center mb-3 mt-3";
    }

    container.innerHTML = ''; // Curățăm rezultatele anterioare

    if (data.length === 0) {
        container.innerHTML = '<p class="text-muted">Nu au fost găsite cuvinte valide.</p>';
    } else {
        // Găsim cea mai mare frecvență pentru a calcula lățimea barelor relativ
        const maxCount = data[0].count;

        // Determinam procentul de afisare in functie de numarul total de cuvinte
        let displayPercentage;
        if (totalWords > 5000) {
            displayPercentage = 0.25; // arată 25%
        } else if (totalWords > 1000) {
            displayPercentage = 0.50; // arată 50%
        } else if (totalWords > 250) {
            displayPercentage = 0.75; // arată 75%
        } else {
            displayPercentage = 1.0; // arată toate
        }

        // Calculăm indexul de tăiere pe baza procentului determinat mai sus
        const cutoffIndex = Math.ceil(data.length * displayPercentage);

        data.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'histogram-row';

            // Dacă e în restul de 75%, adăugăm o clasă pentru a o ascunde inițial
            if (index >= cutoffIndex) {
                row.classList.add('hidden-row');
                row.style.display = 'none';
            }

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

        // Adăugăm butonul de comutare dacă există rânduri ascunse (cel puțin un cuvânt cade în jumătatea a doua)
        if (data.length > cutoffIndex) {
            const toggleButtonContainer = document.createElement('div');
            toggleButtonContainer.className = 'text-center mt-4';

            const toggleButton = document.createElement('button');
            toggleButton.className = 'btn btn-outline-secondary px-4 py-2 fw-bold';
            toggleButton.innerHTML = '<i class="fas fa-chevron-down me-2"></i> Afișează toate cuvintele';

            let isHidden = true;

            toggleButton.addEventListener('click', () => {
                const hiddenRows = document.querySelectorAll('.hidden-row');

                if (isHidden) {
                    hiddenRows.forEach(row => { row.style.display = 'flex'; });
                    toggleButton.innerHTML = '<i class="fas fa-chevron-up me-2"></i> Ascunde 75% din rezultate (mai puțin folosite)';
                } else {
                    hiddenRows.forEach(row => { row.style.display = 'none'; });
                    toggleButton.innerHTML = '<i class="fas fa-chevron-down me-2"></i> Afișează toate cuvintele';
                }

                isHidden = !isHidden;
            });

            toggleButtonContainer.appendChild(toggleButton);
            container.appendChild(toggleButtonContainer);
        }
    }

    resultsSection.style.display = 'block';
}