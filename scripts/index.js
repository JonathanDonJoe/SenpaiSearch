
const youtubeAPIKey = 'AIzaSyAF67RmBAeW0hQi7E5zRYeXPr6QZBwykpY';

// event handlers

// Event handler for the Home text
document.querySelector('#home-click').addEventListener('click', function(e){
    e.preventDefault();
    const secondPage = document.querySelector('.second-page-container')
    secondPage.classList.add('hidden');
})


document.querySelector('.search-button').addEventListener('click', (e) => {
    const firstPage = document.querySelector('.first-page-container')
    const secondPage = document.querySelector('.second-page-container')

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

function createTheRestOfTheCard(youtubeObject) {

    // console.log(youtubeObject);









    // if no search result hits, ignore it.

    // if (!jsonifiedYoutubeData.items.length) {
    //     console.log('Search found no results')
    //     return
    // }

    // else it logs
    // console.log(jsonifiedYoutubeData);
    // console.log(jsonifiedYoutubeData.items[0].id.videoId);
    // console.log(`https://www.youtube.com/watch?v=${jsonifiedYoutubeData.items[0].id.videoId}`);

    


}

// create new entry
async function createCard(jsonifiedAnimeLongData) {

    const openingList = jsonifiedAnimeLongData.opening_themes;
    const endingList = jsonifiedAnimeLongData.ending_themes;

    // const newList = [];
    let awaitYoutubeItem;
    // openingList.forEach(item => searchYoutube(item));
    openingList.forEach(async function(item) { 
        awaitYoutubeItem = await searchYoutube(item);

        await createTheRestOfTheCard(awaitYoutubeItem);
        // newList.push(awaitYoutubeItem);
        // console.log(awaitYoutubeItem);
    });
    // const testArr = newList.map(e => e);


    // awaitYoutubeItem = await searchYoutube(openingList);
    // newList.push(awaitYoutubeItem);
    // console.log(awaitYoutubeItem)


    // setTimeout(() => console.log(newList[0]), 2000);
    // console.log(newList);

    // localStorage['openingAnimeObject'] = JSON.stringify(newList);

    // const newCard = document.createElement('section');
    // newCard.innerHTML = `<section class="">
    // <div class="avatar-image">
    //     <img src="${el.image_url}" alt="${el.title}"/>
    // </div>
    // <div class="avatar-content">
    //     <h2 class="avatar-header">${el.title}</h2>
    //     </div>
    // </section>`;
    // container.appendChild(newCard);
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
    // Queries for the item
    const youtubeURL = `https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&key=${youtubeAPIKey}&q=${item}`;
    const fetchedYoutubeData = await fetch(youtubeURL);
    const jsonifiedYoutubeData = await fetchedYoutubeData.json();
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