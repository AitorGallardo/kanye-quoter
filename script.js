let reloadQuote = document.getElementById('reload') 
const img_container = document.getElementById('img-container')
const kanye_trump_img = document.getElementById('kanye-trump-img') 
const kanye_talks = document.getElementById('kanye-talks')
const quoteText = document.getElementById('quote') 

let isKanyeNotSpeaking = true;

reloadQuote.addEventListener('click',()=>{
    if(isKanyeNotSpeaking){
        isKanyeNotSpeaking = false;
        rotateIcon()
        fadeOutImage(kanye_trump_img)
        fadeInImage(kanye_talks)
        createQuoteSpeechBubble().then((res)=>{
            console.log(`res`,res);
            isKanyeNotSpeaking = res;
            reloadQuote.classList.remove('disabled')
        }).catch((res)=>{
            isKanyeNotSpeaking = res;
        })
    }
})

function rotateIcon(){
    if(reloadQuote.classList.contains('clicked')){
        reloadQuote.classList.remove('clicked')
        reloadQuote.offsetHeight;
    }
    reloadQuote.classList.add('clicked')
    reloadQuote.classList.add('disabled')
}

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
        console.error(`getQuoteERR==>`,e);
        throw e;
    }
}

function createQuoteSpeechBubble(){
    return new Promise(async(resolve,reject)=>{
        try{
        const quote = await getQuote();
        let i = 1;
            quoteText.classList.toggle('hidden')
            moveKanye('right', quote.length/10)
           
                const writeQuoteInterval = setInterval(() => {        
                    const text = quote.slice(0, i);
                    quoteText.innerText = text;
                    i++;
                    checkClearInterval();
            
                }, 100);
            
                function checkClearInterval(){
                    if(i>quote.length){
                        clearInterval(writeQuoteInterval);
                        resolve(true);
                    }
                }
        }catch(e){
            console.log(`bubblefunctionERRO`,e);
            reject(false);
        }
    })
}


function moveKanye(direction,transitionDuration){

    if(direction==='right'){
        moveToTheRight();
    }else{
        moveToTheBottom();
    }
    function moveToTheRight(){
        let translateXPercentage = 20;
        if(kanye_talks.style.transform){
            const i = kanye_talks.style.transform.indexOf('(')+1;
            const actualXTranslation = parseInt(kanye_talks.style.transform.slice(i,kanye_talks.style.transform.length-2));
            const newTranslationX = actualXTranslation+translateXPercentage;
            kanye_talks.style.transform = `translateX(${newTranslationX}%)`;
        }else{
            kanye_talks.style.transform = `translateX(20%)`
        }
        kanye_talks.style.transition = `${transitionDuration}s linear`
    }
    function moveToTheBottom(){}
}

