const { log } = console;

// create new entry
function createCard(el) {
    const newCard = document.createElement('section');
    newCard.innerHTML = `<section class="">
    <div class="avatar-image">
        <img src="${el.image_url}" alt="${el.title}"/>
    </div>
    <div class="avatar-content">
        <h2 class="avatar-header">${el.title}</h2>
        </div>
    </section>`;
    container.appendChild(newCard);
}

// SKELETON ANIMATION use this to move pictures on the home page - UI - DO
function myMove() {
    var elem = document.getElementById('leafy');   
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


function createPage() {
    log('HI');

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