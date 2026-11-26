const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchBtn");
const status = document.getElementById("status");
const table = document.getElementById("resultTable");
const resultBody = document.getElementById("resultBody");

// Free API, no key needed
const API_URL = "http://universities.hipolabs.com/search?country=";

async function searchUniversities() {
  const country = countryInput.value.trim();

  if (country === "") {
    status.textContent = "Please enter a country name.";
    return;
  }

  status.textContent = "Loading...";
  table.style.display = "none";
  resultBody.innerHTML = "";

  try {
    const response = await fetch(API_URL + encodeURIComponent(country));
    const universities = await response.json();

    if (universities.length === 0) {
      status.textContent = "No universities found for \"" + country + "\".";
      return;
    }

    status.textContent = universities.length + " universities found in " + country + ".";
    showUniversities(universities);
  } catch (error) {
    status.textContent = "Something went wrong. Check your internet and try again.";
  }
}

function showUniversities(universities) {
  universities.forEach(function (uni, index) {
    const row = document.createElement("tr");

    // some universities have no state, so show "-" instead of null
    const state = uni["state-province"] || "-";

    // the website is the first link in the web_pages array
    const link = document.createElement("a");
    link.href = uni.web_pages[0];
    link.textContent = uni.web_pages[0];
    link.target = "_blank";

    row.innerHTML =
      "<td>" + (index + 1) + "</td>" +
      "<td></td>" +
      "<td></td>" +
      "<td></td>";

    row.children[1].textContent = uni.name;
    row.children[2].appendChild(link);
    row.children[3].textContent = state;

    resultBody.appendChild(row);
  });

  table.style.display = "table";
}

searchBtn.addEventListener("click", searchUniversities);
countryInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") searchUniversities();
});
