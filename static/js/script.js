async function getActors(showId){
    let data = await fetch(`/api/actors?show_id=${showId}`);
    return data.json()
}

async function listActors(showId){
    const actors = await getActors(showId);

    const actorsTableBody = document.querySelector('#actors tbody');
    actorsTableBody.replaceChildren();
    for (const actor of actors) {
        let tableRow = document.createElement('tr');
        let actorName = document.createElement('td');
        actorName.textContent = actor.death ? `+${actor.name}` : actor.name;

        let actorCharNum = document.createElement('td');
        actorCharNum.textContent = actor.character_num;

        let actorDeath = document.createElement('td');
        actorDeath.textContent = actor.death ? actor.death : 'Still alive';

        tableRow.append(actorName,actorCharNum, actorDeath);
        actorsTableBody.appendChild(tableRow);
    }
}


function initPage() {
    let shows = document.querySelectorAll('[data-show-id]');
    shows.forEach(show => {
        show.addEventListener('click', () => {
            let showId = show.dataset.showId;
            listActors(showId);
        })
    })
}

initPage();