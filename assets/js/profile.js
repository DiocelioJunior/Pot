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
        </div>
        </div>
        <div class="info-model">
                    <h1>Teste</h1>
        </div>
    `;
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
