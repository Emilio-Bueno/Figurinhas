const dadosAlbumEstadicos = {
    "Especiais": [
        { id: "FWC", name: "FIFA World Cup", flagCode: "un" },
        { id: "CC", name: "Coca-Cola", flagCode: "un" }
    ],
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
let modoRepetidasAtivo = false; 
let selecaoAberta = null;
let nomesFigurinhas = {};
let filtroAtual = 'todas';
let posicaoScrollAnterior = 0; // NOVA MEMÓRIA DE ROLAGEM DA TELA

const stickerView = document.getElementById('sticker-view');
const groupsView = document.getElementById('groups-view');
const bodyEl = document.getElementById('app-body');
const searchContainer = document.getElementById('search-container');
const searchInput = document.getElementById('search-input');
const searchSuggestions = document.getElementById('search-suggestions');
const comparadorView = document.getElementById('comparador-view');

function obterInfoSelecao(id) {
    if (id === 'FWC') return { inicio: 0, fim: 19, total: 20 };
    if (id === 'CC') return { inicio: 1, fim: 14, total: 14 }; 
    return { inicio: 1, fim: 20, total: 20 }; 
}

async function carregarNomesCsv() {
    try {
        const response = await fetch('copa_2026_stickers.csv');
        const data = await response.text();
        const linhas = data.split(/\r?\n/);
        
        for (let i = 1; i < linhas.length; i++) {
            if (linhas[i].trim() === '') continue;
            
            const dadosLinha = linhas[i].split(',');
            if (dadosLinha.length >= 4) {
                const teamCode = dadosLinha[1].trim();
                const number = parseInt(dadosLinha[2].trim());
                const name = dadosLinha.slice(3).join(',').trim();

                let normalizedCode = teamCode;
                if (teamCode === 'SWI') normalizedCode = 'SUI';
                else if (teamCode === 'JAP') normalizedCode = 'JPN';
                else if (teamCode === 'KAS') normalizedCode = 'KSA';

                if (!nomesFigurinhas[normalizedCode]) {
                    nomesFigurinhas[normalizedCode] = {};
                }
                nomesFigurinhas[normalizedCode][number] = name;
            }
        }
    } catch (error) { 
        console.error('Erro ao ler CSV:', error); 
    }
}

function removerAcentos(str) { 
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); 
}

searchInput.addEventListener('input', (e) => {
    const termo = removerAcentos(e.target.value.trim());
    if (termo.length === 0) { searchSuggestions.style.display = 'none'; return; }
    const filtrados = listaTodasSelecoes.filter(c => removerAcentos(c.name).includes(termo) || removerAcentos(c.id).includes(termo));
    searchSuggestions.innerHTML = '';
    if (filtrados.length > 0) {
        filtrados.forEach(c => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `<img class="suggestion-flag" src="https://flagcdn.com/w40/${c.flagCode}.png"><span class="suggestion-name">${c.name}</span>`;
            div.onclick = () => { searchInput.value = ''; searchSuggestions.style.display = 'none'; abrirGradeSelecao(c); };
            searchSuggestions.appendChild(div);
        });
        searchSuggestions.style.display = 'block';
    } else { searchSuggestions.style.display = 'none'; }
});

document.addEventListener('click', (e) => { if (!searchContainer.contains(e.target)) searchSuggestions.style.display = 'none'; });

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

function aplicarFiltro(filtro, reRenderizar = true) {
    filtroAtual = filtro;
    document.getElementById('btn-filtro-todas').classList.toggle('active', filtro === 'todas');
    document.getElementById('btn-filtro-faltantes').classList.toggle('active', filtro === 'faltantes');
    document.getElementById('btn-filtro-repetidas').classList.toggle('active', filtro === 'repetidas');
    if (reRenderizar && selecaoAberta) {
        renderizarGradeFigurinhas(selecaoAberta);
    }
}

