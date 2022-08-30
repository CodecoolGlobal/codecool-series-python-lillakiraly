let pageIndex = 1;
const SHOWS_PER_PAGE = 15;


function getAllShowData(){
    return fetch('/api/get_shows').then(res => res.json())
}

async function listNextShows(pageIndex, showsPerPage){
    let showData = await getAllShowData();
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = "";
    for (let i = 0; i < 15; i++) {
        let tableRow = document.createElement('tr');
        let currentShow;

        if (pageIndex === 1) {currentShow = showData[i];}
        else {currentShow = showData[((pageIndex-1) * showsPerPage) + i];}

        let title = document.createElement('td')
        title.textContent = currentShow.title;

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


async function loadPageNavigation(showsPerPage) {
    let showData = await getAllShowData();
    let numOfShows = showData.length;

    let pageNav = document.querySelector('.show-pagination');

    for (let i = 1; i < (numOfShows/showsPerPage); i++) {
        let newPageNavNum = document.createElement('a');
        newPageNavNum.textContent = i;
        newPageNavNum.dataset.pageNum = i;
        newPageNavNum.classList.add('pagination-num');
        pageNav.appendChild(newPageNavNum);
        let currentPage = newPageNavNum.dataset.pageNum;
        newPageNavNum.addEventListener('click', async e => {
            await listNextShows(currentPage, showsPerPage);
            highlightCurrentPageNum(newPageNavNum);
        })
    }
}


function highlightCurrentPageNum(activePageNum) {
    let pageNumbers = document.querySelectorAll('.pagination-num');
    pageNumbers.forEach(pageNumber => pageNumber.classList.remove('active-page'));
    activePageNum.classList.add('active-page');
}

loadPageNavigation(SHOWS_PER_PAGE);
listNextShows(pageIndex, SHOWS_PER_PAGE);