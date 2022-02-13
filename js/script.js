"use strict";

///////////////////////////////////////////////////////////
//////////////////// MAIN PAGE ///////////////////////////
/////////////////////////////////////////////////////////

// API

let API_LINK = `https://www.googleapis.com/books/v1/volumes?q=search+`;

// selecting html elements

const logoutBtn = document.querySelector(".header__btn");
let elCardList = document.querySelector(".card-list");
let elSearchInput = document.querySelector(".header__search-input");
let totalResults = document.querySelector(".total-results");
const elResults = document.querySelector(".sub-header__result");
const elSortBtn = document.querySelector(".sub-header__btn-sort");
// let elBookmarkBtn = document.querySelectorAll(".card__bookmark-btn");
const localToken = localStorage.getItem("token");

if (!localToken) {
    location.replace("login-page.html");
}

// Listen click event of 'Logout' button and leave main page

logoutBtn.addEventListener("click", function() {
    localStorage.removeItem("token");

    location.replace("login-page.html");
});

/////////// Render books array ////////////
let elMain = document.querySelector(".main");

function renderBooks(array, element) {
    element.innerHTML = null;

    try {
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
                <button id="${
                  book.id
                }" class="card__bookmark-btn btn btn-warning">
                       Bookmark
                    </button>
                    <button id="${
                      book.id
                    }" class="card__info-btn btn btn-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                    More info
                  </button>
                    
                </div>

                <a class="card__read-btn btn btn-secondary w-100" target="_blank"
                href="${book.volumeInfo.previewLink}">Read</a>
            </div>

`;

            // append created element to list
            element.appendChild(card);

            console.log(book);
        });
    } catch (err) {
        console.log(err.message);
    }
}

let allBooks = [];

/////////////////////////////////////
// Canvas
//////////////////////////////////////
let canvasHeader = document.querySelector(".canvas-header");
let canvasImg = document.querySelector(".canvas-img");
let canvasText = document.querySelector(".canvas-text");
let canvasAuthorRes = document.querySelector(".author-result");
let canvasPulished = document.querySelector(".published-result");
let canvasPublishers = document.querySelector(".publishers-result");
let canvasCategories = document.querySelector(".categories-result");
let canvasPages = document.querySelector(".pages-result");

elCardList.addEventListener("click", (evt) => {
    let targetBtn = evt.target.matches(".card__info-btn");
    let targetElement = evt.target;

    if (targetBtn) {
        allBooks.find((item) => {
            if (item.id == targetElement.id) {
                canvasHeader.textContent = item.volumeInfo.title;
                canvasImg.src = `${item.volumeInfo.imageLinks.thumbnail}`;
                canvasText.textContent = item.volumeInfo.description;
                canvasAuthorRes.textContent = item.volumeInfo.authors;
                canvasPulished.textContent = item.volumeInfo.publishedDate.slice(0, 4);
                canvasPublishers.textContent = item.volumeInfo.publisher;
                canvasCategories.textContent = item.volumeInfo.categories;
                canvasPages.textContent = item.volumeInfo.pageCount;
            }
        });
    }
});

////////////////////////////////////
// Create pages ///////////////////
//////////////////////////////////
const elPaginationList = document.querySelector(".pagination-list");
let prevBtn = document.querySelector(".prev-btn");
let nextBtn = document.querySelector(".next-btn");
let currPage = 1;

///////// previous button /////////
prevBtn.addEventListener("click", () => {
    pageStartIndex = pageStartIndex - 10;
    currPage = pageStartIndex / 10;
    getBooks();
});

////////// next button ///////////
nextBtn.addEventListener("click", () => {
    pageStartIndex += 10;
    currPage = pageStartIndex * 10;
    getBooks();
});

////////// Current page ///////////////
elPaginationList.innerHTML = null;
elPaginationList.addEventListener("click", (evt) => {
    pageStartIndex = evt.target.textContent * 10;

    getBooks();
});

//////////// FETCH BOOKS API //////////
//////////////////////////////////////
let sort = "relevance";
let pageStartIndex = 1;
const getBooks = async() => {
    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=search+${elSearchInput.value}&orderBy=${sort}&startIndex=${pageStartIndex}`
        );

        const data = await response.json();

        // push all books to one array
        allBooks = [];
        data.items.forEach((item) => {
            allBooks.push(item);
        });

        ////// PAGINATION ///////

        let totalPages = Math.ceil(data.totalItems / 10);

        elPaginationList.innerHTML = null;

        pageStartIndex === 1 ?
            (prevBtn.disabled = true) :
            (prevBtn.disabled = false);

        for (let i = 0; i <= totalPages; i++) {
            let html = ` 
          <li class="page-item page-link">${i}</li> 
    `;

            elPaginationList.insertAdjacentHTML("beforeend", html);
        }

        // render books array
        if (data.totalItems >= 1) {
            renderBooks(data.items, elCardList);
        }

        // show error if book isn't found
        if (data.totalItems <= 0) {
            // hide results
            elResults.innerHTML = null;

            // clean list
            elCardList.innerHTML = null;
            elPaginationList.innerHTML = null;

            // show error if book is not found
            let elError = document.createElement("p");

            elError.setAttribute("class", "error");

            elError.textContent = "Oops! Book is not found";

            elCardList.appendChild(elError);
        }

        // show total results
        totalResults.textContent = data.totalItems;
    } catch (err) {
        // show error if book is not found

        // clean list
        elCardList.innerHTML = null;
        elPaginationList.innerHTML = null;

        let elError = document.createElement("p");

        elError.setAttribute("class", "error");

        elError.textContent = "Oops! Book is not found";

        elCardList.appendChild(elError);

        // hide results
        elResults.innerHTML = null;

        console.log(err.message);
    }
};

