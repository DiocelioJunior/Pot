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
    
    // Cria a estrutura do perfil
    container.innerHTML = `
        <div class="profile-card" style="background-image: url(${modelo.main_photo});">
            <div class="profile-descp">
                <h2>${modelo.full_name}</h2>
                <h3>${modelo.city}</h3>
                <p>${modelo.username}</p>
            </div>
        </div>
        <div class="info-model">
            <div class="tags"></div>
            <div class="social">
                <a href="${modelo.social_media_links.instagram}"><i class="bi bi-instagram"></i></a>
                <a href="${modelo.social_media_links.facebook}"><i class="bi bi-facebook"></i></a>
                <a href="${modelo.social_media_links.whatsapp}"><i class="bi bi-whatsapp"></i></a>
                <a href="${modelo.social_media_links.tiktok}"><i class="bi bi-tiktok"></i></a>
            </div>
            <div class="about-me">
                <h3>Sobre Mim</h3>
                <p>${modelo.about_me}</p>

                <h3>Minhas Experiências</h3>
                <ul class="experience-list"></ul> <!-- Lista de experiências -->
            </div>

            <div class="gallery">
                <h3>Galeria</h3>
                <div class="gallery-photos"></div> <!-- Aqui entram as fotos -->
            </div>
        </div>
    `;

    // Seleciona a div de tags e adiciona até 3 tags
    const tagsDiv = container.querySelector(".tags");
    if (modelo.tags && modelo.tags.length > 0) {
        tagsDiv.innerHTML = modelo.tags.slice(0, 3)
            .map(tag => `<span class="tag">${tag}</span>`)
            .join("");
    } else {
        tagsDiv.innerHTML = "<p>Sem tags disponíveis</p>";
    }

    // Seleciona a lista de experiências
    const experienceList = container.querySelector(".experience-list");
    if (modelo.experience && Array.isArray(modelo.experience) && modelo.experience.length > 0) {
        modelo.experience.forEach(exp => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${exp.title}</strong><br>
                <span>${exp.description}</span><br>
                <a href="${exp.portfolio}" target="_blank" class="portfolio-link">Ver Portfólio</a>
            `;
            experienceList.appendChild(li);
        });
    } else {
        experienceList.innerHTML = "<p>Sem experiências cadastradas</p>";
    }

    // Adiciona as imagens da galeria
    const galleryDiv = container.querySelector(".gallery-photos");
    if (modelo.gallery_photos && modelo.gallery_photos.length > 0) {
        galleryDiv.innerHTML = modelo.gallery_photos
            .map(photo => `<img src="${photo}" alt="Foto de ${modelo.full_name}" class="gallery-img">`)
            .join("");
    } else {
        galleryDiv.innerHTML = "<p>Sem fotos na galeria</p>";
    }
}


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

function voltarPagina() {
    window.history.back();
}
