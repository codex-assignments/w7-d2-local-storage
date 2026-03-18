"use strict";

const form = document.getElementById("searchForm");
const output = document.getElementById("output");
const input = document.getElementById("search");
const historyArea = document.getElementById("history");

//used by event listener so put pokemon name as parameter to use as search function
async function getPokemon(url, pokemon) {
  try {
    const res = await fetch(url + pokemon);
    if (!res.ok) {
      throw new Error("failed fetch!");
    }

    const pokemonData = await res.json();
    return pokemonData;
    // Could put render instead in fetch function and then main won't need to be async
  } catch (error) {
    console.log(error);
  }
}

function getHistory() {
  const localHistory = localStorage.getItem("history");
  if (!localHistory) {
    return [];
  }
  return JSON.parse(localHistory);
}

function renderHistory(hist) {
  historyArea.textContent = "";
  hist.forEach((searchEntry) => {
    const p = document.createElement("p");
    p.textContent = searchEntry;
    historyArea.appendChild(p);
  });
}

function updateHistory(search) {
  const current = getHistory();
  current.push(search);
  localStorage.setItem("history", JSON.stringify(current));
}

function renderNotFound() {
  output.textContent = "";
  const p = document.createElement("p");
  p.textContent = "Pokemon not found!";
  output.appendChild(p);
}

// functional design, make "pure functions", renders are never pure function, whatever parameters that go in do the same thing every time

function renderPokemon(pokemonData) {
  output.textContent = "";
  const img = document.createElement("img");
  img.classList.add("border");
  img.classList.add("my-5");
  const name = document.createElement("p");
  img.src = pokemonData.sprites.front_default;
  img.alt = pokemonData.name;
  name.textContent = "Name: " + pokemonData.name;

  output.appendChild(img);
  output.appendChild(name);
}

function clearFields() {
  input.value = "";
}

async function main() {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pokemonName = input.value;
    const pokemonData = await getPokemon(
      "https://pokeapi.co/api/v2/pokemon/",
      pokemonName,
    );
    if (!pokemonData) {
      renderNotFound();
      return;
    } else {
      updateHistory(pokemonName);
      renderPokemon(pokemonData);
      clearFields();
      const hist = getHistory();
      renderHistory();
    }
  });
  const hist = getHistory();
  renderHistory(hist);
}

main();
