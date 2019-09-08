const youtubeAPIKey = 'INSERT API KEY HERE';
let matureFilter = true;
const matureSwitch = document.querySelector('.mature-switch-input');


// Changes Mature Filter
function changeMatureFilter() {
    // console.log(matureSwitch.checked);
    matureFilter = matureSwitch.checked ? true : false;
    // console.log(matureFilter);
}


// Click
function fadeOut(e, speed) {
    if(!e.style.opacity) {
        e.style.opacity = 1;
    }
    setInterval(function() {e.style.opacity -= 0.02;}, speed /50);
}

function getClosestParent(el) {
    for ( ; el && el !== document; el = el.parentNode ) {
        if(el.classList.contains('card')) {
            return el;
        }
    }
};

function showCardContainer() {
    const secondPage = document.querySelector('.second-page-container');
    secondPage.classList.remove('hidden');
}

function updateVideo(videoElement, youtubeObject, count) {
    videoElement.data = `https://www.youtube.com/embed/${youtubeObject.items[count].id.videoId}`;
}

const nextVideo = function(el) {
    let count = 0;
    return function(youtubeObject, vTitle) {
        count++;
        if (count === youtubeObject.items.length) {
            count = 0;
        }
        // console.log(count);
        updateVideo(el, youtubeObject, count);
        vTitle.innerText = youtubeObject.items[count].snippet.title;
    }
}

function addNextButton(container, videoElement, youtubeObject, vTitle) {
    var scrollVideo = nextVideo(videoElement);
    const button = document.createElement('button');
    button.classList.add('next-video-button');
    button.innerText = 'next video';
    container.append(button);
    button.addEventListener('click', () => scrollVideo(youtubeObject, vTitle));
}

function checkDataArray(jsonifiedAnimeLongData, searchKey) {
    if ((jsonifiedAnimeLongData[searchKey] !== null) && !(typeof(jsonifiedAnimeLongData[searchKey]) === 'object')) { // not null and does not return an object
        // console.log('1');
        return jsonifiedAnimeLongData[searchKey];
    } else if ((jsonifiedAnimeLongData[searchKey] !== null) && jsonifiedAnimeLongData[searchKey].length && jsonifiedAnimeLongData[searchKey] !== 'rating' ) {  // not null, has a length, and isn't a rating
        // console.log('here');
        return jsonifiedAnimeLongData[searchKey].map(item => item.name).join(', ');
    } else {
        return `Unknown ${searchKey}`;
    }
}

function makeBigCard(jsonifiedAnimeLongData) {
    const bigCard = document.querySelector('.big-card');
    
    const animeImg = checkDataArray(jsonifiedAnimeLongData, 'image_url');
    const animeTitles = checkDataArray(jsonifiedAnimeLongData, 'title');
    const animeSynopsis = checkDataArray(jsonifiedAnimeLongData, 'synopsis');
    const animeGenres = checkDataArray(jsonifiedAnimeLongData, 'genres');
    const animeRating = checkDataArray(jsonifiedAnimeLongData, 'rating');
    const animeScore = checkDataArray(jsonifiedAnimeLongData, 'score');
    const animeStudios = checkDataArray(jsonifiedAnimeLongData, 'studios');

    bigCard.innerHTML =
    `
    <span id="close">&times;</span>
    <div class="big-card-image"><img src="${animeImg}"/></div>
    <h1 class="big-card-title">${animeTitles}</h1>
    <div class="big-card-moreinfo">
        <div class="synopsis">${animeSynopsis}</div>
        <br>
        <div class="genre">${animeGenres}</div>
        <div class="rating">${animeRating}</div>
        <div class="score">Score: ${animeScore}</div>
        <div class="studios">Studio: ${animeStudios}</div>
    </div>
    <div class="overlay"></div>
    `;

    // Click event on close button
    document.querySelector('#close').addEventListener('click', (e) => {
        const bigCard = document.querySelector('.big-card');
        while (bigCard.firstChild) {bigCard.removeChild(bigCard.firstChild);};
        // bigCard.innerHTML = '';
    });

    const openingList = jsonifiedAnimeLongData.opening_themes;
    const endingList = jsonifiedAnimeLongData.ending_themes;

    const compiledList = [];
    openingList.forEach(item => compiledList.push(item.split(' (ep')[0] + ' OP'));
    endingList.forEach(item => compiledList.push(item.split(' (ep')[0] + ' ED'));
    
    console.log(`The compiled list of OP/EDs:`);
    console.log(compiledList);

    let awaitYoutubeItem;
    compiledList.forEach(async function(item) { 
        awaitYoutubeItem = await getYoutubeItem(item);
        if (awaitYoutubeItem.items.length){
            await createBigCardVideos(awaitYoutubeItem);
        }
        await console.log(`Successfully Embedded Video: \n ${item}`);
    });
    return bigCard;
}

//Create the rest of the card by embeding the video
function createBigCardVideos(youtubeObject) {

    const link = `https://www.youtube.com/embed/${youtubeObject.items[0].id.videoId}`;
    const container = document.querySelector('.big-card');
    const el = document.createElement('div');
    el.classList.add('single-video-container');

    // console.log(youtubeObject);

    const videoTitle = youtubeObject.items[0].snippet.title;

    const vTitle = document.createElement('h3');
    vTitle.innerText = videoTitle;
    vTitle.classList.add('video-title');
    el.append(vTitle);

    const video = document.createElement('object');
    video.data = link;
    el.append(video);
   
    addNextButton(el, video, youtubeObject, vTitle);
    container.append(el);
}

