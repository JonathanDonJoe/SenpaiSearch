
const youtubeAPIKey = 'PLACEHOLDER API KEY';



// console.log(document.querySelector('.card-container'));
// Accordian

// Event listener for the Home text
document.querySelector('#home-click').addEventListener('click',(e) => {
    e.preventDefault();
    const secondPage = document.querySelector('.second-page-container')
    // secondPage.style.display = 'none';
    secondPage.classList.add('hidden')
    })

// Event listener for search button
document.querySelector('.search-button').addEventListener('click', async function(e) {

    // Check if search bar is empty
    if (document.querySelector('#search-bar').value === ''){
        // Alert if the input is invalid/empty
        alert('Don\'t forget to enter something!');
    } else {
        // If input is valid continue with search and populate
        e.preventDefault();


        const cardContainer = document.querySelector('.card-container');
        console.log(cardContainer)
        cardContainer.innerHTML = '';

        const secondPage = document.querySelector('.second-page-container')
        secondPage.classList.remove('hidden')


        const jsonifiedAnimeLongData =  await searchAnime();
        console.log(jsonifiedAnimeLongData)
        
        
        // Container event listener
        document.querySelector('.card-container').addEventListener('click', (e) => {
            if (e.target !== e.currentTarget) {
            const bigCard = document.querySelector('.big-card')
            makeBigCard(jsonifiedAnimeLongData)
            bigCard.classList.remove('hidden');
            }
        })
        showCardContainer();
    }
})


function showCardContainer() {
    const secondPage = document.querySelector('.second-page-container')
    secondPage.style.display = 'flex';
}


function updateVideo(videoElement, youtubeObject, count) {
    videoElement.data = `https://www.youtube.com/embed/${youtubeObject.items[count].id.videoId}` // the video
}


const nextVideo = function(el) {
    let count = 0;
    return function(youtubeObject) {
        count++;
        if (count === youtubeObject.items.length) {
            count = 0;
        }
        console.log(count);
        updateVideo(el, youtubeObject, count);
    }

}


function addNextButton(container, videoElement, youtubeObject) {
    var scrollVideo = nextVideo(videoElement);
    const button = document.createElement('button');
    button.classList.add('next-video-button');
    button.innerText = 'Next Video';
    container.append(button);
    button.addEventListener('click', () => scrollVideo(youtubeObject));

    
}




function makeBigCard(jsonifiedAnimeLongData) {
    const bigCard = document.querySelector('.big-card')
    
    bigCard.innerHTML =
    `
    <span id="close">&times;</span>
    <div class="big-card-image"><img src="${jsonifiedAnimeLongData.image_url}"/></div>
    <h1 class="big-card-title">${jsonifiedAnimeLongData.title}</h1>
    <div class="big-card-moreinfo">
        <div class="synopsis">${jsonifiedAnimeLongData.synopsis}</div>
        <div class="genre">Genre: ${jsonifiedAnimeLongData.genres.name}</div>
        <div class="rating">Rating: ${jsonifiedAnimeLongData.rating}</div>
        <div class="score">Score: ${jsonifiedAnimeLongData.score}</div>
        <div class="studios">Studio: ${jsonifiedAnimeLongData.studios[0].name}</div>
    </div>
    <div class="big-card-videos"></div>
    `;
    console.log(bigCard)
    

    // Click event on close button
    document.querySelector('#close').addEventListener('click', (e) => {
        const bigCard = document.querySelector('.big-card')
        bigCard.innerHTML = '';
    });
    console.log(document.querySelector('#close'));

}

//Create the rest of the card by embeding the video
function createTheRestOfTheCard(youtubeObject) {

    const youtubeIdList = [];

    for (let i=0; i < youtubeObject.items.length;i++
        ) {
            youtubeIdList.push(youtubeObject.items[i].id.videoId)
        }

    console.log(youtubeIdList);



    //    const link = `https://www.youtube.com/watch?v=${youtubeObject.items[0].id.videoId}`;
    const link = `https://www.youtube.com/embed/${youtubeObject.items[0].id.videoId}`;
    const container = document.querySelector('.main-container');
    const el = document.createElement('div')
    el.classList.add('single-video-container')

    const video = document.createElement('object');
    video.data = link;
    el.append(video)
   
    addNextButton(el, video, youtubeObject)
    container.append(el);
}

// create new entry
async function createCard(jsonifiedAnimeLongData) {
    //results page populate after user input
    const cardContainer = document.querySelector('.card-container')
    const cardItem = document.createElement('div')
    cardItem.classList.add('card')
    // console.log(cardContainer);
    // console.log(jsonifiedAnimeLongData);


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
        const jsonifiedYoutubeData = await fetchedYoutubeData.json();
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

async function searchAnime() {
    // user input for desired anime themes
    // const search = prompt('Search for: ');
    const search = 'Grand Blue';
    
    // Queries the short and long anime data
    const jsonifiedAnimeShortData = await getAnimeShortData(search);
    jsonifiedAnimeLongData = await getAnimeLongData(jsonifiedAnimeShortData);
    console.log(jsonifiedAnimeLongData)
    
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

    return jsonifiedAnimeLongData;
}




// main();