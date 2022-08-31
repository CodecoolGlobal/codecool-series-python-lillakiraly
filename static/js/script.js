let pageIndex = 1;
const SHOWS_PER_PAGE = 15;


function getAllShowData(sortBy='rating', ascOrDesc='DESC'){
    return fetch('/api/get_shows', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            column: sortBy,
            order: ascOrDesc
        })}).then(res => res.json())
}

async function listNextShows(pageIndex, showsPerPage, sortBy='rating', ascOrDesc='DESC'){
    let showData = await getAllShowData(sortBy, ascOrDesc);
    console.log(showData)
    let tbody = document.querySelector('.list-shows tbody');
    tbody.innerHTML = "";
    for (let i = 0; i < 15; i++) {
        let tableRow = document.createElement('tr');
        let currentShow;

        if (pageIndex === 1) {currentShow = showData[i];}
        else {currentShow = showData[((pageIndex-1) * showsPerPage) + i];}

        let title = document.createElement('td')
        let titleLink = document.createElement('a');
        titleLink.setAttribute('href', `/show/${currentShow.id}`);
        titleLink.textContent = currentShow.title;
        title.append(titleLink);

        let year = document.createElement('td')
        year.textContent = currentShow.year;

        let runtime = document.createElement('td')
        runtime.textContent = currentShow.runtime;

        let rating = document.createElement('td')
        rating.textContent = currentShow.rating;

        let genres = document.createElement('td')
        genres.textContent = currentShow.genres;

        let trailer = document.createElement('td')
        if (currentShow.trailer) {
            let trailerLink = document.createElement('a');
            trailerLink.setAttribute('href', currentShow.trailer);
            trailerLink.textContent = currentShow.trailer;
            trailer.append(trailerLink);
        } else {trailer.textContent = "No URL"}

        let homepage = document.createElement('td');
        if (currentShow.homepage) {
            let homepageLink = document.createElement('a');
            homepageLink.setAttribute('href', currentShow.homepage);
            homepageLink.textContent = currentShow.homepage;
            homepage.append(homepageLink);
        } else {homepage.textContent = "No URL"}

        tbody.append(tableRow);
        tableRow.append(title, year, runtime, rating, genres, trailer, homepage);
    }
}


async function loadPageNavigation(showsPerPage, sortBy='rating', ascOrDesc='DESC') {
    let showData = await getAllShowData(sortBy, ascOrDesc);
    let numOfShows = showData.length;

    let pageNav = document.querySelector('.show-pagination');
    pageNav.innerHTML = "";

    for (let i = 1; i < (numOfShows/showsPerPage); i++) {
        let newPageNavNum = document.createElement('a');
        newPageNavNum.textContent = i;
        newPageNavNum.dataset.pageNum = i;
        newPageNavNum.classList.add('pagination-num');
        pageNav.appendChild(newPageNavNum);
        let currentPage = newPageNavNum.dataset.pageNum;
        newPageNavNum.addEventListener('click', async e => {
            await listNextShows(currentPage, showsPerPage, sortBy, ascOrDesc);
            highlightCurrentPageNum(newPageNavNum);
        })
    }
}


function highlightCurrentPageNum(activePageNum) {
    let pageNumbers = document.querySelectorAll('.pagination-num');
    pageNumbers.forEach(pageNumber => pageNumber.classList.remove('active-page'));
    activePageNum.classList.add('active-page');
}


let colHeaders = document.querySelectorAll('.list-shows th');
for (let header of colHeaders) {
    let sortByForms = header.querySelectorAll('form');
    sortByForms.forEach(sortByForm =>
    sortByForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let showOrderByCol = sortByForm.querySelector('.column').value;
        let ascOrDescOrder = sortByForm.querySelector('.desc-or-asc').value;
        listNextShows(pageIndex, SHOWS_PER_PAGE, showOrderByCol, ascOrDescOrder);
        loadPageNavigation(SHOWS_PER_PAGE, showOrderByCol, ascOrDescOrder);
        header.dataset.order = ascOrDescOrder === 'ASC' ? 'DESC' : 'ASC';
    }))
    header.addEventListener('click', () => {
        let showOrderByCol = header.dataset.col;
        let ascOrDescOrder = header.dataset.order;
        listNextShows(pageIndex, SHOWS_PER_PAGE, showOrderByCol, ascOrDescOrder);
        loadPageNavigation(SHOWS_PER_PAGE, showOrderByCol, ascOrDescOrder);
        header.dataset.order = ascOrDescOrder === 'ASC' ? 'DESC' : 'ASC';
    })
}


loadPageNavigation(SHOWS_PER_PAGE);
listNextShows(pageIndex, SHOWS_PER_PAGE);