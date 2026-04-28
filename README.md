# Analizor de Frecvență a Cuvintelor 📊

O aplicație web modernă pentru analiza frecvenței cuvintelor din texte în limba engleză și română, cu detectare automată a limbii și clasificări globale între utilizatori.

🌐 **Live Demo:** https://texta-t339.onrender.com/

---

## ✨ Funcționalități

- **📤 Încărcare text**: Scrie manual sau încarcă fișiere `.txt` de până la 50MB
- **🌍 Detectare limbă**: Identifică automat dacă textul este în engleză sau română
- **📈 Histogramă interactivă**: Vizualizează frecvența cuvintelor într-un grafic dinamic
- **🎯 Afișare adaptivă**: Arată cuvintele după următoarea logică:
  - **Peste 5000 cuvinte**: 25% (ascunde 75%)
  - **Peste 1000 cuvinte**: 50% (ascunde 50%)
  - **Peste 250 cuvinte**: 75% (ascunde 25%)
  - **Sub 250 cuvinte**: 100% (arată toate)
- **🏆 Top 10 Global**: Clasamentul celor mai frecvente cuvinte din toate textele încărcate (separat pentru EN și RO)
- **🔤 Sortare alfabetică pe egalitate**: Dacă două cuvinte au aceeași frecvență, sunt sortate alfabetic
- **🌓 Tema Dark/Light**: Comută ușor între modurile întunecat și luminos
- **⚡ Performanță**: Timpul de procesare se calculează și se afișează pentru fiecare analiză
- **📊 Statistici detailate**: Numărarea exactă a cuvintelor și microsecundele de procesare

---

## 🛠 Tehnologii Folosite

### Backend
- **Node.js** + **Express.js** - Server web
- **Multer** - Încărcare fișiere
- **LanguageDetect** - Detectare automată a limbii
- **perf_hooks** - Măsurarea performanței

### Frontend
- **HTML5**, **CSS3**, **JavaScript** (vanilla)
- **Bootstrap 5** - Framework CSS responsive
- **FontAwesome** - Icoane
- **Poppins font** - Tipografie modernă

---

## 🚀 Utilizare

### Online
Mergi la https://texta-t339.onrender.com/ și începe analiza!

### Local (dezvoltare)

#### Cerințe
- Node.js 18+
- npm sau yarn

#### Pași de instalare

```bash
# Clonează repository-ul
git clone https://github.com/Swetivs/texta.git
cd texta

# Instalează dependențele în backend
cd backend
npm install

# Pornește serverul (rulează pe http://localhost:3000)
npm run dev     # Mod development cu live reload (nodemon)
# SAU
npm start       # Mod production
```

După pornire, deschide browser-ul la `http://localhost:3000/`.

---

## 📁 Structura Proiectului

```
texta/
├── backend/
│   ├── src/
│   │   ├── server.js          # Server Express și API endpoints
│   │   ├── wordCounter.js     # Logică de numărare cuvinte cu regex avansat
│   │   └── statsManager.js    # Gestiune top 10 global și persistență
│   ├── index.js               # Entrypoint pentru Render
│   ├── globalStats.json       # Stocarea datelor globale (auto-generata)
│   └── package.json           # Dependențe Node
├── frontend/
│   └── public/
│       ├── index.html         # UI responsiv cu Bootstrap 5
│       ├── script.js          # Logică frontend și interacțiuni
│       └── style.css          # Stiluri personalizate
└── README.md                  # Acest fișier
```

---

## 🔧 API Endpoints

### POST `/api/analyze-text`
Analizează text direct din input-ul utilizatorului.

**Request:**
```json
{
  "text": "Salut, acesta este un test..."
}
```

**Response:**
```json
{
  "data": [
    { "word": "test", "count": 4 },
    { "word": "salut", "count": 3 }
  ],
  "totalWords": 17,
  "timeTakenMs": "0.44",
  "detectedLang": "ro"
}
```

### POST `/api/analyze-file`
Analizează un fișier `.txt` încărcat.

**Response:** Identic cu `/api/analyze-text`

### GET `/api/global-stats`
Obține clasamentul top 10 pentru fiecare limbă.

**Response:**
```json
{
  "en": [
    { "word": "very", "count": 3 },
    { "word": "are", "count": 2 }
  ],
  "ro": [
    { "word": "test", "count": 4 },
    { "word": "salut", "count": 3 }
  ]
}
```

---

## ✅ Alte Caracteristici

- **Regex avansat**: Suportă diacritice românești (ă, â, î, ș, ț) și cuvinte cu liniuțe (ex: "nu-i", "gânditor-artist")
- **Stocare persistentă**: Datele globale se salvează în `globalStats.json` pe server
- **Responsiv mobile-first**: Interfața se adaptează perfect la orice ecran
- **Mesaje de feedback**: Alerte colorate care confirmă limba detectată și acțiuni

---

## 🐛 Debugging

Pentru erori sau comportament neașteptat:

1. **Verifică consolă browser-ului** (F12 → Console) pentru erori JavaScript
2. **Verifică terminalul backend** pentru mesaje de eroare Node.js
3. **Asigură-te că fișierul `.txt` e în UTF-8** (nu ANSI)

---

## 📝 Licență

Proiect personal. Liber de folosit pentru scopuri educative.

---

## 👤 Autor

Creat cu ❤️ pentru analiza textelor în limba română și engleză.

---

**Feedback & Sugestii:** Dacă ai idei sau gasesti bug-uri, creează o issue pe GitHub!
