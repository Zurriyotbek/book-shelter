"use strict";

///////////////////////////////////////////////////////////
//////////////////// MAIN PAGE ///////////////////////////
/////////////////////////////////////////////////////////

// selecting html elements

const logoutBtn = document.querySelector(".header__btn");
let elCardList = document.querySelector(".card-list");
let elSearchInput = document.querySelector(".header__search-input");
let totalResults = document.querySelector(".total-results");
const elResults = document.querySelector(".sub-header__result");
const elSortBtn = document.querySelector(".sub-header__btn-sort");
// const localToken = localStorage.getItem("token");

// if (!localToken) {
//     location.replace("login-page.html");
// }

// Listen click event of 'Logout' button and leave main page

logoutBtn.addEventListener("click", function() {
    localStorage.removeItem("token");

    location.replace("login-page.html");
});

/////////// Render books array ////////////

function renderBooks(array, element) {
    // loop an array
    array.forEach((book) => {
        // create card
        let card = document.createElement("div");

        // set attribute
        card.setAttribute("class", "book-card");

        // inner HTML of card
        card.innerHTML = `
        <img class="card__img" src="${
          book.volumeInfo.imageLinks.thumbnail
        }" alt="" />
            <div class="card__body">
                <h2 class="card__title">${book.volumeInfo.title}</h2>
                <p class="card__author">${book.volumeInfo.authors}</p>
                <p class="card__year">${book.volumeInfo.publishedDate.slice(
                  0,
                  4
                )}</p>

                <div class="card__btn-group">
                    <button class="card__bookmark-btn btn btn-warning">
                       Bookmark
                    </button>
                    <button class="card__info-btn btn btn-light">More info</button>
                </div>

                <button class="card__read-btn btn btn-secondary w-100">
                     Read
                 </button>
            </div>

`;

        // append created element to list
        element.appendChild(card);
    });
}

// variable to sort books
let newArrOfBooks = [];

//////////// FETCH BOOKS API //////////
const getBooks = async(value) => {
    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=search+${value}`
        );

        const data = await response.json();

        renderBooks(data.items, elCardList);

        // show total results
        totalResults.textContent = data.totalItems;

        newArrOfBooks.push(...data.items);
        // console.log(data);
    } catch (err) {
        // show error if book is not found
        let elError = document.createElement("p");

        elError.setAttribute("class", "error");

        elError.textContent = "Oops! Book is not found";

        elCardList.append(elError);

        // hide results
        elResults.innerHTML = null;
    }
};

// getBooks();

// add event to Search input
elSearchInput.addEventListener("change", () => {
    getBooks(elSearchInput.value);
});
getBooks("python");

/////////////////////////////////////////////////
//////// adding event to Sort btn //////////////