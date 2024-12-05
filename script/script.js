document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    document.body.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = this.href;
    }, 500);
  });
});

window.addEventListener("load", () => {
  document.body.classList.remove("fade-out");
});

let currentPage = 0;
const itemsPerPage = 5;
let rankingData = [];

// Mapeamento de cores para os três primeiros lugares
const positionColors = {
  1: "#ffd700", // Ouro
  2: "#c0c0c0", // Prata
  3: "#cd7f32", // Bronze
};

async function fetchData() {
  try {
    const response = await fetch(
      "https://api-foxevee.server.gabrielpaes.com.br/api/TotalTime/"
    );
    const data = await response.json();

    // Ordena os dados por pontuação (total_time) em ordem decrescente
    rankingData = data.sort((a, b) => b.total_time - a.total_time);

    // Popula os medalhistas
    populateMedals(rankingData.slice(0, 3));

    // Exibe a primeira página
    displayPage(currentPage);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
}

function populateMedals(topThree) {
  const medals = document.querySelector(".medals");

  // Mapear as cores e as posições
  const positions = [
    { className: "gold", position: "1°" },
    { className: "silver", position: "2°" },
    { className: "bronze", position: "3°" },
  ];

  // Atualizar as divs de medalhas
  topThree.forEach((person, index) => {
    const medal = medals.querySelector(`.medal.${positions[index].className}`);
    medal.querySelector("span").textContent = positions[index].position;
    medal.querySelector("p").textContent = person.nome;
  });
}

function displayPage(pageIndex) {
  const start = pageIndex * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = rankingData.slice(start, end);

  const ranking = document.getElementById("ranking");
  ranking.innerHTML = "";

  pageData.forEach((item, index) => {
    const row = document.createElement("tr");

    // Calcula a posição global
    const position = start + index + 1;

    // Aplica a cor se for uma das três primeiras posições
    if (positionColors[position]) {
      row.style.color = positionColors[position];
    }

    Object.entries(item).forEach(([key, value]) => {
      if (key !== "data_cadastro") {
        const cell = document.createElement("td");

        // Exibe a posição como "1°", "2°", etc., no lugar da chave "id"
        cell.textContent = key === "id" ? `${position}°` : value;
        row.appendChild(cell);
      }
    });

    ranking.appendChild(row);
  });

  updateButtons();
}

function updateButtons() {
  const backButton = document.querySelector(".dash .bt:first-child");
  const nextButton = document.querySelector(".dash .bt:last-child");

  backButton.disabled = currentPage === 0;
  nextButton.disabled = (currentPage + 1) * itemsPerPage >= rankingData.length;
}

document
  .querySelector(".dash .bt:first-child")
  .addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      displayPage(currentPage);
    }
  });

document.querySelector(".dash .bt:last-child").addEventListener("click", () => {
  if ((currentPage + 1) * itemsPerPage < rankingData.length) {
    currentPage++;
    displayPage(currentPage);
  }
});

window.addEventListener("DOMContentLoaded", () => {
  fetchData();
});
