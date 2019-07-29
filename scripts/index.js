const { log } = console;

function createPage() {
    log('HI');
    // add code here
}


async function fetchData() {
    // user input for desired anime themes
    const search = prompt('Search for: ');
    // encodes search query into URL
    const encodedSearch = encodeURI(search)
    // input is added to actual url
    const URL = `https://api.jikan.moe/v3/search/anime?q=${encodedSearch}`

    //fetch and JSON
    const fetchedData = await fetch(URL);
    jsonifiedData = await fetchedData.json();
    const malID = jsonifiedData.results[0].mal_id
    const idURL = `https://api.jikan.moe/v3/anime/${malID}/`
    const fetchedData2 = await fetch(idURL);
    jsonifiedData2 = await fetchedData2.json();
    console.log(jsonifiedData2);







    
    // create page that draws all data
    createPage();
}




fetchData();