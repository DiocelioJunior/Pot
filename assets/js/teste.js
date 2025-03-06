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

function displayModels(models) {
    const modelList = document.getElementById("modelList");
    modelList.innerHTML = "";

    models.forEach(model => {
        const modelCard = document.createElement("div");
        modelCard.classList.add("model-card");
        modelCard.innerHTML = `
            <img src="${model.main_photo}" alt="${model.full_name}">
            <h5>${model.full_name}</h5>
            <p>${model.short_description}</p>
            <a href="${model.social_media_links.instagram}" target="_blank">Instagram</a>
        `;
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
