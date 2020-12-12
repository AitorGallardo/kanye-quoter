const reloadQuote = document.getElementById('reload') 
const img_container = document.getElementById('img-container')
const kanye_trump_img = document.getElementById('kanye-trump-img') 
const kanye_talks = document.getElementById('kanye-talks')
const quoteText = document.getElementById('quote') 

reloadQuote.addEventListener('click',()=>{
    fadeOutImage(kanye_trump_img)
    fadeInImage(kanye_talks)
    //img_container.classList.toggle('toTheLeft')
    createQuoteSpeechBubble();
})


function fadeInImage(img){
    img.style.animation = `fadeImage linear 1s reverse forwards`
}
function fadeOutImage(img){
    img.style.animation = `fadeImage linear 1s forwards`

}
async function getQuote(){
    const api = 'https://api.kanye.rest' // A free REST API for random Kanye West quotes (Kanye as a Service)
    try{
        const res = await fetch(api);
        const jsonRes = await res.json()
        const quote = jsonRes.quote
        return quote;
    }catch(e){
        console.log(`QuetQuoteERR==>`,e);
    }
}

async function createQuoteSpeechBubble(){
    const quote = await getQuote();
    let i = 1;
    quoteText.classList.toggle('hidden')
    // const writeQuoteInterval = setInterval(() => {        
    //     const text = quote.slice(0, i);
    //     quoteText.innerText = text;
    //     i++;
    //     checkClearInterval();

    // }, 100);

    function checkClearInterval(){
        if(i>quote.length){
            clearInterval(writeQuoteInterval);
        }
    }
}

