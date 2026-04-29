async function showAlert(type, msg) {
  const a = document.getElementById('adminAlert');
  a.className = 'alert alert-' + type;
  a.textContent = msg;
  a.style.display = 'block';
  setTimeout(() => a.style.display = 'none', 5000);
}

function getAuthHeader(password) {
  const val = btoa('admin:' + password);
  return { 'Authorization': 'Basic ' + val };
}

document.getElementById('verifyAdminBtn').addEventListener('click', async () => {
  const pw = document.getElementById('adminPasswordInput').value.trim();
  if (!pw) return showAlert('warning', 'Introdu parola');

  try {
    const res = await fetch('/admin/verify', { method: 'POST', headers: getAuthHeader(pw) });
    if (res.ok) {
      showAlert('success', 'Parolă corectă — poți folosi acțiunile');
      document.getElementById('adminActions').style.display = 'block';
    } else {
      showAlert('danger', 'Parolă incorectă');
    }
  } catch (err) {
    showAlert('danger', 'Eroare la verificare');
  }
});

document.getElementById('exportBtn').addEventListener('click', async () => {
  const pw = document.getElementById('adminPasswordInput').value.trim();
  if (!pw) return showAlert('warning', 'Introdu parola pentru export');
  try {
    const res = await fetch('/admin/export', { headers: getAuthHeader(pw) });
    if (!res.ok) return showAlert('danger', 'Autentificare eșuată');
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'globalStats.json'; document.body.appendChild(a); a.click(); a.remove();
    showAlert('success', 'Export realizat');
  } catch (err) {
    showAlert('danger', 'Eroare export');
  }
});

document.getElementById('clearBtn').addEventListener('click', async () => {
  if (!confirm('Ești sigur că vrei să ștergi clasamentul global? Această acțiune este ireversibilă.')) return;
  const pw = document.getElementById('adminPasswordInput').value.trim();
  if (!pw) return showAlert('warning', 'Introdu parola pentru a continua');
  try {
    const res = await fetch('/admin/clear', { method: 'POST', headers: getAuthHeader(pw) });
    if (res.ok) {
      showAlert('success', 'Clasamentul a fost șters');
    } else showAlert('danger', 'Autentificare eșuată');
  } catch (err) { showAlert('danger', 'Eroare la ștergere'); }
});

document.getElementById('importBtn').addEventListener('click', async () => {
  const fileEl = document.getElementById('importFile');
  if (!fileEl.files.length) return showAlert('warning', 'Selectează un fișier JSON');
  if (!confirm('Importul va suprascrie clasamentul actual. Continuăm?')) return;
  const pw = document.getElementById('adminPasswordInput').value.trim();
  if (!pw) return showAlert('warning', 'Introdu parola pentru import');
  const form = new FormData();
  form.append('file', fileEl.files[0]);
  try {
    const res = await fetch('/admin/import', { method: 'POST', headers: getAuthHeader(pw), body: form });
    if (res.ok) showAlert('success', 'Import realizat cu succes');
    else showAlert('danger', 'Autentificare eșuată sau fișier invalid');
  } catch (err) { showAlert('danger', 'Eroare la import'); }
});
