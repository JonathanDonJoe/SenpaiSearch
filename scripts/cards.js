// create new entry
function createCard(el) {
    const newCard = document.createElement('section');
    newCard.innerHTML =
    `
    <div class="card">
        <div class="card-image">
            <img src="${el.image_url}" alt="${el.title}"/>
        </div>
        <div class="card-content">

            <h1 class="card-header">${el.title}</h1>
        
        </div>
    </div>
    `;
    getElementById('.card-container').appendChild(newCard);
}

createCard();



// SKELETON ANIMATION use this to move pictures on the home page - UI - DO
function myMove() {
    let elem = document.getElementById('leafy');   
    let pos = 0;
    let id = setInterval(frame, 10);
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
// SKELETON ANIMATION END



// Event handler for the home button
document.querySelector('#search-button').addEventListener('click', function(e){

    const firstPage = document.querySelector('inner-main-container')
    const secondPage = document.querySelector('second-page-container')


    console.log(screenWidth);
    // Check if search bar is empty
    if (document.querySelector('#search-bar').value === ''){
        // Alert if the input is invalid/empty
        alert('Don\'t forget to enter something!');
        secondPage.classList.remove('hidden');
        firstPage.classList.add('hidden');
    } else {
        // If input is valid continue with search and 
        e.preventDefault();
        createCard();
    }
    
    // toggle(secondPage);
    if (secondPage.classList.contains('hidden')) {
        secondPage.classList.remove('hidden');
        firstPage.classList.add('hidden');
    } else {
        secondPage.classList.add('hidden');
        firstPage.classList.remove('hidden');
    } 
});


// Event handler for the Home text
document.querySelector('#home-click').addEventListener('click', function(e){
    e.preventDefault();
    // toggle(secondPage);
    if (firstPage.classList.contains('hidden')) {
        firstPage.classList.remove('hidden');
        secondPage.classList.add('hidden');
    }     
});