function renderizarResumo() {
    let totalNoAlbum = 0, repeatedTotal = 0, totalPossivel = 0;

    listaTodasSelecoes.forEach(c => {
        const info = obterInfoSelecao(c.id);
        totalPossivel += info.total;

        if (progressoAlbum[c.id]) {
            for (let i = info.inicio; i <= info.fim; i++) {
                if (progressoAlbum[c.id][i]) {
                    if (progressoAlbum[c.id][i].owned) {
                        totalNoAlbum++;
                    }
                    repeatedTotal += (progressoAlbum[c.id][i].repeatedCount || 0);
                }
            }
        }
    });

    document.getElementById('stat-total').textContent = totalNoAlbum;
    document.getElementById('stat-missing').textContent = totalPossivel - totalNoAlbum;
    document.getElementById('stat-repeated').textContent = repeatedTotal;

    const percentualGlobal = totalPossivel > 0 ? ((totalNoAlbum / totalPossivel) * 100) : 0;
    document.getElementById('album-progress-fill').style.width = `${percentualGlobal}%`;
    document.getElementById('album-percent-text').textContent = `${percentualGlobal.toFixed(1)}% Concluído`;
}

function renderizarGrupos() {
    groupsView.innerHTML = '';
    groupsView.style.display = 'flex';
    Object.keys(dadosAlbumEstadicos).forEach(group => {
        const groupCard = document.createElement('div');
        groupCard.className = 'group-card';
        groupCard.innerHTML = `<div class="group-title">${group}</div>`;
        dadosAlbumEstadicos[group].forEach(c => {
            let obtidas = 0, repetidas = 0;
            const info = obterInfoSelecao(c.id);

            if (progressoAlbum[c.id]) {
                for (let i = info.inicio; i <= info.fim; i++) {
                    if (progressoAlbum[c.id][i]) {
                        if (progressoAlbum[c.id][i].owned) obtidas++;
                        repetidas += (progressoAlbum[c.id][i].repeatedCount || 0);
                    }
                }
            }

            const percentual = (obtidas / info.total) * 100;
            const barraProgressoHtml = `<div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${percentual}%"></div></div>`;

            let htmlContador = modoRepetidasAtivo 
                ? `<div class="country-progress-repetidas ${repetidas > 0 ? 'tem-repetidas' : ''}">${repetidas}</div>`
                : `<div class="country-progress ${obtidas === info.total ? 'completado' : ''}">${obtidas}/${info.total}</div>`;
                
            const pill = document.createElement('div');
            pill.className = 'country-pill';
            pill.onclick = () => abrirGradeSelecao(c);
            pill.innerHTML = `<img class="country-flag" src="https://flagcdn.com/w40/${c.flagCode}.png"><div class="country-name">${c.name}</div>${htmlContador}${barraProgressoHtml}`;
            groupCard.appendChild(pill);
        });
        groupsView.appendChild(groupCard);
    });
}

