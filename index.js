// defining the cohort code
const COHORT_CODE = "2803-PUPPIES";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${COHORT_CODE}/players`;

// this object stores all the data from the app
const state = {         
    userData: [],
    users: {},
    selectedUserId: null    // stores the id of the currently selected player, No player selected yet
};

// selecting the DOM element with class '.card'
const cardSection = document.querySelector(".card");

// event listeners
window.addEventListener("hashchange", selectUser);  // allows the app to dynamically switch views
window.addEventListener("load", render);    // triggers the render function

// hash parsing function
function getEventFromHash() {
    const hash = window.location.hash.slice(1);     // gets the url hash, without the #
    if (hash.startsWith("player-")) {            // check if the url hash starts with 'player-'
        const id = hash.split("-")[1];        // split the string at the dash and access the second element of that array
        state.selectedUserId = id;          // update the app state for the player currently selected
    } else {
        state.selectedUserId = null;        // does not show a player's details
    }
};

async function fetchAllUsers() {
    try {
        const response = await fetch(API_URL);      // network request to the api_url
        const json = await response.json();         // waits for the https response, and converts to a json
        const players = json.data.players;          // extracts the each players data

        state.userData = players;             // stores the full list of players and updates the state object

        state.users = {};               // initialize an empty object
        players.forEach(player => {     // loop through each player and add them to 'state.users'
            state.users[player.id] = player;    // returns a player matching their id
        });

    // error handling
    } catch (error){
        console.log("Error catching players: ", error);
    }
};

// displays a list of all players
function renderAllUsers() {
    cardSection.innerHTML = "";         // add the heading 'Players'
    cardSection.innerHTML += state.userData.map(makeUserCard).join('');     // renders each player as a card

    toggleSection(true);       // show form, title and new players
}

// this will generate an html card for each player
function makeUserCard(user) {
    // updates the url fragment identifier (the part after the #)
    return `
        <div class="user-card" onclick="location.hash='player-${user.id}'">     
            <img src="${user.imageUrl}" alt="api-image" class="item-image">   
            <h3 class="name">${user.name}</h3>                  
        </div>
    `;
}

// show individual player details
function renderUserDetails() {
    const id = state.selectedUserId;    // retrieves the currently selected player
    const user = state.users[id];       // contains the entire object for each player

    // if no player data is found, display 'Player not found'
    if (!user) {
        cardSection.innerHTML = "<p>Player Not Found</p>";
        return;
    } 

    // renders a detailed view of a selected player
    cardSection.innerHTML = `
        <div class="user-detail">
            <h2 class="playerName">Name: ${user.name}</h2>
            <p class="playerBreed">Breed: ${user.breed}</p>
            <p class="playerStatus">Status: ${user.status}</p>
            <p class="createdTime">Date Created: ${new Date(user.createdAt).toLocaleDateString()}</p>
            <p class="updatedTime">Date Updated: ${new Date(user.updatedAt).toLocaleTimeString()}</p>
            <p class="playerId">Team: ${user.teamId}</p>
            <p class="playerCohort">Cohort Id: ${user.cohortId}</p>
            <p><a href="#">Return Back</a></p>
        </div>
    `;

    toggleSection(false);      // hide form, title and new players
}

// function gets called when the url hash gets changed or page loads
function selectUser() {
    getEventFromHash();     // calls the 'getEventFromHash' function

    if (state.selectedUserId) {         // checks if a player's id is selected
        renderUserDetails();            // if true, show details
    } else {
        renderAllUsers();               // if false, list all players
    }
}

// main render function
async function render() {
    await fetchAllUsers();
    selectUser();
}

function formatTime12h(timeStr) {
    if (!timeStr) return '';        // if timeStr is fale, returns null

    const [hour, minute] = timeStr.split(':');      // splits the time string by the colon and turns it into an array
    let h = Number(hour);                           // converts hours into a number
    let m = minute;                                 // keeps minutes as a string, no changes
    let ampm = h >=12 ? 'PM' : 'AM';            // ternary operator
    
    h = h % 12 || 12;                   // converts time into a 12 hour format
    return h + ':' + m + ampm;          // concatenates the final format
}

// I did not include comments for this block of code, because I used in my previous assingment and already familiar with the code
document.addEventListener("DOMContentLoaded", () => {   
    const form = document.getElementById("players");
    const cardContainer = document.getElementById("card-container");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nameValue = document.getElementById("nameInput").value.trim();
        const idValue = document.getElementById("idInput").value.trim();
        const breedValue = document.getElementById("breed-type").value.trim();
        const teamValue = document.getElementById("team").value.trim();
        const statusValue = document.getElementById("status").value.trim();
        const timeValue = document.getElementById("timeInput").value;
        const imglink = document.getElementById("imageUrl").value.trim();
    
        if (!idValue || !nameValue || !breedValue || !teamValue || !statusValue || !imglink || !timeValue) {
            alert("All fields are required");
            return;
        }
    
        const card = document.createElement("div");
        card.className = "player-form";

        card.innerHTML = `
        <div class="image"><img src="${imglink}" alt="imageName"></div>
        <p class="id">${idValue}</p>
        <h2 class="name">${nameValue}</h2>
        <p class="breed">${breedValue}</p>
        <p class="status">${statusValue}</p>
        <p class="time">${formatTime12h(timeValue)}</p>
        <p class="team">${teamValue}</p>
        <button class="deleteBtn">Delete</button>
        `;
    
        const deleteBtn = card.querySelector(".deleteBtn");
            deleteBtn.addEventListener("click", () => {
                card.remove();
            });

        cardContainer.appendChild(card);

        form.reset();
        });    
    });

    // function named 'toggleSection' with an argument called 'show'
function toggleSection(show) {
    const form = document.getElementById("players");        // targets this id in the html form
    const newCard = document.querySelector(".new-players-section");         // targets this class in the html form

    // '!show' means to not show
    // if show is true, it removes the hidden class
    // if show is false, it adds the hidden class
    if (form) form.classList.toggle("hidden", !show);      
    if (newCard) newCard.classList.toggle("hidden", !show);
}

module.exports = { formatTime12h };