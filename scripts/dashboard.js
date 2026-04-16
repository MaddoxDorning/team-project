const searchInput = document.getElementById("search");
const searchResults = document.getElementById("results");
const searchMessage = document.getElementById("searchMessage");

let data = [];

fetch("shortcuts.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    data = json;
    populateFilters();
    displayResults(data);
  });

function renderMessage(msg) {
  searchMessage.innerHTML = `<li>${msg}</li>`;
}

function displayResults(list) {
  searchResults.innerHTML = "";

  for (let i = 0; i < list.length; i++) {
    let item = list[i];

    let div = document.createElement("div");

    div.innerHTML =
      "<p><b>" + item.name + "</b> (" + item.keystroke + ")<br>" +
      item.use + " - " + item.tool + "<br>" +
      "<i>" + item.author + "</i></p>";

    searchResults.appendChild(div);
  }
}
function populateFilters() {
  let toolList = [];
  let authorList = [];

  for (let i = 0; i < data.length; i++) {
    let item = data[i];

    if (toolList.indexOf(item.tool) === -1) {
      toolList.push(item.tool);
    }

    if (authorList.indexOf(item.author) === -1) {
      authorList.push(item.author);
    }
  }

  let toolDropdown = document.getElementById("toolFilter");
  let authorDropdown = document.getElementById("authorFilter");

  for (let i = 0; i < toolList.length; i++) {
    let option = document.createElement("option");
    option.value = toolList[i];
    option.textContent = toolList[i];
    toolDropdown.appendChild(option);
  }

  for (let i = 0; i < authorList.length; i++) {
    let option = document.createElement("option");
    option.value = authorList[i];
    option.textContent = authorList[i];
    authorDropdown.appendChild(option);
  }
}

function applyFilters(e) {
  const query = searchInput.value.trim().toLowerCase();
  const toolValue = document.getElementById("toolFilter").value;
  const authorValue = document.getElementById("authorFilter").value;

  let filtered = [];
  let found = false;

  for (let i = 0; i < data.length; i++) {
    let item = data[i];

    if (
      (
        item.name.toLowerCase().includes(query) ||
        item.keystroke.toLowerCase().includes(query) ||
        item.use.toLowerCase().includes(query) ||
        item.tool.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query)
      ) &&
      (toolValue === "all" || item.tool === toolValue) &&
      (authorValue === "all" || item.author === authorValue)
    ) {
      filtered.push(item);
      found = true;
    }
  }
  if (!query && toolValue === "all" && authorValue === "all") {
    displayResults(data);
  } else if (found) {
    displayResults(filtered);
  } else {
    searchResults.innerHTML = "";
  }
}

searchInput.addEventListener("input", applyFilters);
document.getElementById("toolFilter").addEventListener("change", applyFilters);
document.getElementById("authorFilter").addEventListener("change", applyFilters);
