const youtubeAPIKey = 'AIzaSyC0VxcANY18gSIQH7pmb-gb0dUSJt-pikk';

// Click
function fadeOut(e, speed) {
    if(!e.style.opacity) {
        e.style.opacity = 1;
    }
    setInterval(function() {e.style.opacity -= 0.02;}, speed /50);
}

fadeOut(noface, 30000);

// Event listener for the Home text
document.querySelector('.nav-bar').addEventListener('click',(e) => {
    e.preventDefault();
    const secondPage = document.querySelector('.second-page-container')
    secondPage.classList.add('hidden')
})

function getClosestParent(el) {
    for ( ; el && el !== document; el = el.parentNode ) {
        if(el.classList.contains('card')) {
            return el
        }
    }
};

// Event listener for search button
document.querySelector('#search-bar').addEventListener('keyup', async function(e) {
    if (e.keyCode === 13) {    
        let userInput = document.querySelector('#search-bar').value;
        // console.log(`User has inputted: ${userInput}`);
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
            document.querySelector('.card-container').addEventListener('click', window.populateBigCard)
            showCardContainer();
        }
    }
})

function showCardContainer() {
    const secondPage = document.querySelector('.second-page-container');
    secondPage.classList.remove('hidden');
}


function updateVideo(videoElement, youtubeObject, count) {
    videoElement.data = `https://www.youtube.com/embed/${youtubeObject.items[count].id.videoId}`; // the video
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




function makeBigCard(jsonifiedAnimeLongData) {
    const bigCard = document.querySelector('.big-card')
    
    let animeGenres = jsonifiedAnimeLongData.genres.map(item => item.name)
    let studio;
    if(jsonifiedAnimeLongData.studios.length) {
        studio = jsonifiedAnimeLongData.studios[0].name;
    } else {
        studio = 'Unknown Studio'
    }


    bigCard.innerHTML =
    `
    <span id="close">&times;</span>
    <div class="big-card-image"><img src="${jsonifiedAnimeLongData.image_url}"/></div>
    <h1 class="big-card-title">${jsonifiedAnimeLongData.title}</h1>
    <div class="big-card-moreinfo">
        <div class="synopsis">${jsonifiedAnimeLongData.synopsis}</div>
        <br>
        <div class="genre">${animeGenres.join(', ')}</div>
        <div class="rating">${jsonifiedAnimeLongData.rating}</div>
        <div class="score">${jsonifiedAnimeLongData.score}</div>
        <div class="studios">${studio}</div>
    </div>
    <div class="overlay"></div>
    `;

    // Click event on close button
    document.querySelector('#close').addEventListener('click', (e) => {
        const bigCard = document.querySelector('.big-card')
        while (bigCard.firstChild) {bigCard.removeChild(bigCard.firstChild);};
        // bigCard.innerHTML = ''
    });

    const openingList = jsonifiedAnimeLongData.opening_themes;
    const endingList = jsonifiedAnimeLongData.ending_themes;

    const compiledList = []
    openingList.forEach(item => compiledList.push(item.split(' (ep')[0] + ' OP'));
    endingList.forEach(item => compiledList.push(item.split(' (ep')[0] + ' ED'));
    
    // console.log(`The compiled list of OP/EDs:`);
    // console.log(compiledList);

    let awaitYoutubeItem;
    compiledList.forEach(async function(item) { 
        awaitYoutubeItem = await searchYoutube(item);
        if (awaitYoutubeItem.items.length){
            await createBigCardVideos(awaitYoutubeItem);
        }
        // await console.log(`Successfully Embedded Video: \n ${item}`);
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
    vTitle.classList.add('video-title')    
    el.append(vTitle);

    const video = document.createElement('object');
    video.data = link;
    el.append(video)
   
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
    for (let i=0; i < shortData.results.length && i<9; i++) {
        const malID = shortData.results[i].mal_id;
        const animeURL = `https://api.jikan.moe/v3/anime/${malID}/`;
        const fetchedAnimeLongData = await fetch(animeURL);
        const fetchedAnimeLongDataJSON = await fetchedAnimeLongData.json();
        malIdList.push(fetchedAnimeLongDataJSON);
        await createCard(fetchedAnimeLongDataJSON, i);
    }
    return await malIdList;
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
        const jsonifiedYoutubeData = await fetchedYoutubeData.json();
  
        // Store fetched data into local storage
        localStorage[item] = JSON.stringify(jsonifiedYoutubeData);

        // console.log(jsonifiedYoutubeData);
        // console.log(`Queried, stored in local storage, and returned: \n${item}`)
        return jsonifiedYoutubeData
    } else { // Pull from local storage
        jsonifiedYoutubeData = await JSON.parse(localStorage.getItem(item))
        // console.log(`Found data in local storage and returned: \n${item}`)
        return jsonifiedYoutubeData
    }
}

async function searchAnime(search) {
    // Queries the short and long anime data
    const jsonifiedAnimeShortData = await getAnimeShortData(search);
    // console.log(jsonifiedAnimeShortData)
    jsonifiedAnimeLongDataList = await getAnimeLongData(jsonifiedAnimeShortData);
    // console.log(jsonifiedAnimeLongDataList)
    return jsonifiedAnimeLongDataList;
}