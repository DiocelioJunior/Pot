document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");

    if (userId) {
        fetch("./data/user.json")
            .then(response => response.json())
            .then(data => {
                const modelo = data.models.find(m => m.id == userId);
                if (modelo) {
                    exibirPerfil(modelo);
                } else {
                    document.getElementById("profile-container").innerHTML = "<p>Modelo não encontrado.</p>";
                }
            })
            .catch(error => console.error("Erro ao buscar JSON:", error));
    }
});

function exibirPerfil(modelo) {
    const container = document.getElementById("profile-container");

    container.innerHTML = `
        <div class="profile-card" style="background-image: url(${modelo.main_photo});">
            <div class="profile-descp">
                <h2>${modelo.full_name}</h2>
                <h3>${modelo.city}</h3>
                <p>${modelo.username}</p>
                <div class="social">
                    <a href="${modelo.social_media_links.instagram}" target="_blank"><i class="bi bi-instagram"></i></a>
                    <a href="${modelo.social_media_links.facebook}" target="_blank"><i class="bi bi-facebook"></i></a>
                    <a href="${modelo.social_media_links.whatsapp}" target="_blank"><i class="bi bi-whatsapp"></i></a>
                    <a href="${modelo.social_media_links.tiktok}" target="_blank"><i class="bi bi-tiktok"></i></a>
                </div>
            </div>
        </div>
        <div class="info-model">
            <div class="tags"></div>
            <div class="about-me">
                <h3>Sobre Mim</h3>
                <p>${modelo.about_me}</p>
                <h3>Minhas Experiências</h3>
                <ul class="experience-list"></ul>
            </div>
            <div class="gallery">
                <div class="gallery-photos"></div>
            </div>
        </div>

        <!-- Modal para visualizar imagens -->
        <div id="image-modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <img id="modal-image" src="" alt="Imagem Ampliada">
            </div>
        </div>
    `;

    // Adiciona tags
    const tagsDiv = container.querySelector(".tags");
    tagsDiv.innerHTML = modelo.tags?.slice(0, 3)
        .map(tag => `<span class="tag">${tag}</span>`)
        .join("") || "<p>Sem tags disponíveis</p>";

    // Adiciona experiências
    const experienceList = container.querySelector(".experience-list");
    if (modelo.experience?.length > 0) {
        modelo.experience.forEach(exp => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${exp.title}</strong><br>
                <span>${exp.description}</span><br>
                <a href="${exp.portfolio}" target="_blank" class="portfolio-link">Ver mais..</a>
            `;
            experienceList.appendChild(li);
        });
    } else {
        experienceList.innerHTML = "<p>Sem experiências cadastradas</p>";
    }

    // Adiciona imagens da galeria
    const galleryDiv = container.querySelector(".gallery-photos");
    if (modelo.gallery_photos?.length > 0) {
        modelo.gallery_photos.forEach(photo => {
            const img = document.createElement("img");
            img.src = photo;
            img.alt = `Foto de ${modelo.full_name}`;
            img.classList.add("gallery-img");
            galleryDiv.appendChild(img);
        });
    } else {
        galleryDiv.innerHTML = "<p>Sem fotos na galeria</p>";
    }

    // Adiciona funcionalidade de abrir imagens no modal
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("gallery-img")) {
            document.getElementById("modal-image").src = event.target.src;
            document.getElementById("image-modal").style.display = "flex";
        }
    });

    // Fechar modal ao clicar fora da imagem ou no botão "X"
    document.getElementById("image-modal").addEventListener("click", function (event) {
        if (event.target === this || event.target.classList.contains("close")) {
            this.style.display = "none";
        }
    });
}

// Função para calcular idade a partir da data de nascimento
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

// Função para voltar à página anterior
function voltarPagina() {
    window.history.back();
}