// create new entry
async function createCard(jsonifiedAnimeLongData, i) {
    //results page populate after user input
    const cardContainer = document.querySelector('.card-container');
    const cardItem = document.createElement('div');
    cardItem.classList.add('card');
    cardItem.setAttribute('data-index',i);

    cardItem.innerHTML = 
    `
    <div class="card-image">
        <img src="${jsonifiedAnimeLongData.image_url}"/>
    </div>
    <div class="card-content">
        <h1 class="card-header">${jsonifiedAnimeLongData.title}</h1>
    </div>
    `;
    cardContainer.appendChild(cardItem);
}

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
    const malIdList = [];
    let isMature;
    let createMoreCardsCount = 9
    for (let i=0; i < shortData.results.length && createMoreCardsCount > 0; i++, createMoreCardsCount--) {
        const malID = shortData.results[i].mal_id;
        const animeURL = `https://api.jikan.moe/v3/anime/${malID}/`;
        const fetchedAnimeLongData = await fetch(animeURL);
        const fetchedAnimeLongDataJSON = await fetchedAnimeLongData.json();
        isMature = checkDataArray(fetchedAnimeLongDataJSON, 'genres').includes('Hentai');
        // console.log(isMature);
        if (isMature && matureFilter) {
            createMoreCardsCount++
        } else {
            malIdList.push(fetchedAnimeLongDataJSON);
            await createCard(fetchedAnimeLongDataJSON, i);
        }
        // console.log(createMoreCardsCount);
        
    }
    return await malIdList;
}

async function searchYoutube(item) {
    // Encodes the item to search for url with no spaces and removes quotes
    newItem = encodeURI(item).split(`%22`).join(''); 
    const youtubeURL = `https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&key=${youtubeAPIKey}&q=${newItem}`;
    // Queries for the item and formats to json
    const fetchedYoutubeData = await fetch(youtubeURL);
    const jsonifiedYoutubeData = await fetchedYoutubeData.json();

    // Store fetched data into local storage
    localStorage[item] = JSON.stringify(jsonifiedYoutubeData);

    // console.log(jsonifiedYoutubeData);
    console.log(`Queried, stored in local storage, and returned: \n${item}`);
    return jsonifiedYoutubeData;
}

async function searchLocalStorage(item) {
    const jsonifiedYoutubeData = await JSON.parse(localStorage.getItem(item));
    console.log(`Found data in local storage and returned: \n${item}`);
    return jsonifiedYoutubeData;
}

async function getYoutubeItem(item) {
    // Fetch if there is no local storage
    if(!localStorage.getItem(item)) {
        return searchYoutube(item);
    } else { // Pull from local storage
        return searchLocalStorage(item);
    }
}

async function searchAnime(search) {
    // Queries the short and long anime data
    const jsonifiedAnimeShortData = await getAnimeShortData(search);
    // console.log(jsonifiedAnimeShortData);
    const jsonifiedAnimeLongDataList = await getAnimeLongData(jsonifiedAnimeShortData);
    // console.log(jsonifiedAnimeLongDataList);
    return jsonifiedAnimeLongDataList;
}

// Event listener for the Home text
function navEvent(e) {
    e.preventDefault();
    const secondPage = document.querySelector('.second-page-container');
    secondPage.classList.add('hidden');
}

// Event listener for search button
async function searchEvent(e) {
    if (e.keyCode === 13) {    
        let userInput = document.querySelector('#search-bar').value;
        console.log(`User has inputted: ${userInput}`);
    // Check if search bar is empty
        if ( userInput.length < 3 ){
            // Alert if the input is invalid/empty
            alert('Don\'t forget to enter something!');
        } else {
            // If input is valid continue with search and populate
            e.preventDefault();

            const cardContainer = document.querySelector('.card-container');
            // Clear card container
            cardContainer.removeEventListener('click', window.populateBigCard);
            cardContainer.innerHTML = '';

            const secondPage = document.querySelector('.second-page-container');
            secondPage.classList.remove('hidden');


            const jsonifiedAnimeLongDataList =  await searchAnime(userInput);
            
            window.populateBigCard = (e) => {
                if (e.target !== e.currentTarget) {
                    let ourTarget = getClosestParent(e.target);
                    const bigCard = makeBigCard(jsonifiedAnimeLongDataList[ourTarget.dataset.index]);
                    bigCard.classList.remove('hidden');
                    // scroll to top of page on card click
                    window.scrollTo(0, 0);
                } 
            }

            // Container event listener
            document.querySelector('.card-container').addEventListener('click', window.populateBigCard);
            showCardContainer();
        }
    }
}

function main() {
    document.querySelector('.nav-bar').addEventListener('click', navEvent);
    document.querySelector('#search-bar').addEventListener('keyup', searchEvent);
    matureSwitch.addEventListener('change', changeMatureFilter);

    fadeOut(noface, 30000);
}


document.addEventListener('DOMContentLoaded', main());