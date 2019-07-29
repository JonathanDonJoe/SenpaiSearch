




    async function fetchData() {
        const search = prompt('Search for: ');
        const test = encodeURI(search)
        const URL = `https://api.jikan.moe/v3/search/anime?q=${test}`
        const fetchedData = await fetch(URL);
        jsonifiedData = await fetchedData.json();
        const malID = jsonifiedData.results[0].mal_id
        const idURL = `https://api.jikan.moe/v3/anime/${malID}/`
        const fetchedData2 = await fetch(idURL);
        jsonifiedData2 = await fetchedData2.json();
        console.log(jsonifiedData2)
    }



    
    fetchData();