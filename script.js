let reload_quote_icon = document.getElementById('reload')
const img_container = document.getElementById('img-container')
const kanye_trump_img = document.getElementById('kanye-trump-img')
const kanye_talks = document.getElementById('kanye-talks')
const quoteText = document.getElementById('quote')

let isKanyeNotSpeaking = true;
let kanyeImgMovementDirection = 'right';

reload_quote_icon.addEventListener('click', () => {
    if (isKanyeNotSpeaking) {
        isKanyeNotSpeaking = false;
        rotateIcon()
        fadeOutImage(kanye_trump_img)
        fadeInImage(kanye_talks)
        createQuoteSpeechBubble().then((res) => {
            isKanyeNotSpeaking = res;
            reload_quote_icon.classList.remove('disabled')
        }).catch((res) => {
            isKanyeNotSpeaking = res;
        })
    }
})

function rotateIcon() {
    if (reload_quote_icon.classList.contains('clicked')) {
        reload_quote_icon.classList.remove('clicked')
        reload_quote_icon.offsetHeight; // Trigger reflow
    }
    reload_quote_icon.classList.add('clicked')
    reload_quote_icon.classList.add('disabled')
}

function fadeInImage(img) {
    img.style.animation = `fadeImage linear 1s reverse forwards`
}
function fadeOutImage(img) {
    img.style.animation = `fadeImage linear 1s forwards`

}
async function getQuote() {
    const api = 'https://api.kanye.rest' // A free REST API for random Kanye West quotes (Kanye as a Service)
    try {
        const res = await fetch(api);
        const jsonRes = await res.json()
        const quote = jsonRes.quote
        return quote;
    } catch (e) {
        console.error(`getQuoteERR==>`, e);
        throw e;
    }
}

function createQuoteSpeechBubble() {
    return new Promise(async (resolve, reject) => {
        try {
            const quote = await getQuote();
            let i = 1;
            quoteText.classList.remove('hidden')
            moveKanye(quote.length / 10)

            const writeQuoteInterval = setInterval(() => {
                const text = quote.slice(0, i);
                quoteText.innerText = text;
                i++;
                checkClearInterval();

            }, 100);

            function checkClearInterval() {
                if (i > quote.length) {
                    clearInterval(writeQuoteInterval);
                    resolve(true);
                }
            }
        } catch (e) {
            console.log(`bubblefunctionERRO`, e);
            reject(false);
        }
    })
}


function moveKanye(transitionDuration, direction) {

    kanyeImgMovementDirection = direction ? direction : kanyeImgMovementDirection;

    const imageClientBounds = kanye_talks.getBoundingClientRect()

    const viewPort = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight }

    if (kanyeImgMovementDirection === 'right') {

        moveToTheRight(50).then((res)=>{
            const imageClientBounds = kanye_talks.getBoundingClientRect()
            const hasCrossedViewPortRightBounds = imageClientBounds.left > viewPort.width;
            
            if (hasCrossedViewPortRightBounds) {
                kanyeImgMovementDirection = 'bottom'
                const offsetTop = imageClientBounds.top + imageClientBounds.height;
                kanye_talks.style.top = `-${offsetTop}px`;
                setKanye_talks_transformation(180,0,undefined)          
            }
        })
        
    } else {

        moveToTheBottom(-50).then((res)=>{
            const imageClientBounds = kanye_talks.getBoundingClientRect()
            const hasCrossedViewPortBottomBounds = imageClientBounds.top > viewPort.height;
            
            if (hasCrossedViewPortBottomBounds) {
                kanyeImgMovementDirection = 'right'
                const offsetLeft = imageClientBounds.right;
                kanye_talks.style.left = `-${offsetLeft}px`;
                setKanye_talks_transformation(360,undefined,0)          
            }
        })
    }


    function moveToTheRight(translateXPercentage = 20) {
        return new Promise((resolve,reject)=>{
            const actualXTranslation = getTranslationValue('x');
            const newTranslationX = actualXTranslation + translateXPercentage;
            setKanye_talks_transformation(undefined, newTranslationX, undefined)
            
            kanye_talks.style.transition = `${transitionDuration}s linear`
            const timeFactor = 1000;
            setTimeout(() => {
                resolve(transitionDuration);        
            }, transitionDuration*timeFactor);
        })
    }
    function moveToTheBottom(translateYPercentage = -20) { // negative in y axis cause the image is rotated 
        return new Promise((resolve,reject)=>{
        const actualYTranslation = getTranslationValue('y');
        const newTranslationY = actualYTranslation + translateYPercentage;
        setKanye_talks_transformation(undefined,undefined,newTranslationY)

        kanye_talks.style.transition = `${transitionDuration}s linear`
        const timeFactor = 1000;
        setTimeout(() => {
            resolve(transitionDuration);        
        }, transitionDuration*timeFactor);
        })
        
    }

    function setKanye_talks_transformation(rotate, translateX, translateY) {
        rotate = rotate !== undefined ? rotate : getRotationValue();
        translateX = translateX !== undefined ? translateX : getRotationValue('x');
        translateY = translateY !== undefined ? translateY : getRotationValue('y');

        kanye_talks.style.transform = `rotate(${rotate}deg) translateX(${translateX}%) translateY(${translateY}%)`;
    }

    function getRotationValue() {
        const rotation = getTransformationPropertiesfArray()[0];
        const startingIndex = rotation.indexOf('(') + 1;
        return rotation.slice(startingIndex, rotation.length - 4)
    }

    function getTranslationValue(type) {
        const arr = getTransformationPropertiesfArray()
        const translation = type === 'x' ? getTransformationPropertiesfArray()[1] : getTransformationPropertiesfArray()[2];
        const negativeValue = translation.indexOf('-');
        let value = '0';
        if (negativeValue > -1) {
            const startingIndex = negativeValue + 1;
            value = `-` + translation.slice(startingIndex, translation.length - 2)
        } else {
            const startingIndex = translation.indexOf('(') + 1;
            value = translation.slice(startingIndex, translation.length - 2)
        }

        return parseInt(value);
    }

    function getTransformationPropertiesfArray() {
        if(kanye_talks.style.transform) return kanye_talks.style.transform.split(' ');

        return `rotate(0deg) translateX(0%) translateY(0%)`.split(' ');
    }
}

