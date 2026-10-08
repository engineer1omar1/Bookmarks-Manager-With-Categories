const bookmarksContainer = document.querySelector(".bookmarks");
const categorySuggestionsDiv = document.querySelector(".category-suggestions div");
const categoryButtons = document.querySelector(".category-buttons div");
const showAll = document.querySelector(".all");

localStorage.removeItem("active-category");

showAll.addEventListener("click", () => {
    displayBookmarks();
    const categoryButtons = document.querySelectorAll(".category-buttons div span");
    categoryButtons.forEach((button) => button.classList.remove("active"));
})

function saveBookmark() {
    const title = document.querySelector(".title").value.trim();
    const url = document.querySelector(".url").value.trim();
    const category = document.querySelector(".category").value.trim();

    if (!title || !url || !category) {
        alert("Please Fill in all Fields");
        return;
    }

    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};

    if (!allBookmarks[category]) allBookmarks[category] = [];

    allBookmarks[category].push({title, url})

    localStorage.setItem("bookmarks", JSON.stringify(allBookmarks));

    document.querySelectorAll("input").forEach((input) => input.value = "");

    displayBookmarks();

    displayCategorySuggestions()

    displayCategoryButton()
}

function displayBookmarks() {

    // Empty The Bookmarks
    bookmarksContainer.innerHTML = "";

    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};

    for (const category in allBookmarks) {

        const categoryBookmarks = allBookmarks[category];

        categoryBookmarks.forEach((bookmark, index) => {

            const bookmarkElement = document.createElement("div");
            bookmarkElement.innerHTML = `
                <div class="cat">${category}</div>
                <div class="link"><a src="${bookmark.url}">${bookmark.title}</a></div>
                <button onclick="deletebookmark('${category}',${index})">Delete</button>
            `
            bookmarksContainer.appendChild(bookmarkElement);

        });
    }
}

function deletebookmark(category, index) {
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    allBookmarks[category].splice(index, 1);

    if (allBookmarks[category].length == 0) delete allBookmarks[category];

    localStorage.setItem("bookmarks", JSON.stringify(allBookmarks));

    if (allBookmarks[category] && localStorage.getItem("active-category")) {
        filterBookmarksByCategory(category);
    } else {
        displayBookmarks();
    }

    displayCategoryButton();
    displayCategorySuggestions();
}

function filterBookmarksByCategory(category) {

    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    const categoryBookmarks = allBookmarks[category];

    // Empty The Bookmarks
    bookmarksContainer.innerHTML = "";

    categoryBookmarks.forEach((bookmark, index) => {

        const bookmarkElement = document.createElement("div");
        bookmarkElement.innerHTML = `
            <span class="number">${index + 1}</span>
            <div class="link"><a src="${bookmark.url}">${bookmark.title}</a></div>
            <button onclick="deletebookmark('${category}',${index})">Delete</button>
        `
        bookmarksContainer.appendChild(bookmarkElement);

    });
}

function displayCategorySuggestions() {
    categorySuggestionsDiv.innerHTML = "";
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    const categoryKes = Object.keys(allBookmarks);
    categoryKes.forEach((category) => {
        const categoryElement = document.createElement("span");
        categoryElement.textContent = category;
        categoryElement.addEventListener("click", () => {
            document.querySelector(".category").value = category
    })
        categorySuggestionsDiv.appendChild(categoryElement)
    })
}

function displayCategoryButton() {
    categoryButtons.innerHTML = "";
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    const categoryKes = Object.keys(allBookmarks);

    categoryKes.forEach((category) => {
        const categoryElement = document.createElement("span");
        categoryElement.textContent = category;

        categoryElement.addEventListener("click", function () {
      filterBookmarksByCategory(category);
      localStorage.setItem("active-category", category);
      // Remove Active Class From All Buttons
      const categoryButtons = document.querySelectorAll(".category-buttons div span");
      categoryButtons.forEach((button) => button.classList.remove("active"));
      // Add Active Class To The Clicked Button
      this.classList.add("active");
      
    });
    
    const catActive = localStorage.getItem("active-category");
    if (catActive === category) categoryElement.classList.add("active");
        categoryButtons.appendChild(categoryElement);
    })
}



displayBookmarks();
displayCategorySuggestions()
displayCategoryButton()