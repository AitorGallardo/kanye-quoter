let reload_quote_icon = document.getElementById('reload')
const img_container = document.getElementById('img-container')
const kanye_trump_img = document.getElementById('kanye-trump-img')
const kanye_talks = document.getElementById('kanye-talks')
const quoteText = document.getElementById('quote')

const main = document.querySelector('main')

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
            const factor = 10;
            let i = 0;
            quoteText.classList.add('hidden')
            moveKanye(quote.length / factor)

            const writeQuoteInterval = setInterval(() => {

                const char = quote.slice(i, i + 1);
                const actualText = quote.slice(0, i + 1);

                createCharOnMouth(char, i).then((res)=>{
                    quoteText.classList.remove('hidden')
                    quoteText.innerText = actualText;
                })

                i++;
                checkClearInterval();

            }, 1000 / factor);

            function checkClearInterval() {
                if (i > quote.length - 1) {
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
/**TODO get point on the right side of the thext =x1 and x0 initial keymouth pos, then translate with animation and fade off on reach the target */
function createCharOnMouth(char, i) {

    const image_kanye_ClientBounds = kanye_talks.getBoundingClientRect()

    const pos0 = {}
    const mouthPosition = getKanye_talksRotationValue() === 0 ? {x: 0.55, y: 0.2} : {x: 0.43, y: 0.75}
    console.log(`rotationvalue`,getKanye_talksRotationValue());


    pos0.x = image_kanye_ClientBounds.left + image_kanye_ClientBounds.width * mouthPosition.x
    pos0.y = image_kanye_ClientBounds.top + image_kanye_ClientBounds.height * mouthPosition.y

    const p = document.createElement('p')
    p.id = `movingChar${i}`
    p.innerText = char;
    p.style.position = 'absolute'
    p.style.left = `${pos0.x}px`
    p.style.top = `${pos0.y}px`
    p.style.zIndex = `99`
    main.appendChild(p)
    const pos1 = getQuoteContainerPosition()

    return createCharAnimation(pos0, pos1, i)
}

function getQuoteContainerPosition() {
    const quoute_clientBounds = quoteText.getBoundingClientRect()

    const pos = {}

    pos.x = quoute_clientBounds.right
    pos.y = quoute_clientBounds.bottom - (quoute_clientBounds.height / 2)

    return pos;
}

function createCharAnimation(pos0, pos1, i) {
    return new Promise((resolve, reject) => {
        const x = pos1.x - pos0.x;
        const y = pos1.y - pos0.y;
        const movingChar = document.getElementById(`movingChar${i}`)
        movingChar.style.transform = `translate(${x}px,${y}px)`
        const animation_duration = 3;
        movingChar.style.transition = `transform ${animation_duration}s linear`
        const transition_duration_promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true)
            }, 1000 * (animation_duration - (animation_duration / 5)));
        })

        transition_duration_promise.then((r) => {
            movingChar.style.opacity = '0'
            movingChar.style.transition = `opacity 1s linear`
            movingChar.remove()
            resolve(true)
        })
    })
}

function moveKanye(transitionDuration, direction) {

    kanyeImgMovementDirection = direction ? direction : kanyeImgMovementDirection;

    const viewPort = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight }

    const imageTranslation = transitionDuration*10;

    if (kanyeImgMovementDirection === 'right') {

        moveToTheRight(imageTranslation).then((res) => {
            setKanye_talksTransition('none')
            const imageClientBounds = kanye_talks.getBoundingClientRect()
            const hasCrossedViewPortRightBounds = imageClientBounds.left > viewPort.width;
            if (hasCrossedViewPortRightBounds) {
                kanyeImgMovementDirection = 'bottom'
                const offsetTop = imageClientBounds.top + imageClientBounds.height;
                kanye_talks.style.top = `-${offsetTop}px`;
                setKanye_talksTransformation(180, 0, undefined)
            }
        })

    } else {

        moveToTheBottom(-imageTranslation).then((res) => {
            setKanye_talksTransition('none')
            const imageClientBounds = kanye_talks.getBoundingClientRect()
            const hasCrossedViewPortBottomBounds = imageClientBounds.top > viewPort.height;

            if (hasCrossedViewPortBottomBounds) {
                kanyeImgMovementDirection = 'right'
                const offsetLeft = imageClientBounds.right;
                kanye_talks.style.left = `-${offsetLeft}px`;
                setKanye_talksTransformation(0, undefined, 0)
                kanye_talks.style.top = `0px`;
            }
        })
    }


    function moveToTheRight(translateXPercentage = 20) {
        return new Promise((resolve, reject) => {
            const actualXTranslation = getKanye_talksTranslationValue('x');
            const newTranslationX = actualXTranslation + translateXPercentage;
            setKanye_talksTransformation(undefined, newTranslationX, undefined)

            setKanye_talksTransition(transitionDuration)
            const timeFactor = 1000;
            setTimeout(() => {
                resolve(transitionDuration);
            }, transitionDuration * timeFactor);
        })
    }
    function moveToTheBottom(translateYPercentage = -20) { // negative in y axis cause the image is rotated 
        return new Promise((resolve, reject) => {
            const actualYTranslation = getKanye_talksTranslationValue('y');
            const newTranslationY = actualYTranslation + translateYPercentage;
            setKanye_talksTransformation(undefined, undefined, newTranslationY)

            setKanye_talksTransition(transitionDuration)
            const timeFactor = 1000;
            setTimeout(() => {
                resolve(transitionDuration);
            }, transitionDuration * timeFactor);
        })

    }

}

function setKanye_talksTransformation(rotate, translateX, translateY) {
    rotate = rotate !== undefined ? rotate : getKanye_talksRotationValue();
    translateX = translateX !== undefined ? translateX : getKanye_talksTranslationValue('x');
    translateY = translateY !== undefined ? translateY : getKanye_talksTranslationValue('y');

    kanye_talks.style.transform = `rotate(${rotate}deg) translateX(${translateX}%) translateY(${translateY}%)`;
}

function setKanye_talksTransition(duration) {
    duration === 'none' ? kanye_talks.style.transition = `none` : kanye_talks.style.transition = `${duration}s linear`
}

function getKanye_talksRotationValue() {
    const rotation = getKanye_talksTransformationPropertiesfArray()[0];
    const startingIndex = rotation.indexOf('(') + 1;
    return parseInt(rotation.slice(startingIndex, rotation.length - 4))
}

function getKanye_talksTranslationValue(type) {
    const arr = getKanye_talksTransformationPropertiesfArray()
    const translation = type === 'x' ? getKanye_talksTransformationPropertiesfArray()[1] : getKanye_talksTransformationPropertiesfArray()[2];
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

function getKanye_talksTransformationPropertiesfArray() {
    if (kanye_talks.style.transform) return kanye_talks.style.transform.split(' ');

    return `rotate(0deg) translateX(0%) translateY(0%)`.split(' ');
}
