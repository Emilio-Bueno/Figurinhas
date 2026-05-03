const dadosAlbumEstadicos = {
    "Especiais": [{ id: "FWC", name: "FIFA World Cup", flagCode: "un" }],
    "Grupo A": [
        { id: "MEX", name: "México", flagCode: "mx" }, { id: "RSA", name: "África do Sul", flagCode: "za" },
        { id: "KOR", name: "Coreia do Sul", flagCode: "kr" }, { id: "CZE", name: "Rep. Tcheca", flagCode: "cz" }
    ],
    "Grupo B": [
        { id: "CAN", name: "Canadá", flagCode: "ca" }, { id: "BIH", name: "Bósnia", flagCode: "ba" },
        { id: "QAT", name: "Qatar", flagCode: "qa" }, { id: "SUI", name: "Suíça", flagCode: "ch" }
    ],
    "Grupo C": [
        { id: "BRA", name: "Brasil", flagCode: "br" }, { id: "MAR", name: "Marrocos", flagCode: "ma" },
        { id: "HAI", name: "Haiti", flagCode: "ht" }, { id: "SCO", name: "Escócia", flagCode: "gb-sct" }
    ],
    "Grupo D": [
        { id: "USA", name: "EUA", flagCode: "us" }, { id: "PAR", name: "Paraguai", flagCode: "py" },
        { id: "AUS", name: "Austrália", flagCode: "au" }, { id: "TUR", name: "Turquia", flagCode: "tr" }
    ],
    "Grupo E": [
        { id: "GER", name: "Alemanha", flagCode: "de" }, { id: "CUW", name: "Curaçao", flagCode: "cw" },
        { id: "CIV", name: "Costa do Marfim", flagCode: "ci" }, { id: "ECU", name: "Equador", flagCode: "ec" }
    ],
    "Grupo F": [
        { id: "NED", name: "Holanda", flagCode: "nl" }, { id: "JPN", name: "Japão", flagCode: "jp" },
        { id: "SWE", name: "Suécia", flagCode: "se" }, { id: "TUN", name: "Tunísia", flagCode: "tn" }
    ],
    "Grupo G": [
        { id: "BEL", name: "Bélgica", flagCode: "be" }, { id: "EGY", name: "Egito", flagCode: "eg" },
        { id: "IRN", name: "Irã", flagCode: "ir" }, { id: "NZL", name: "N. Zelândia", flagCode: "nz" }
    ],
    "Grupo H": [
        { id: "ESP", name: "Espanha", flagCode: "es" }, { id: "CPV", name: "Cabo Verde", flagCode: "cv" },
        { id: "KSA", name: "Arábia Saudita", flagCode: "sa" }, { id: "URU", name: "Uruguai", flagCode: "uy" }
    ],
    "Grupo I": [
        { id: "FRA", name: "França", flagCode: "fr" }, { id: "SEN", name: "Senegal", flagCode: "sn" },
        { id: "IRQ", name: "Iraque", flagCode: "iq" }, { id: "NOR", name: "Noruega", flagCode: "no" }
    ],
    "Grupo J": [
        { id: "ARG", name: "Argentina", flagCode: "ar" }, { id: "ALG", name: "Argélia", flagCode: "dz" },
        { id: "AUT", name: "Áustria", flagCode: "at" }, { id: "JOR", name: "Jordânia", flagCode: "jo" }
    ],
    "Grupo K": [
        { id: "POR", name: "Portugal", flagCode: "pt" }, { id: "COD", name: "RD Congo", flagCode: "cd" },
        { id: "UZB", name: "Uzbequistão", flagCode: "uz" }, { id: "COL", name: "Colômbia", flagCode: "co" }
    ],
    "Grupo L": [
        { id: "ENG", name: "Inglaterra", flagCode: "gb-eng" }, { id: "CRO", name: "Croácia", flagCode: "hr" },
        { id: "GHA", name: "Gana", flagCode: "gh" }, { id: "PAN", name: "Panamá", flagCode: "pa" }
    ]
};

const listaTodasSelecoes = [];
Object.keys(dadosAlbumEstadicos).forEach(group => {
    dadosAlbumEstadicos[group].forEach(country => { listaTodasSelecoes.push(country); });
});

let progressoAlbum = JSON.parse(localStorage.getItem('stickerCollectorMaxProgress')) || {};
const figurinhasPorSelecao = 20; 
let modoRepetidasAtivo = false; 
let selecaoAberta = null;

