const wrapper = document.querySelector('.wrapper'),
    searchInput = wrapper.querySelector("input"),
    synonyms = wrapper.querySelector('.synonyms .list'),
    infoText = wrapper.querySelector('.info-text'),
    volumeIcon = wrapper.querySelector('.word .fa-volume-up'),
    removeIcon = wrapper.querySelector('.search .fa-xmark');
let audio;

// Data Function //
function data(result, word) {
    if (result.title) {
        // If Api returns the message of can't find word //
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. please, try to search for another word.`;
    } else {
        console.log(result); // To view the search results in console. //
        wrapper.classList.add("active");
        let definitions = result[0].meanings[0].definitions[0],
            phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;

        // Particular response data to a particular html element //
        document.querySelector('.word p').innerText = result[0].word;
        document.querySelector('.word span').innerText = phonetics;
        document.querySelector('.meaning span').innerText = definitions.definition;
        document.querySelector('.example span').innerText = definitions.example;
        audio = new Audio("https:" + result[0].phonetics[0].audio);

        if (definitions.synonyms[0] == undefined) {
            synonyms.parentElement.style.display = "none";
        } else {

            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";

            for (let i = 0; i < 5; i++) {
                // Getting only 5 synonyms out of many //
                let tag = `<span onClick = search('${definitions.synonyms[i]}')>${definitions.synonyms[i]},</span>`;
                synonyms.insertAdjacentHTML("beforeend", tag); // Passing all 5 synonyms inside synonyms div. //
            }
        }
    }
};


// Search Synonyms Function //
function search(word) {
    searchInput.value = word;
    fetchApi(word);
    wrapper.classList.remove("active");
};


// Fetch Api Function //
function fetchApi(word) {
    wrapper.classList.remove("active");
    infoText.innerHTML = `searching the meaning of <span>"${word}"</span>`;
    infoText.style.color = "#000";
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    // Fetching Api response //
    fetch(url).then(res => res.json()).then(result => data(result, word));
};

searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter" && e.target.value) {
        fetchApi(e.target.value);
    }

});

volumeIcon.addEventListener("click", () => {
    audio.play();
}); // Volume element has no supported sources in Pakistan. //

removeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");

    infoText.innerHTML = "Type a word and press enter to get meaning, example, pronunciation, and synonyms of that typed word.";
    infoText.style.color = "#9a9a9a";
});