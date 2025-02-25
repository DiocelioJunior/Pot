document.addEventListener("DOMContentLoaded", function () {
    let modelosOriginais = []; // 🔹 Armazena os modelos originais

    // 🔹 Busca os dados do JSON
    fetch("./data/user.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar JSON: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            modelosOriginais = data.models; // 🔹 Salva os modelos originais
            preencherCidades(modelosOriginais); // 🔹 Preenche o select de cidades
            mostrarModelos(modelosOriginais); // 🔹 Exibe os modelos ao carregar a página
            adicionarEventosNavbar();
        })
        .catch(error => console.error("Erro ao buscar JSON:", error));

    // 🔹 Algoritmo Fisher-Yates para embaralhar os modelos
    function embaralharArray(array) {
        let novoArray = [...array]; // Faz uma cópia para não modificar o original
        for (let i = novoArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]]; // 🔄 Troca os elementos
        }
        return novoArray;
    }

    // 🔹 Preenche o select de cidades com base nos modelos disponíveis
    function preencherCidades(modelos) {
        const cidadeSelect = document.getElementById("filter-city");
        const cidadesUnicas = [...new Set(modelos.map(modelo => modelo.city))]; // 🔹 Obtém cidades únicas

        cidadesUnicas.forEach(cidade => {
            const option = document.createElement("option");
            option.value = cidade;
            option.textContent = cidade;
            cidadeSelect.appendChild(option);
        });
    }

    // 🔹 Filtra os modelos com base nos inputs
    document.getElementById("filter-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Evita recarregar a página

        const cidadeFiltro = document.getElementById("filter-city").value;
        const generoFiltro = document.getElementById("filter-gender").value;
        const idadeMinFiltro = document.getElementById("filter-min-age").value;
        const idadeMaxFiltro = document.getElementById("filter-max-age").value;

        const modelosFiltrados = modelosOriginais.filter(modelo => {
            const idade = calcularIdade(modelo.birth_date);
            return (
                (cidadeFiltro === "" || modelo.city === cidadeFiltro) &&
                (generoFiltro === "" || modelo.gender === generoFiltro) &&
                (idadeMinFiltro === "" || idade >= parseInt(idadeMinFiltro)) &&
                (idadeMaxFiltro === "" || idade <= parseInt(idadeMaxFiltro))
            );
        });

        mostrarModelos(modelosFiltrados); // 🔹 Exibe os modelos filtrados
        voltarAoTopo(); // 🔹 Volta ao topo após aplicar o filtro
    });

    // 🔹 Exibe os modelos na tela
    function mostrarModelos(modelos) {
        const container = document.getElementById("model-container");

        // 🔹 Embaralha os modelos antes de renderizar
        const modelosEmbaralhados = embaralharArray(modelos);

        if (modelosEmbaralhados.length === 0) {
            container.innerHTML = `<p>Nenhum modelo encontrado.</p>`;
            return;
        }

        container.innerHTML = `<div class="reels-container">
            ${modelosEmbaralhados.map(modelo => `
                <div class="reel" style="background-image: url('${modelo.main_photo}');">
                    <div class="container-top">
                        <div class="header">
                            <a href="./index.html"><h1>Potö</h1></a>
                            <span class="navbar-icon material-symbols-outlined">filter_alt</span>
                        </div>
                    </div>
                    <div class="container-bottom">
                        <div class="description-bottom">
                            <div class="card">
                                <p><span class="material-symbols-outlined">location_on</span> ${modelo.city}</p>
                                <h2>${modelo.full_name}</h2>
                                <p>${modelo.short_description}</p>
                            </div>
                        </div>
                        <div class="icons-bottom">
                            <span class="material-symbols-outlined">chat</span>
                            <div class="likes">
                                <span class="material-symbols-outlined favorite-icon" data-id="${modelo.id}">favorite</span>
                                <p class="likes-count" data-id="${modelo.id}">${modelo.likes || 0}</p>
                            </div>
                            <span class="material-symbols-outlined account-icon" data-id="${modelo.id}">account_circle</span>
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>`;

        aplicarEstilosReels();
        adicionarEventosNavbar();
        adicionarEventosPerfil(); 
        adicionarEventosCurtida();
    }

    // 🔹 Adiciona eventos aos botões do navbar
    function adicionarEventosNavbar() {
        document.querySelectorAll(".navbar-icon").forEach(navbar => {
            navbar.addEventListener("click", function (event) {
                const formFilter = document.getElementById("container-filter");
                formFilter.style.display = "flex";
                event.stopPropagation(); // Impede que o clique no ícone feche o filtro imediatamente
            });
        });

        // 🔹 Fecha o filtro ao clicar fora do container
        document.addEventListener("click", function (event) {
            const formFilter = document.getElementById("container-filter");

            if (formFilter.style.display === "flex" && !formFilter.contains(event.target) && !event.target.classList.contains("navbar-icon")) {
                formFilter.style.display = "none";
            }
        });
    }

    // 🔹 Calcula a idade com base na data de nascimento
    function calcularIdade(dataNascimento) {
        const nascimento = new Date(dataNascimento);
        const hoje = new Date();
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        return idade;
    }

    // 🔹 Aplica os estilos para o efeito de Reels
    function aplicarEstilosReels() {
        const reelsContainer = document.querySelector(".reels-container");
        if (reelsContainer) {
            reelsContainer.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                overflow-y: auto;
                height: 100vh;
                scroll-snap-type: y mandatory;
            `;

            document.querySelectorAll(".reel").forEach(reel => {
                reel.style.cssText += `
                    width: 100%;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    scroll-snap-align: start;
                    box-sizing: border-box;
                `;
            });
        }
    }

    function adicionarEventosCurtida() {
        document.querySelectorAll(".favorite-icon").forEach(icon => {
            icon.addEventListener("click", function () {
                const modeloId = this.getAttribute("data-id");
    
                if (!verificarCurtida(modeloId)) {
                    this.classList.add("liked");
                    registrarCurtida(modeloId);
                    atualizarContadorLikes(modeloId, 1);
                } else {
                    this.classList.remove("liked");
                    removerCurtida(modeloId);
                    atualizarContadorLikes(modeloId, -1);
                }
            });
    
            // Verifica curtida ao carregar a página
            const modeloId = icon.getAttribute("data-id");
            if (verificarCurtida(modeloId)) {
                icon.classList.add("liked");
            }
        });
    }
    

    // 🔹 Volta ao primeiro modelo após aplicar filtros
    function voltarAoTopo() {
        const reelsContainer = document.querySelector(".reels-container");
        if (reelsContainer) {
            reelsContainer.scrollTop = 0;
        }
    }

    function adicionarEventosPerfil() {
        document.querySelectorAll(".account-icon").forEach(icon => {
            icon.addEventListener("click", function () {
                const userId = this.getAttribute("data-id"); // Obtém o ID do modelo
                window.location.href = `profile.html?id=${userId}`; // Redireciona para a página de perfil
            });
        });
    }

    function verificarCurtida(modeloId) {
        const curtidas = JSON.parse(localStorage.getItem("curtidas")) || [];
        return curtidas.includes(modeloId);
    }
    
    function registrarCurtida(modeloId) {
        let curtidas = JSON.parse(localStorage.getItem("curtidas")) || [];
        curtidas.push(modeloId);
        localStorage.setItem("curtidas", JSON.stringify(curtidas));
    }
    
    function removerCurtida(modeloId) {
        let curtidas = JSON.parse(localStorage.getItem("curtidas")) || [];
        curtidas = curtidas.filter(id => id !== modeloId);
        localStorage.setItem("curtidas", JSON.stringify(curtidas));
    }
    
    function atualizarContadorLikes(modeloId, incremento) {
        const likesElement = document.querySelector(`.likes-count[data-id="${modeloId}"]`);
        if (likesElement) {
            let likesAtual = parseInt(likesElement.textContent.replace(" ", "")) || 0;
            likesElement.textContent = `${likesAtual + incremento}`;
        }
    }
    
});
