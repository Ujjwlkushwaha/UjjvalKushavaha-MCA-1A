const setup = document.getElementById("setup");
const punchline = document.getElementById("punchline");
const jokeBtn = document.getElementById("jokeBtn");

// Free API, no key needed. Returns { setup: "...", punchline: "..." }
const API_URL = "https://official-joke-api.appspot.com/random_joke";

async function getJoke() {
  setup.textContent = "Loading...";
  punchline.textContent = "";

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    setup.textContent = data.setup;
    punchline.textContent = data.punchline;
  } catch (error) {
    setup.textContent = "Could not load a joke. Check your internet and try again.";
  }
}

jokeBtn.addEventListener("click", getJoke);

// show one joke when the page opens
getJoke();
