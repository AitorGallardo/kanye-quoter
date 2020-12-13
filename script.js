let reload_quote_icon = document.getElementById('reload') 
const img_container = document.getElementById('img-container')
const kanye_trump_img = document.getElementById('kanye-trump-img') 
const kanye_talks = document.getElementById('kanye-talks')
const quoteText = document.getElementById('quote') 

let isKanyeNotSpeaking = true;
let kanyeImgMovementDirection = 'right';

reload_quote_icon.addEventListener('click',()=>{
    if(isKanyeNotSpeaking){
        isKanyeNotSpeaking = false;
        rotateIcon()
        fadeOutImage(kanye_trump_img)
        fadeInImage(kanye_talks)
        createQuoteSpeechBubble().then((res)=>{
            isKanyeNotSpeaking = res;
            reload_quote_icon.classList.remove('disabled')
        }).catch((res)=>{
            isKanyeNotSpeaking = res;
        })
    }
})

function rotateIcon(){
    if(reload_quote_icon.classList.contains('clicked')){
        reload_quote_icon.classList.remove('clicked')
        reload_quote_icon.offsetHeight; // Trigger reflow
    }
    reload_quote_icon.classList.add('clicked')
    reload_quote_icon.classList.add('disabled')
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
            quoteText.classList.remove('hidden')
            moveKanye(quote.length/10)
           
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


function moveKanye(transitionDuration,direction){

    kanyeImgMovementDirection = direction ? direction:kanyeImgMovementDirection;

    const imageClientBounds = kanye_talks.getBoundingClientRect()

    const viewPort = {width: document.documentElement.clientWidth, height: document.documentElement.clientHeight}
    
    if(kanyeImgMovementDirection === 'right'){
        moveToTheRight(50);
        
        const hasCrossedViewPortRightBounds = imageClientBounds.left > viewPort.width;
        
        
        if(hasCrossedViewPortRightBounds){
            kanyeImgMovementDirection = 'bottom'
            const offsetTop = imageClientBounds.top+imageClientBounds.height;
            kanye_talks.style.top = `-${offsetTop}px`;        
            kanye_talks.style.transform = 'rotate(180deg) translateY(0)'
        }
        
    }else{
        moveToTheBottom(50);
        const hasCrossedViewPortBottomBounds = imageClientBounds.top > viewPort.height;

        console.log(`imageClientBounds`,imageClientBounds);

        if(hasCrossedViewPortBottomBounds){
            kanyeImgMovementDirection = 'right'            
            kanye_talks.style.transform = 'rotate(0deg) translateY(0)'
            kanye_talks.style.top = `initial`;
            const offsetLeft = imageClientBounds.right;
            kanye_talks.style.left = `-${offsetLeft}px`;        
        }
    }


    function moveToTheRight(translateXPercentage = 20){ 
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
    function moveToTheBottom(translateYPercentage = 20){ // negative in y axis cause the image is rotated 

        if(kanye_talks.style.transform){
            const getIndexWithMinusSymbol = kanye_talks.style.transform.indexOf('-');
            const i =  getIndexWithMinusSymbol > -1 ? getIndexWithMinusSymbol+1: kanye_talks.style.transform.indexOf('Y')+2;
            const actualYTranslation = parseInt(kanye_talks.style.transform.slice(i,kanye_talks.style.transform.length-2));
            const newTranslationY = actualYTranslation+translateYPercentage;
            kanye_talks.style.transform = `rotate(180deg) translateY(-${newTranslationY}%)`;
        }else{
            kanye_talks.style.transform = `rotate(180deg) translateY(-20%)`
        }


        kanye_talks.style.transition = `${transitionDuration}s linear`
    }
}