function abrirGradeSelecao(country) {
    // SALVA A POSIÇÃO ATUAL DA TELA ANTES DE ABRIR A SELEÇÃO
    posicaoScrollAnterior = window.scrollY || document.documentElement.scrollTop;

    selecaoAberta = country;
    groupsView.style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'none';
    document.querySelectorAll('.modo-selector').forEach(el => el.style.display = 'none'); 
    searchContainer.style.display = 'none'; 
    stickerView.style.display = 'flex';
    
    document.getElementById('sticker-filters').style.display = 'flex';
    aplicarFiltro('todas', false); 

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
    
    const info = obterInfoSelecao(country.id);

    for (let i = info.inicio; i <= info.fim; i++) {
        let isOwned = false;
        let repeatedCount = 0;

        if (progressoAlbum[country.id] && progressoAlbum[country.id][i]) {
            isOwned = progressoAlbum[country.id][i].owned;
            repeatedCount = progressoAlbum[country.id][i].repeatedCount || 0;
        }

        if (filtroAtual === 'faltantes' && isOwned) continue;
        if (filtroAtual === 'repetidas' && repeatedCount === 0) continue;

        let stickerName = '---';
        if (nomesFigurinhas[country.id] && nomesFigurinhas[country.id][i]) {
            stickerName = nomesFigurinhas[country.id][i];
        } else if (country.id === 'CC') {
            stickerName = `Coca-Cola ${i}`;
        }

        const isEspecial = (i === 1 && country.id !== 'FWC' && country.id !== 'CC') || 
                           stickerName.toLowerCase().includes('emblem') || 
                           stickerName.toLowerCase().includes('troféu');

        const displayNum = i === 0 ? '00' : i;
        const div = document.createElement('div');
        div.className = 'sticker';
        
        if (isEspecial) div.classList.add('especial');

        div.innerHTML = `<span class="sticker-code">${country.id}</span><span class="sticker-num">${displayNum}</span><span class="sticker-name">${stickerName}</span><button class="btn-diminuir">-</button>`;
        
        if (isOwned && !modoRepetidasAtivo) div.classList.add('owned');
        if (repeatedCount > 0) {
            div.classList.add('has-repeated');
            div.setAttribute('data-count', repeatedCount);
            div.querySelector('.btn-diminuir').classList.add('visivel');
        }

        div.onclick = (e) => { 
            if (e.target.classList.contains('btn-diminuir')) return;
            if (e.shiftKey && modoRepetidasAtivo) {
                modificarRepetida(country.id, i, -1);
                return;
            }
            alternarStatus(country.id, i); 
        };
        div.querySelector('.btn-diminuir').onclick = (e) => { e.stopPropagation(); modificarRepetida(country.id, i, -1); };
        grid.appendChild(div);
    }
}

function alternarStatus(id, n) {
    if (!progressoAlbum[id]) progressoAlbum[id] = {};
    if (!progressoAlbum[id][n]) progressoAlbum[id][n] = { owned: false, repeatedCount: 0 };
    
    if (modoRepetidasAtivo) {
        if (!progressoAlbum[id][n].owned) {
            alert("Atenção: Você não pode adicionar uma repetida se a figurinha ainda não está colada no seu álbum.");
            return; 
        }
        progressoAlbum[id][n].repeatedCount++;
    } else {
        progressoAlbum[id][n].owned = !progressoAlbum[id][n].owned;
        if (!progressoAlbum[id][n].owned) {
            progressoAlbum[id][n].repeatedCount = 0;
        }
    }
    salvar();
    
    if (selecaoAberta) {
        renderizarGradeFigurinhas(selecaoAberta);
    }
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
    comparadorView.style.display = 'none';
    
    document.getElementById('dashboard-container').style.display = 'flex';
    document.querySelectorAll('.modo-selector').forEach(el => el.style.display = 'flex'); 
    document.getElementById('sticker-filters').style.display = 'none'; 
    searchContainer.style.display = 'flex';
    searchInput.value = '';
    renderizarGrupos();

    // DEVOLVE A TELA PARA A POSIÇÃO ANTERIOR (Com um micro-delay pro navegador não se perder)
    setTimeout(() => {
        window.scrollTo(0, posicaoScrollAnterior);
    }, 10);
}

function exportarArquivoBackup() {
    const dados = localStorage.getItem('stickerCollectorMaxProgress');
    if (!dados || dados === '{}') { alert("Vazio."); return; }
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
            JSON.parse(conteudo);
            localStorage.setItem('stickerCollectorMaxProgress', conteudo);
            progressoAlbum = JSON.parse(conteudo);
            renderizarResumo();
            renderizarGrupos();
            alert("Sucesso!");
        } catch (erro) {
            alert("Erro ao ler o arquivo de backup.");
        }
        event.target.value = '';
    };
    leitor.readAsText(arquivo);
}

function compararComAmigo(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = (e) => {
        try {
            const amigoProgress = JSON.parse(e.target.result);
            gerarRelatorioComparacao(amigoProgress);
        } catch (erro) {
            alert("Erro ao ler o arquivo do amigo.");
        }
        event.target.value = ''; 
    };
    leitor.readAsText(arquivo);
}

