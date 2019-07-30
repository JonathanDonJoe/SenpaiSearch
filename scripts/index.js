const { log } = console;

function createPage() {
    log('HI');
    // add code here
}


async function fetchData() {
    // user input for desired anime themes
    // const search = prompt('Search for: ');
    const search = 'Grand Blue';
    // encodes search query into URL
    const encodedSearch = encodeURI(search)
    // input is added to actual url
    const animeSearchURL = `https://api.jikan.moe/v3/search/anime?q=${encodedSearch}`;

    //fetch and JSON
    const fetchedAnimeShortData = await fetch(animeSearchURL);
    jsonifiedAnimeShortData = await fetchedAnimeShortData.json();
    const malID = jsonifiedAnimeShortData.results[0].mal_id
    const animeURL = `https://api.jikan.moe/v3/anime/${malID}/`
    const fetchedAnimeLongData = await fetch(animeURL);
    jsonifiedAnimeLongData = await fetchedAnimeLongData.json();
    console.log(jsonifiedAnimeLongData);

    const youtubeKey = 'AIzaSyAG-LdE_3FYJCgVxh1T6RdWbgx8SCpSuKg';
    youtubeURL = `https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=${youtubeKey}&part=snippet,contentDetails,statistics,status`;

    const fetchedYoutubeData = await fetch(youtubeURL);
    const jsonifiedYoutubeData = await fetchedYoutubeData.json();
    console.log(jsonifiedYoutubeData);

    





    
    // create page that draws all data
    createPage();
}




fetchData();