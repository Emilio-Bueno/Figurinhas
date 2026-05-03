const dadosAlbumEstadicos = {
    "Especiais": [{ id: "FWC", name: "FIFA World Cup", flagCode: "un" }],
    "Grupo A": [
        { id: "MEX", name: "México", flagCode: "mx" },
        { id: "RSA", name: "África do Sul", flagCode: "za" },
        { id: "KOR", name: "Coreia do Sul", flagCode: "kr" },
        { id: "CZE", name: "Rep. Tcheca", flagCode: "cz" }
    ],
    "Grupo B": [
        { id: "CAN", name: "Canadá", flagCode: "ca" },
        { id: "BIH", name: "Bósnia", flagCode: "ba" },
        { id: "QAT", name: "Qatar", flagCode: "qa" },
        { id: "SUI", name: "Suíça", flagCode: "ch" }
    ],
    "Grupo C": [
        { id: "BRA", name: "Brasil", flagCode: "br" },
        { id: "MAR", name: "Marrocos", flagCode: "ma" },
        { id: "HAI", name: "Haiti", flagCode: "ht" },
        { id: "SCO", name: "Escócia", flagCode: "gb-sct" }
    ],
    "Grupo D": [
        { id: "USA", name: "EUA", flagCode: "us" },
        { id: "PAR", name: "Paraguai", flagCode: "py" },
        { id: "AUS", name: "Austrália", flagCode: "au" },
        { id: "TUR", name: "Turquia", flagCode: "tr" }
    ],
    "Grupo E": [
        { id: "GER", name: "Alemanha", flagCode: "de" },
        { id: "CUW", name: "Curaçao", flagCode: "cw" },
        { id: "CIV", name: "Costa do Marfim", flagCode: "ci" },
        { id: "ECU", name: "Equador", flagCode: "ec" }
    ],
    "Grupo F": [
        { id: "NED", name: "Holanda", flagCode: "nl" },
        { id: "JPN", name: "Japão", flagCode: "jp" },
        { id: "SWE", name: "Suécia", flagCode: "se" },
        { id: "TUN", name: "Tunísia", flagCode: "tn" }
    ],
    "Grupo G": [
        { id: "BEL", name: "Bélgica", flagCode: "be" },
        { id: "EGY", name: "Egito", flagCode: "eg" },
        { id: "IRN", name: "Irã", flagCode: "ir" },
        { id: "NZL", name: "N. Zelândia", flagCode: "nz" }
    ],
    "Grupo H": [
        { id: "ESP", name: "Espanha", flagCode: "es" },
        { id: "CPV", name: "Cabo Verde", flagCode: "cv" },
        { id: "KSA", name: "Arábia Saudita", flagCode: "sa" },
        { id: "URU", name: "Uruguai", flagCode: "uy" }
    ],
    "Grupo I": [
        { id: "FRA", name: "França", flagCode: "fr" },
        { id: "SEN", name: "Senegal", flagCode: "sn" },
        { id: "IRQ", name: "Iraque", flagCode: "iq" },
        { id: "NOR", name: "Noruega", flagCode: "no" }
    ],
    "Grupo J": [
        { id: "ARG", name: "Argentina", flagCode: "ar" },
        { id: "ALG", name: "Argélia", flagCode: "dz" },
        { id: "AUT", name: "Áustria", flagCode: "at" },
        { id: "JOR", name: "Jordânia", flagCode: "jo" }
    ],
    "Grupo K": [
        { id: "POR", name: "Portugal", flagCode: "pt" },
        { id: "COD", name: "RD Congo", flagCode: "cd" },
        { id: "UZB", name: "Uzbequistão", flagCode: "uz" },
        { id: "COL", name: "Colômbia", flagCode: "co" }
    ],
    "Grupo L": [
        { id: "ENG", name: "Inglaterra", flagCode: "gb-eng" },
        { id: "CRO", name: "Croácia", flagCode: "hr" },
        { id: "GHA", name: "Gana", flagCode: "gh" },
        { id: "PAN", name: "Panamá", flagCode: "pa" }
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
    
    if (!modoRepetidasAtivo) {
        document.getElementById('main-subtitle').textContent = 'Meu álbum de 2026';
        bodyEl.classList.remove('modo-repetidas');
    } else {
        document.getElementById('main-subtitle').textContent = 'Página de Repetidas 🔁';
        bodyEl.classList.add('modo-repetidas');
    }

    renderizarResumo();
    if (stickerView.style.display === 'flex' && selecaoAberta) {
        renderizarGradeFigurinhas(selecaoAberta);
    } else {
        renderizarGrupos();
    }
}

function renderizarResumo() {
    let totalNoAlbum = 0;
    let repeatedTotal = 0;
    let totalPossivel = listaTodasSelecoes.length * figurinhasPorSelecao; 

    Object.keys(progressoAlbum).forEach(paisId => {
        Object.keys(progressoAlbum[paisId]).forEach(stickerNum => {
            const status = progressoAlbum[paisId][stickerNum];
            if (status.owned) totalNoAlbum++;
            if (status.repeatedCount > 0) repeatedTotal += status.repeatedCount;
        });
    });

    document.getElementById('stat-total').textContent = totalNoAlbum;
    document.getElementById('stat-missing').textContent = totalPossivel - totalNoAlbum;
    document.getElementById('stat-repeated').textContent = repeatedTotal;
}

function renderizarGrupos() {
    groupsView.innerHTML = '';
    groupsView.style.display = 'flex';

    Object.keys(dadosAlbumEstadicos).forEach(group => {
        const groupCard = document.createElement('div');
        groupCard.className = 'group-card';
        groupCard.innerHTML = `<div class="group-title">${group}</div>`;
        
        dadosAlbumEstadicos[group].forEach(country => {
            let obtidas = 0;
            let repetidas = 0;
            if (progressoAlbum[country.id]) {
                Object.keys(progressoAlbum[country.id]).forEach(n => {
                    if (progressoAlbum[country.id][n].owned) obtidas++;
                    repetidas += (progressoAlbum[country.id][n].repeatedCount || 0);
                });
            }

            let htmlContador = modoRepetidasAtivo 
                ? `<div class="country-progress-repetidas ${repetidas > 0 ? 'tem-repetidas' : ''}">${repetidas}</div>`
                : `<div class="country-progress ${obtidas === figurinhasPorSelecao ? 'completado' : ''}">${obtidas}/${figurinhasPorSelecao}</div>`;

            const countryPill = document.createElement('div');
            countryPill.className = 'country-pill';
            countryPill.onclick = () => abrirGradeSelecao(country);
            countryPill.innerHTML = `<img class="country-flag" src="https://flagcdn.com/w40/${country.flagCode}.png"><div class="country-name">${country.name}</div>${htmlContador}`;
            groupCard.appendChild(countryPill);
        });
        groupsView.appendChild(groupCard);
    });
}

function abrirGradeSelecao(country) {
    selecaoAberta = country;
    groupsView.style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'none';
    document.querySelector('.modo-selector').style.display = 'none'; 
    stickerView.style.display = 'flex';
    document.getElementById('sticker-view-title').innerHTML = `<img class="country-flag" src="https://flagcdn.com/w40/${country.flagCode}.png"><span>${country.name}</span>`;

    const currentIndex = listaTodasSelecoes.findIndex(c => c.id === country.id);
    document.getElementById('btn-next').style.visibility = (currentIndex === listaTodasSelecoes.length - 1) ? 'hidden' : 'visible';
    
    renderizarGradeFigurinhas(country);
    window.scrollTo(0, 0); 
}

function proximaSelecao() {
    if (!selecaoAberta) return;
    const currentIndex = listaTodasSelecoes.findIndex(c => c.id === selecaoAberta.id);
    if (currentIndex < listaTodasSelecoes.length - 1) abrirGradeSelecao(listaTodasSelecoes[currentIndex + 1]);
}

function renderizarGradeFigurinhas(country) {
    const stickerGrid = document.getElementById('sticker-grid');
    stickerGrid.innerHTML = '';
    
    // REGRA NOVA: Se for FWC, começa no 0 e vai até 19. Senão, 1 a 20.
    const isFWC = country.id === "FWC";
    const numeroInicial = isFWC ? 0 : 1;
    const numeroFinal = isFWC ? 19 : figurinhasPorSelecao;

    for (let i = numeroInicial; i <= numeroFinal; i++) {
        // Formata o número 0 para aparecer como "00" na tela
        const displayNum = (i === 0) ? "00" : i;

        const sticker = document.createElement('div');
        sticker.className = 'sticker';
        sticker.innerHTML = `<span class="sticker-code">${country.id}</span><span class="sticker-num">${displayNum}</span><button class="btn-diminuir" onclick="modificarRepetida('${country.id}', ${i}, -1, event)">-</button>`;
        
        if (progressoAlbum[country.id] && progressoAlbum[country.id][i]) {
            const status = progressoAlbum[country.id][i];
            if (status.owned && !modoRepetidasAtivo) sticker.classList.add('owned');
            if (status.repeatedCount > 0) {
                sticker.classList.add('has-repeated');
                sticker.setAttribute('data-count', status.repeatedCount);
                sticker.querySelector('.btn-diminuir').classList.add('visivel');
            }
        }
        
        sticker.onclick = (e) => { 
            if (e.target.classList.contains('btn-diminuir')) return;
            if (e.shiftKey && modoRepetidasAtivo) {
                modificarRepetida(country.id, i, -1, e);
                return;
            }
            alternarStatus(country.id, i); 
            renderizarGradeFigurinhas(country); 
        };
        stickerGrid.appendChild(sticker);
    }
}

function alternarStatus(countryId, num) {
    if (!progressoAlbum[countryId]) progressoAlbum[countryId] = {};
    if (!progressoAlbum[countryId][num]) progressoAlbum[countryId][num] = { owned: false, repeatedCount: 0 };
    
    if (modoRepetidasAtivo) progressoAlbum[countryId][num].repeatedCount++;
    else progressoAlbum[countryId][num].owned = !progressoAlbum[countryId][num].owned;
    salvar();
}

function modificarRepetida(countryId, num, qtd, event) {
    if (event) event.stopPropagation();
    if (progressoAlbum[countryId] && progressoAlbum[countryId][num]) {
        progressoAlbum[countryId][num].repeatedCount = Math.max(0, (progressoAlbum[countryId][num].repeatedCount || 0) + qtd);
        salvar();
        if (selecaoAberta) renderizarGradeFigurinhas(selecaoAberta);
    }
}

function salvar() {
    localStorage.setItem('stickerCollectorMaxProgress', JSON.stringify(progressoAlbum));
    renderizarResumo();
}

function voltar() {
    selecaoAberta = null;
    stickerView.style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'flex';
    document.querySelector('.modo-selector').style.display = 'flex'; 
    renderizarGrupos();
}

// --- FUNÇÃO DE RELATÓRIO PARA WHATSAPP (ATUALIZADA PARA FWC) ---
function gerarRelatorio() {
    let relatorio = "*📋 MEU RELATÓRIO DE FIGURINHAS (2026)*\n\n";
    let faltamStr = "";
    let repetidasStr = "";

    Object.keys(dadosAlbumEstadicos).forEach(group => {
        dadosAlbumEstadicos[group].forEach(country => {
            let faltamPais = [];
            let repetidasPais = [];

            const isFWC = country.id === "FWC";
            const numeroInicial = isFWC ? 0 : 1;
            const numeroFinal = isFWC ? 19 : figurinhasPorSelecao;

            for (let i = numeroInicial; i <= numeroFinal; i++) {
                const displayNum = (i === 0) ? "00" : i;
                let tem = false;
                let reps = 0;
                
                if (progressoAlbum[country.id] && progressoAlbum[country.id][i]) {
                    tem = progressoAlbum[country.id][i].owned;
                    reps = progressoAlbum[country.id][i].repeatedCount || 0;
                }
                
                if (!tem) faltamPais.push(displayNum);
                if (reps > 0) repetidasPais.push(`${displayNum}(+${reps})`);
            }

            if (faltamPais.length > 0 && faltamPais.length < figurinhasPorSelecao) {
                 faltamStr += `*${country.id}:* ${faltamPais.join(', ')}\n`;
            } else if (faltamPais.length === figurinhasPorSelecao) {
                 faltamStr += `*${country.id}:* Faltam todas\n`;
            }

            if (repetidasPais.length > 0) {
                 repetidasStr += `*${country.id}:* ${repetidasPais.join(', ')}\n`;
            }
        });
    });

    relatorio += "*🔴 FALTAM:*\n" + (faltamStr || "Nenhuma! Álbum completo!\n") + "\n";
    relatorio += "*🔵 REPETIDAS:*\n" + (repetidasStr || "Nenhuma figurinha para trocar.\n");

    navigator.clipboard.writeText(relatorio).then(() => {
        alert("✅ Relatório copiado com sucesso!\n\nCole no seu WhatsApp ou Bloco de Notas.");
    }).catch(err => {
        alert("Erro ao copiar o relatório. Tente novamente.");
    });
}

// Inicialização
renderizarResumo();
renderizarGrupos();