const stickerView = document.getElementById('sticker-view');
const groupsView = document.getElementById('groups-view');
const bodyEl = document.getElementById('app-body');

function mudarModo(modo) {
    modoRepetidasAtivo = (modo === 'repetidas');
    document.getElementById('btn-modo-album').classList.toggle('active', !modoRepetidasAtivo);
    document.getElementById('btn-modo-repetidas').classList.toggle('active', modoRepetidasAtivo);
    document.getElementById('main-subtitle').textContent = modoRepetidasAtivo ? 'Página de Repetidas 🔁' : 'Meu álbum de 2026';
    bodyEl.classList.toggle('modo-repetidas', modoRepetidasAtivo);
    renderizarResumo();
    if (stickerView.style.display === 'flex' && selecaoAberta) renderizarGradeFigurinhas(selecaoAberta);
    else renderizarGrupos();
}

function renderizarResumo() {
    let totalNoAlbum = 0, repeatedTotal = 0;
    Object.keys(progressoAlbum).forEach(p => Object.keys(progressoAlbum[p]).forEach(n => {
        if (progressoAlbum[p][n].owned) totalNoAlbum++;
        repeatedTotal += (progressoAlbum[p][n].repeatedCount || 0);
    }));
    document.getElementById('stat-total').textContent = totalNoAlbum;
    document.getElementById('stat-missing').textContent = 980 - totalNoAlbum;
    document.getElementById('stat-repeated').textContent = repeatedTotal;
}

function renderizarGrupos() {
    groupsView.innerHTML = '';
    Object.keys(dadosAlbumEstadicos).forEach(group => {
        const groupCard = document.createElement('div');
        groupCard.className = 'group-card';
        groupCard.innerHTML = `<div class="group-title">${group}</div>`;
        dadosAlbumEstadicos[group].forEach(c => {
            let obtidas = 0, repetidas = 0;
            if (progressoAlbum[c.id]) Object.keys(progressoAlbum[c.id]).forEach(n => {
                if (progressoAlbum[c.id][n].owned) obtidas++;
                repetidas += (progressoAlbum[c.id][n].repeatedCount || 0);
            });
            let htmlContador = modoRepetidasAtivo 
                ? `<div class="country-progress-repetidas ${repetidas > 0 ? 'tem-repetidas' : ''}">${repetidas}</div>`
                : `<div class="country-progress ${obtidas === 20 ? 'completado' : ''}">${obtidas}/20</div>`;
            const pill = document.createElement('div');
            pill.className = 'country-pill';
            pill.onclick = () => abrirGradeSelecao(c);
            pill.innerHTML = `<img class="country-flag" src="https://flagcdn.com/w40/${c.flagCode}.png"><div class="country-name">${c.name}</div>${htmlContador}`;
            groupCard.appendChild(pill);
        });
        groupsView.appendChild(groupCard);
    });
}

function abrirGradeSelecao(country) {
    selecaoAberta = country;
    groupsView.style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'none';
    document.querySelectorAll('.modo-selector').forEach(el => el.style.display = 'none'); 
    stickerView.style.display = 'flex';
    document.getElementById('sticker-view-title').innerHTML = `<img class="country-flag" src="https://flagcdn.com/w40/${country.flagCode}.png"><span>${country.name}</span>`;
    const idx = listaTodasSelecoes.findIndex(c => c.id === country.id);
    document.getElementById('btn-next').style.visibility = (idx === listaTodasSelecoes.length - 1) ? 'hidden' : 'visible';
    renderizarGradeFigurinhas(country);
    window.scrollTo(0, 0); 
}

function proximaSelecao() {
    const idx = listaTodasSelecoes.findIndex(c => c.id === selecaoAberta.id);
    if (idx < listaTodasSelecoes.length - 1) abrirGradeSelecao(listaTodasSelecoes[idx + 1]);
}

