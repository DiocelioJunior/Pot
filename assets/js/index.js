let modelsData = [];

document.addEventListener("DOMContentLoaded", () => {
    fetch("./data/user.json")
        .then(response => response.json())
        .then(data => {
            modelsData = data.models;
            displayModels(modelsData);
        })
        .catch(error => console.error("Erro ao carregar os modelos:", error));
});

function calculateAge(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function displayModels(models) {
    const modelList = document.getElementById("modelList");
    modelList.innerHTML = "";

    models.forEach(model => {
        const modelCard = document.createElement("div");
        modelCard.classList.add("model-card");
        modelCard.style.backgroundImage = `url(${model.main_photo})`;

        const age = calculateAge(model.birth_date);

        modelCard.innerHTML = `
            <div class="overlay">
                <h5>${model.full_name}, ${age}</h5>
            </div>
        `;

        modelCard.addEventListener("click", () => {
            window.location.href = `profile.html?id=${model.id}`;
        });

        modelList.appendChild(modelCard);
    });
}

function searchModels() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();

    const filteredModels = modelsData.filter(model => {
        return (
            model.full_name.toLowerCase().includes(searchValue) ||
            model.username.toLowerCase().includes(searchValue) ||
            model.city.toLowerCase().includes(searchValue) ||
            model.areas_of_work.toLowerCase().includes(searchValue) ||
            model.tags.some(tag => tag.toLowerCase().includes(searchValue)) // Pesquisa nas tags
        );
    });

    displayModels(filteredModels);
}

function filterByCategory(category) {
    let filteredModels;
    if (category === "todos") {
        filteredModels = modelsData;
    } else {
        filteredModels = modelsData.filter(model => model.category === category);
    }
    displayModels(filteredModels);
}

function applyFilters() {
    let filteredModels = [...modelsData];

    // Gênero
    const gender = document.getElementById("filterGender").value;
    if (gender) {
        filteredModels = filteredModels.filter(model => model.gender === gender);
    }

    // Cidade
    const city = document.getElementById("filterCity").value.toLowerCase();
    if (city) {
        filteredModels = filteredModels.filter(model => model.city.toLowerCase().includes(city));
    }

    // Idiomas
    const languages = document.getElementById("filterLanguages").value.toLowerCase();
    if (languages) {
        filteredModels = filteredModels.filter(model => model.languages.toLowerCase().includes(languages));
    }

    // Tipo de Corpo
    const bodyType = document.getElementById("filterBodyType").value;
    if (bodyType) {
        filteredModels = filteredModels.filter(model => model.body_type === bodyType);
    }

    // Cor dos Olhos
    const eyeColor = document.getElementById("filterEyeColor").value;
    if (eyeColor) {
        filteredModels = filteredModels.filter(model => model.eye_color === eyeColor);
    }

    // Cor do Cabelo
    const hairColor = document.getElementById("filterHairColor").value;
    if (hairColor) {
        filteredModels = filteredModels.filter(model => model.hair_color === hairColor);
    }

    // Tipo de Cabelo
    const hairType = document.getElementById("filterHairType").value;
    if (hairType) {
        filteredModels = filteredModels.filter(model => model.hair_type === hairType);
    }

    // Formato do Rosto
    const faceShape = document.getElementById("filterFaceShape").value;
    if (faceShape) {
        filteredModels = filteredModels.filter(model => model.face_shape === faceShape);
    }

    // Características Marcantes
    const distinctiveFeatures = document.getElementById("filterDistinctiveFeatures").value.toLowerCase();
    if (distinctiveFeatures) {
        filteredModels = filteredModels.filter(model => model.distinctive_features.toLowerCase().includes(distinctiveFeatures));
    }

    // Tatuagens
    const tattoos = document.getElementById("filterTattoos").value;
    if (tattoos) {
        filteredModels = filteredModels.filter(model => model.tattoos === tattoos);
    }

    // Piercings
    const piercings = document.getElementById("filterPiercings").value;
    if (piercings) {
        filteredModels = filteredModels.filter(model => model.piercings === piercings);
    }

    // Categoria
    const category = document.getElementById("filterCategory").value;
    if (category) {
        filteredModels = filteredModels.filter(model => model.category === category);
    }

    // Anos de Experiência
    const experience = document.getElementById("filterExperience").value;
    if (experience) {
        filteredModels = filteredModels.filter(model => model.experience >= experience);
    }

    // Áreas de Atuação
    const areasOfWork = document.getElementById("filterAreasOfWork").value.toLowerCase();
    if (areasOfWork) {
        filteredModels = filteredModels.filter(model => model.areas_of_work.toLowerCase().includes(areasOfWork));
    }

    // Habilidades Extras
    const extraSkills = document.getElementById("filterExtraSkills").value.toLowerCase();
    if (extraSkills) {
        filteredModels = filteredModels.filter(model => model.extra_skills.toLowerCase().includes(extraSkills));
    }

    // Altura (Min)
    const minHeight = document.getElementById("filterMinHeight").value;
    if (minHeight) {
        filteredModels = filteredModels.filter(model => model.height >= minHeight);
    }

    // Altura (Max)
    const maxHeight = document.getElementById("filterMaxHeight").value;
    if (maxHeight) {
        filteredModels = filteredModels.filter(model => model.height <= maxHeight);
    }

    // Peso (Min)
    const minWeight = document.getElementById("filterMinWeight").value;
    if (minWeight) {
        filteredModels = filteredModels.filter(model => model.weight >= minWeight);
    }

    // Peso (Max)
    const maxWeight = document.getElementById("filterMaxWeight").value;
    if (maxWeight) {
        filteredModels = filteredModels.filter(model => model.weight <= maxWeight);
    }

    // Disponibilidade
    const availability = document.getElementById("filterAvailability").value;
    if (availability) {
        filteredModels = filteredModels.filter(model => model.availability === availability);
    }

    // Exibir os modelos filtrados
    displayModels(filteredModels);
}

// Adiciona evento de filtro automático para os campos de filtro
document.querySelectorAll('.filter-container input, .filter-container select').forEach((element) => {
    element.addEventListener('input', applyFilters);
});

// Função para abrir/fechar o filtro ao clicar no botão
function toggleFilters() {
    const filterContainer = document.getElementById('filterContainer');
    if (filterContainer.style.display === 'none' || filterContainer.style.display === '') {
        filterContainer.style.display = 'block';
    } else {
        filterContainer.style.display = 'none';
    }
}

// Adiciona o evento de clique no documento para fechar o filtro ao clicar fora dele
document.addEventListener('click', function(event) {
    const filterContainer = document.getElementById('filterContainer');
    const filterToggleButton = document.querySelector('.filter-btn');

    if (!filterContainer.contains(event.target) && !filterToggleButton.contains(event.target)) {
        if (filterContainer.style.display === 'block') {
            filterContainer.style.display = 'none';
        }
    }
});

// Função para limpar todos os filtros
function clearFilters() {
    document.querySelectorAll('.filter-container input, .filter-container select').forEach((element) => {
        element.value = '';  // Limpa todos os campos
    });

    applyFilters();  // Atualiza a exibição após a limpeza
}
