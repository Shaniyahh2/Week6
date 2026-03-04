const input = document.getElementById("pokeInput");
const findBtn = document.getElementById("findBtn");
const addBtn = document.getElementById("addBtn");

const display = document.getElementById("pokemonDisplay");
const img = document.getElementById("pokeImg");
const cry = document.getElementById("pokeCry");
const moveDropdowns = document.querySelectorAll(".moveSelect");
const teamDiv = document.getElementById("team");

let cache = {}; 
let currentPokemon = null;

// Fetch Pokémon
async function getPokemon(nameOrId) {
    if (cache[nameOrId]) {
        return cache[nameOrId];
    }

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`);
    if (!response.ok) {
        alert("Pokemon not found!");
        return null;
    }

    const data = await response.json();
    cache[nameOrId] = data;
    return data;
}

// Load Pokémon into UI
function loadPokemon(data) {
    currentPokemon = data;

    img.src = data.sprites.front_default;

    cry.src = data.cries?.latest || data.cries?.legacy || "";

    const moves = data.moves.map(m => m.move.name);

    moveDropdowns.forEach(drop => {
        drop.innerHTML = "";
        moves.forEach(m => {
            const option = document.createElement("option");
            option.value = m;
            option.textContent = m;
            drop.appendChild(option);
        });
    });

    display.classList.remove("hidden");
}

// Add Pokémon to team
function addToTeam() {
    if (!currentPokemon) return;

    const chosenMoves = Array.from(moveDropdowns).map(d => d.value);

    const member = document.createElement("div");
    member.classList.add("team-member");

    member.innerHTML = `
        <h3>${currentPokemon.name}</h3>
        <ul>
            ${chosenMoves.map(m => `<li>${m}</li>`).join("")}
        </ul>
    `;

    teamDiv.appendChild(member);
}

// Event Listeners
findBtn.addEventListener("click", async () => {
    const value = input.value.trim();
    if (!value) return;

    const data = await getPokemon(value);
    if (data) loadPokemon(data);
});

addBtn.addEventListener("click", addToTeam);
