
const youtubeAPIKey = 'AIzaSyBS4knofqrTkrRQ5ReSUUGqG8GoC2s6GVg';



// console.log(document.querySelector('.card-container'));
// Accordian

// Event listener for the Home text
document.querySelector('#reset').addEventListener('click',(e) => {
    e.preventDefault();
    const secondPage = document.querySelector('.second-page-container')
    // secondPage.style.display = 'none';
    secondPage.classList.add('hidden')
    })

function getClosestParent(el) {
    for ( ; el && el !== document; el = el.parentNode ) {
        // Do something...
        if(el.classList.contains('card')) {
            return el
        }
    }
};


// Event listener for search button
document.querySelector('.search-button').addEventListener('click', async function(e) {
    let userInput = document.querySelector('#search-bar').value
    console.log(`User has inputted: ${userInput}`)
    // Check if search bar is empty
    if ( userInput.length < 3 ){
        // Alert if the input is invalid/empty
        alert('Don\'t forget to enter something!');
    } else {
        // If input is valid continue with search and populate
        e.preventDefault();

        const cardContainer = document.querySelector('.card-container');
        // console.log(cardContainer)
        cardContainer.innerHTML = '';

        const secondPage = document.querySelector('.second-page-container')
        secondPage.classList.remove('hidden')


        const jsonifiedAnimeLongDataList =  await searchAnime(userInput);
        // console.log(jsonifiedAnimeLongDataList)
        
        
        // Container event listener
        document.querySelector('.card-container').addEventListener('click', (e) => {
            if (e.target !== e.currentTarget) {
            // const bigCard = document.querySelector('.big-card')
            let ourTarget = getClosestParent(e.target)
            // console.log(ourTarget)
            const bigCard = makeBigCard(jsonifiedAnimeLongDataList[ourTarget.dataset.index]);
            bigCard.classList.remove('hidden');
            }
        })
        showCardContainer();
    }
})


function showCardContainer() {
    const secondPage = document.querySelector('.second-page-container')
    secondPage.classList.remove('hidden');
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
    `;
    // console.log(bigCard)
    
    // <div class="big-card-videos"></div>

    // Click event on close button
    document.querySelector('#close').addEventListener('click', (e) => {
        const bigCard = document.querySelector('.big-card')
        while (bigCard.firstChild) {bigCard.removeChild(bigCard.firstChild);};
        // bigCard.innerHTML = ''
    });
    // console.log(document.querySelector('#close'));





    const openingList = jsonifiedAnimeLongData.opening_themes;
    const endingList = jsonifiedAnimeLongData.ending_themes;

    const compiledList = []
    openingList.forEach(item => compiledList.push(item.split(' (ep')[0] + ' OP'));
    endingList.forEach(item => compiledList.push(item.split(' (ep')[0] + ' ED'));
    
    console.log(`The compiled list of OP/EDs:`);
    console.log(compiledList);

    let awaitYoutubeItem;
    // openingList.forEach(item => searchYoutube(item));
    compiledList.forEach(async function(item) { 
        awaitYoutubeItem = await searchYoutube(item);
        // if (awaitYoutubeItem[1]) {
        //     await createBigCardVideos(awaitYoutubeItem[0]);
        // }
        await createBigCardVideos(awaitYoutubeItem);
        await console.log(`Successfully Embedded Video: \n ${item}`)
        // newList.push(awaitYoutubeItem);
        // console.log(awaitYoutubeItem);
    });

    return bigCard;

}

//Create the rest of the card by embeding the video
function createBigCardVideos(youtubeObject) {

    //    const link = `https://www.youtube.com/watch?v=${youtubeObject.items[0].id.videoId}`;
    const link = `https://www.youtube.com/embed/${youtubeObject.items[0].id.videoId}`;
    const container = document.querySelector('.big-card');
    const el = document.createElement('div')
    el.classList.add('single-video-container')

    const video = document.createElement('object');
    video.data = link;
    el.append(video)
   
    addNextButton(el, video, youtubeObject)
    container.append(el);
}

// create new entry
async function createCard(jsonifiedAnimeLongData, i) {
    //results page populate after user input
    const cardContainer = document.querySelector('.card-container')
    const cardItem = document.createElement('div')
    cardItem.classList.add('card')
    cardItem.setAttribute('data-index',i)
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

    const malIdList = []
    
    for (let i=0; i < shortData.results.length && i<9; i++) {
        const malID = shortData.results[i].mal_id;
        const animeURL = `https://api.jikan.moe/v3/anime/${malID}/`;
        const fetchedAnimeLongData = await fetch(animeURL);
        const fetchedAnimeLongDataJSON = await fetchedAnimeLongData.json()
        malIdList.push(fetchedAnimeLongDataJSON);
        await createCard(fetchedAnimeLongDataJSON, i);
    }
    return await malIdList;
}


async function searchYoutube(item) {
    let jsonifiedYoutubeData;
    // Fetch if there is no local storage
    // let hasHits = true;
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
        // if (!jsonifiedYoutubeData.length) {
        //     jsonifiedYoutubeData = 'N/A';
            // hasHits=false;
        // }
        //


        // Store fetched data into local storage

        
        localStorage[item] = JSON.stringify(jsonifiedYoutubeData);

        // console.log(jsonifiedYoutubeData);
        console.log(`Queried, stored in local storage, and returned: \n${item}`)
        return jsonifiedYoutubeData
    } else { // Pull from local storage
        jsonifiedYoutubeData = await JSON.parse(localStorage.getItem(item))

        console.log(`Found data in local storage and returned: \n${item}`)
        // console.log(jsonifiedYoutubeData);

        // if (jsonifiedYoutubeData === 'N/A') {
        //     hasHits = false;
        // }

        return jsonifiedYoutubeData
        // return [jsonifiedYoutubeData,hasHits]
    }

    // return the data
    // console.log('This is the jsonifiedYoutubeData: ')
}

async function searchAnime(search) {
    // user input for desired anime themes
    // const search = prompt('Search for: ');
    // const search = 'Grand Blue';
    
    // Queries the short and long anime data
    const jsonifiedAnimeShortData = await getAnimeShortData(search);
    // console.log(jsonifiedAnimeShortData)
    jsonifiedAnimeLongDataList = await getAnimeLongData(jsonifiedAnimeShortData);
    // console.log(jsonifiedAnimeLongDataList)

    
    // Search youtube for each OP/ED
    // openingList.forEach(item => searchYoutube(item));
    // endingList.forEach(item => searchYoutube(item));
    
    // create page that draws all data


    return jsonifiedAnimeLongDataList;
}




// main();