function gerarRelatorioComparacao(amigoProgress) {
    let euDou = [];
    let euRecebo = [];

    listaTodasSelecoes.forEach(c => {
        const info = obterInfoSelecao(c.id);
        for (let i = info.inicio; i <= info.fim; i++) {
            const meuS = progressoAlbum[c.id] ? progressoAlbum[c.id][i] : null;
            const amigoS = amigoProgress[c.id] ? amigoProgress[c.id][i] : null;

            const euTenhoRepetida = meuS && meuS.repeatedCount > 0;
            const amigoNaoTem = !amigoS || !amigoS.owned;

            const amigoTemRepetida = amigoS && amigoS.repeatedCount > 0;
            const euNaoTenho = !meuS || !meuS.owned;

            const displayNum = i === 0 ? '00' : i;
            const nomeFigurinha = `${c.id} ${displayNum}`;

            if (euTenhoRepetida && amigoNaoTem) euDou.push(nomeFigurinha);
            if (amigoTemRepetida && euNaoTenho) euRecebo.push(nomeFigurinha);
        }
    });

    exibirTelaComparacao(euDou, euRecebo);
}

function exibirTelaComparacao(euDou, euRecebo) {
    // TAMBÉM SALVA A POSIÇÃO AO ABRIR O COMPARADOR
    posicaoScrollAnterior = window.scrollY || document.documentElement.scrollTop;

    groupsView.style.display = 'none';
    stickerView.style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'none';
    document.querySelectorAll('.modo-selector').forEach(el => el.style.display = 'none');
    document.getElementById('search-container').style.display = 'none';

    let htmlEuDou = euDou.length > 0 ? euDou.join(', ') : 'Nenhuma figurinha';
    let htmlEuRecebo = euRecebo.length > 0 ? euRecebo.join(', ') : 'Nenhuma figurinha';

    comparadorView.innerHTML = `
        <div class="view-header">
            <div class="back-button" onclick="voltar()">←</div>
            <span class="view-title">Resultado da Troca</span>
            <div style="width: 40px;"></div>
        </div>
        <div class="comparador-card" style="border-color: #4caf50;">
            <h3 style="color: #4caf50;">Eu passo para o amigo (${euDou.length}):</h3>
            <p>${htmlEuDou}</p>
        </div>
        <div class="comparador-card" style="margin-top: 15px; border-color: #2196f3;">
            <h3 style="color: #2196f3;">Ele passa para mim (${euRecebo.length}):</h3>
            <p>${htmlEuRecebo}</p>
        </div>
    `;
    comparadorView.style.display = 'flex';
    window.scrollTo(0, 0);
}

function gerarRelatorio() {
    let rel = "*📋 RELATÓRIO 2026*\n\n", faltam = "", reps = "";
    Object.keys(dadosAlbumEstadicos).forEach(g => dadosAlbumEstadicos[g].forEach(c => {
        let fP = [], rP = [];
        const info = obterInfoSelecao(c.id);
        for (let i = info.inicio; i <= info.fim; i++) {
            let s = progressoAlbum[c.id] ? progressoAlbum[c.id][i] : null;
            if (!s || !s.owned) fP.push(i === 0 ? '00' : i);
            if (s && s.repeatedCount > 0) rP.push(`${i === 0 ? '00' : i}(+${s.repeatedCount})`);
        }
        if (fP.length > 0) faltam += `*${c.id}:* ${fP.join(', ')}\n`;
        if (rP.length > 0) reps += `*${c.id}:* ${rP.join(', ')}\n`;
    }));
    rel += "*🔴 FALTAM:*\n" + (faltam || "Nenhuma!\n") + "\n*🔵 REPETIDAS:*\n" + (reps || "Nenhuma!\n");
    navigator.clipboard.writeText(rel).then(() => alert("Copiado!"));
}

async function inicializarApp() {
    await carregarNomesCsv();
    renderizarResumo();
    renderizarGrupos();
}

inicializarApp();