
const youtubeAPIKey = 'REPLACE_WITH_KEY';

// Global event listener
// document.addEventListener('click', (e) => {
//     if (e.target === 'card') {
//         bigCard.classList.remove('hidden')
//     };

// Accordian

// Event handler for the Home text
document.querySelector('#home-click').addEventListener('click', function(e){
    e.preventDefault();
    const secondPage = document.querySelector('.second-page-container')
    secondPage.classList.add('hidden');
})


document.querySelector('.search-button').addEventListener('click', (e) => {

    // Check if search bar is empty
    if (document.querySelector('#search-bar').value === ''){
        // Alert if the input is invalid/empty
        alert('Don\'t forget to enter something!');
    } else {
        // If input is valid continue with search and populate
        e.preventDefault();
        createResults();
    }
})

function createResults() {
    const secondPage = document.querySelector('.second-page-container')
    secondPage.classList.remove('hidden');
}

//Create the rest of the card by embeding the video
function createTheRestOfTheCard(youtubeObject) {
//    const link = `https://www.youtube.com/watch?v=${youtubeObject.items[0].id.videoId}`;
   const link = `https://www.youtube.com/embed/${youtubeObject.items[0].id.videoId}`;
   const container = document.querySelector('.main-container');
   const el = document.createElement('div')
   el.innerHTML = 
        `
        <object style="width:100%;height:100%;width: 400px; height: 200px; float: none; clear: both; margin: 2px auto;" data="${link}">
        </object>
        `

container.append(el);
}

// create new entry
async function createCard(jsonifiedAnimeLongData) {
    //results page populate after user input
    const cardContainer = document.querySelector('.card-container')
    const cardItem = document.createElement('div')
    cardItem.classList.add('card')
    console.log(cardContainer);
    console.log(jsonifiedAnimeLongData);


    cardItem.innerHTML = 
    `
    <div class="card-image">
        <img src="${jsonifiedAnimeLongData.image_url}"/>
    </div>
    <div class="card-content">
        <h1 class="card-header">${jsonifiedAnimeLongData.title}</h1>
    </div>
    `;
    cardContainer.appendChild(cardItem)



    const bigCard = document.querySelector('.big-card')
    
    bigCard.innerHTML =
    `
    <span class="close">&times;</span>
    <div class="big-card-image"><img src="${jsonifiedAnimeLongData.image_url}"/></div>
    <h1 class="big-card-title">${jsonifiedAnimeLongData.title}</h1>
    <div class="big-card-moreinfo">
        <div class="synopsis">${jsonifiedAnimeLongData.synopsis}</div>
        <div class="genre">Genre: ${jsonifiedAnimeLongData.genres[0].name}</div>
        <div class="rating">Rating: ${jsonifiedAnimeLongData.rating}</div>
        <div class="score">Score: ${jsonifiedAnimeLongData.score}</div>
        <div class="studios">Studio: ${jsonifiedAnimeLongData.studios[0].name}</div>
    </div>
    <div class="big-card-videos"></div>
    `;
    console.log(bigCard)
    





    const openingList = jsonifiedAnimeLongData.opening_themes;
    const endingList = jsonifiedAnimeLongData.ending_themes;

    const compiledList = []
    openingList.forEach(item => compiledList.push(item.split(' (ep')[0] + ' OP'));
    endingList.forEach(item => compiledList.push(item.split(' (ep')[0] + ' ED'));
    
    console.log(compiledList);

    let awaitYoutubeItem;
    // openingList.forEach(item => searchYoutube(item));
    compiledList.forEach(async function(item) { 
        awaitYoutubeItem = await searchYoutube(item);
        await createTheRestOfTheCard(awaitYoutubeItem);
        // newList.push(awaitYoutubeItem);
        // console.log(awaitYoutubeItem);
    });
}

// SKELETON ANIMATION use this to move pictures on the home page - UI - DO
function myMove() {
    var elem = document.getElementById('luffy');   
    var pos = 0;
    var id = setInterval(frame, 10);
    function frame() {
      if (pos == 350) {
        clearInterval(id);
      } else {
        pos++; 
        elem.style.bottom = pos + 'px'; 
        elem.style.right = pos + 'px'; 
        };
    };
};

// gets the short anime object
async function getAnimeShortData(search) {
    // encodes search query into URL
    const encodedSearch = encodeURI(search);
    // input is added to actual url
    const animeSearchURL = `https://api.jikan.moe/v3/search/anime?q=${encodedSearch}`;
    //fetch and return JSON
    const fetchedAnimeShortData = await fetch(animeSearchURL);
    return await fetchedAnimeShortData.json();
}

// Queries for the long data from the short data
async function getAnimeLongData(shortData) {
    const malID = shortData.results[0].mal_id;
    const animeURL = `https://api.jikan.moe/v3/anime/${malID}/`;
    const fetchedAnimeLongData = await fetch(animeURL);
    return await fetchedAnimeLongData.json();
}


async function searchYoutube(item) {
    let jsonifiedYoutubeData;
    // Fetch if there is no local storage
    if(!localStorage.getItem(item)) {
        // Encodes the item to search for url with no spaces and removes quotes
        newItem = encodeURI(item).split(`%22`).join(''); 
        const youtubeURL = `https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&key=${youtubeAPIKey}&q=${newItem}`;
        // Queries for the item and formats to json
        const fetchedYoutubeData = await fetch(youtubeURL);
        jsonifiedYoutubeData = await fetchedYoutubeData.json();
        //
        // Code: If the return list is empty, then set localstorage of item to 'N/A', and empty return.  In the non-associated else block, make sure that if localstorage of item is 'N/A', then empty return there as well
        //

        // Store fetched data into local storage
        localStorage[item] = JSON.stringify(jsonifiedYoutubeData);

        console.log('Queried, stored in local storage, and returned data.')
    } else { // Pull from local storage
        jsonifiedYoutubeData = await JSON.parse(localStorage.getItem(item))

        console.log('Found data in local storage and returned')
    }

    // return the data
    console.log('This is the jsonifiedYoutubeData: ')
    console.log(jsonifiedYoutubeData);
    return jsonifiedYoutubeData
}

async function main() {
    // user input for desired anime themes
    // const search = prompt('Search for: ');
    const search = 'Grand Blue';
    
    // Queries the short and long anime data
    const jsonifiedAnimeShortData = await getAnimeShortData(search);
    const jsonifiedAnimeLongData = await getAnimeLongData(jsonifiedAnimeShortData);
    
    // indexes the OP/ED lists
    const openingList = jsonifiedAnimeLongData.opening_themes;
    const endingList = jsonifiedAnimeLongData.ending_themes;
    console.log(openingList);
    console.log(endingList);
    
    // Search youtube for each OP/ED
    // openingList.forEach(item => searchYoutube(item));
    // endingList.forEach(item => searchYoutube(item));
    
    // create page that draws all data
    createCard(jsonifiedAnimeLongData);
}




main();