// add event to Search input
elSearchInput.addEventListener("change", () => {
    elSearchInput.value = elSearchInput.value.replaceAll(" ", "+");
    pageStartIndex = 0;
    getBooks();
});

/////////// temporary input value
elSearchInput.value = "python";
getBooks();

/////////////////////////////////////////////////
//////// adding event to Sort btn //////////////
elSortBtn.addEventListener("click", () => {
    sort = "newest";
    pageStartIndex = 0;
    getBooks();
});

//////////////////////////////////////////////////////////////
///////// adding Bookmark event to 'bookmark' button ////////
////////////////////////////////////////////////////////////

const elBookmarkList = document.querySelector(".bookmarks__list");
// elBookmarkList.innerHTML = null;
// let localBookmarkList = [...JSON.parse(window.localStorage.getItem("books"))];
let bookmarkList = JSON.parse(window.localStorage.getItem("books")) || [];

// console.log(localBookmarkList);
renderBookmarks(bookmarkList, elBookmarkList);

///////// render bookmarks /////////
///////////////////////////////////
function renderBookmarks(arr, element) {
    element.innerHTML = null;

    arr.forEach((book) => {
        // create item
        let bookmarkItem = document.createElement("div");

        // set attribute
        bookmarkItem.setAttribute("class", "bookmarks__item");

        // inner HTML
        bookmarkItem.innerHTML = `  
        <div class="bookmarks__left">
            <h4 class="bookmarks__book-name">${book.volumeInfo.title}</h4>
            <p class="bookmarks__book-author">${book.volumeInfo.authors}</p>
        </div>
        <div class="bookmarks__right">
            <a class="bookmarks__book-open" target="_blank" href="${book.volumeInfo.previewLink}">
               <img class="bookmarks__book-open-img" src="/images/book-open.svg" alt="" />
            </a>
            
            <button class="bookmarks__book-delete">
               <img id="${book.id}" class="bookmarks__book-delete-img" src="/images/delete.svg" alt="" />
            </button>
            
        </div> `;

        // append

        element.appendChild(bookmarkItem);
    });
}

elCardList.addEventListener("click", function(evt) {
    let clickedBtn = evt.target.matches(".card__bookmark-btn");
    let clickedBtnId = evt.target.id;

    if (clickedBtn) {
        allBooks.find((book) => {
            if (book.id === clickedBtnId && !bookmarkList.includes(book)) {
                bookmarkList.push(book);

                window.localStorage.setItem("books", JSON.stringify(bookmarkList));

                renderBookmarks(bookmarkList, elBookmarkList);
            }
        });
    }
});

/////////////////////////////////////////////////
//////////Remove book from bookmark list //////
//////////////////////////////////////////////

elBookmarkList.addEventListener("click", (evt) => {
    let clickedBtn = evt.target.matches(".bookmarks__book-delete-img");

    let clickedBtnId = evt.target.id;

    if (clickedBtn) {
        bookmarkList.find((book) => {
            if (book.id === clickedBtnId && bookmarkList.includes(book)) {
                bookmarkList.splice(book);

                window.localStorage.setItem("books", JSON.stringify(bookmarkList));

                renderBookmarks(bookmarkList, elBookmarkList);
            }
        });
    }
});

/////////////////////////
/////////////////////////////////////////////////
//////////////////////////////////////////////
// const getMovies = async function () {
//     const response = await fetch(
//       `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}&page=${page}`
//     );

//     const data = await response.json();

//     if (data.Response === "True" && data.Search.length > 0) {
//       renderMovies(data.Search, elList);
//     }

//     page === 1 ? (elPrevBtn.disabled = true) : (elPrevBtn.disabled = false);

//     const totalPageResult = Math.ceil(data.totalResults / 10);

//     page === totalPageResult
//       ? (elNextBtn.disabled = true)
//       : (elNextBtn.disabled = false);

//     elPaginationList.innerHTML = null;

//     for (let i = 1; i <= totalPageResult; i++) {
//       let htmlLi = `
//         <li class="page-item page-link">${i}</li>
//       `;

//       if (page == i) {
//         htmlLi = `
//         <li class="page-item page-link activejon">${i}</li>
//       `;
//       } else {
//         htmlLi = `
//         <li class="page-item page-link">${i}</li>
//       `;
//       }

//       elPaginationList.insertAdjacentHTML("beforeend", htmlLi);
//     }
// };

// getMovies();

//   input.addEventListener("change", function (evt) {
//     search = input.value;
//     page = 1;
//     getMovies();
//   });

//   elPrevBtn.addEventListener("click", () => {
//     page--;
//     getMovies();
//   });

//   elNextBtn.addEventListener("click", () => {
//     page++;
//     getMovies();
//   });

//   elPaginationList.addEventListener("click", function (evt) {
//     page = Number(evt.target.textContent);
//     getMovies();
//   });