function renderizarGradeFigurinhas(country) {
    const grid = document.getElementById('sticker-grid');
    grid.innerHTML = '';
    const isFWC = country.id === "FWC";
    for (let i = (isFWC ? 0 : 1); i <= (isFWC ? 19 : 20); i++) {
        const div = document.createElement('div');
        div.className = 'sticker';
        div.innerHTML = `<span class="sticker-code">${country.id}</span><span class="sticker-num">${i === 0 ? '00' : i}</span><button class="btn-diminuir">-</button>`;
        if (progressoAlbum[country.id] && progressoAlbum[country.id][i]) {
            const s = progressoAlbum[country.id][i];
            if (s.owned && !modoRepetidasAtivo) div.classList.add('owned');
            if (s.repeatedCount > 0) {
                div.classList.add('has-repeated');
                div.setAttribute('data-count', s.repeatedCount);
                div.querySelector('.btn-diminuir').classList.add('visivel');
            }
        }
        div.onclick = (e) => { 
            if (e.target.classList.contains('btn-diminuir')) return;
            if (e.shiftKey && modoRepetidasAtivo) {
                modificarRepetida(country.id, i, -1);
                return;
            }
            alternarStatus(country.id, i); renderizarGradeFigurinhas(country); 
        };
        div.querySelector('.btn-diminuir').onclick = (e) => { e.stopPropagation(); modificarRepetida(country.id, i, -1); };
        grid.appendChild(div);
    }
}

function alternarStatus(id, n) {
    if (!progressoAlbum[id]) progressoAlbum[id] = {};
    if (!progressoAlbum[id][n]) progressoAlbum[id][n] = { owned: false, repeatedCount: 0 };
    if (modoRepetidasAtivo) progressoAlbum[id][n].repeatedCount++;
    else progressoAlbum[id][n].owned = !progressoAlbum[id][n].owned;
    salvar();
}

function modificarRepetida(id, n, q) {
    if (progressoAlbum[id] && progressoAlbum[id][n]) {
        progressoAlbum[id][n].repeatedCount = Math.max(0, (progressoAlbum[id][n].repeatedCount || 0) + q);
        salvar();
        if (selecaoAberta) renderizarGradeFigurinhas(selecaoAberta);
    }
}

function salvar() { localStorage.setItem('stickerCollectorMaxProgress', JSON.stringify(progressoAlbum)); renderizarResumo(); }

function voltar() {
    selecaoAberta = null;
    stickerView.style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'flex';
    document.querySelectorAll('.modo-selector').forEach(el => el.style.display = 'flex'); 
    renderizarGrupos();
}

// --- FUNÇÕES DE BACKUP POR ARQUIVO TXT ---

function exportarArquivoBackup() {
    const dados = localStorage.getItem('stickerCollectorMaxProgress');
    if (!dados || dados === '{}') { alert("Seu álbum está vazio."); return; }
    
    // Transformamos o backup em arquivo de texto plano (.txt)
    const blob = new Blob([dados], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'backup_album_2026.txt';
    link.click();
    URL.revokeObjectURL(url);
}

function importarArquivoBackup(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = (e) => {
        try {
            const conteudo = e.target.result;
            JSON.parse(conteudo); // Testa se o JSON dentro do .txt é válido
            localStorage.setItem('stickerCollectorMaxProgress', conteudo);
            progressoAlbum = JSON.parse(conteudo);
            renderizarResumo();
            renderizarGrupos();
            alert("✅ Backup carregado com sucesso!");
        } catch (erro) { alert("❌ Arquivo inválido. Certifique-se de carregar um arquivo de backup válido."); }
        event.target.value = '';
    };
    leitor.readAsText(arquivo);
}

function gerarRelatorio() {
    let rel = "*📋 RELATÓRIO 2026*\n\n", faltam = "", reps = "";
    Object.keys(dadosAlbumEstadicos).forEach(g => dadosAlbumEstadicos[g].forEach(c => {
        let fP = [], rP = [], isF = c.id === "FWC";
        for (let i = (isF?0:1); i <= (isF?19:20); i++) {
            let s = progressoAlbum[c.id] ? progressoAlbum[c.id][i] : null;
            if (!s || !s.owned) fP.push(i === 0 ? '00' : i);
            if (s && s.repeatedCount > 0) rP.push(`${i === 0 ? '00' : i}(+${s.repeatedCount})`);
        }
        if (fP.length > 0) faltam += `*${c.id}:* ${fP.join(', ')}\n`;
        if (rP.length > 0) reps += `*${c.id}:* ${rP.join(', ')}\n`;
    }));
    rel += "*🔴 FALTAM:*\n" + (faltam || "Nenhuma!\n") + "\n*🔵 REPETIDAS:*\n" + (reps || "Nenhuma!\n");
    navigator.clipboard.writeText(rel).then(() => alert("✅ Relatório copiado com sucesso!"));
}

renderizarResumo();
renderizarGrupos();