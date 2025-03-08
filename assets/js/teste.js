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

    // Ajusta caso o aniversário ainda não tenha ocorrido no ano atual
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
        modelCard.style.backgroundImage = `url(${model.main_photo})`; // Define a imagem como fundo

        // Calculando a idade do modelo
        const age = calculateAge(model.birth_date);

        modelCard.innerHTML = `
            <div class="overlay">
                <h5>${model.full_name}, ${age}</h5>
            </div>
        `;

        // Adiciona evento de clique para abrir o perfil
        modelCard.addEventListener("click", () => {
            window.location.href = `profile.html?id=${model.id}`; // Redireciona para a página de perfil com o ID do modelo
        });

        modelList.appendChild(modelCard);
    });
}

function searchModels() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    
    const filteredModels = modelsData.filter(model =>
        model.full_name.toLowerCase().includes(searchValue) ||
        model.username.toLowerCase().includes(searchValue)
    );

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

    const gender = document.getElementById("filterGender").value;
    const bodyType = document.getElementById("filterBodyType").value;
    const eyeColor = document.getElementById("filterEyeColor").value;

    if (gender) {
        filteredModels = filteredModels.filter(model => model.gender === gender);
    }
    if (bodyType) {
        filteredModels = filteredModels.filter(model => model.body_type === bodyType);
    }
    if (eyeColor) {
        filteredModels = filteredModels.filter(model => model.eye_color === eyeColor);
    }

    displayModels(filteredModels);
}

function toggleFilters() {
    let filterContainer = document.querySelector(".filter-container");
    if (filterContainer.style.display === "none" || filterContainer.style.display === "") {
        filterContainer.style.display = "block";
    } else {
        filterContainer.style.display = "none";
    }
}
