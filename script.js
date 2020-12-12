const reloadQuote = document.getElementById('reload') 
const kanye_trump_img = document.getElementById('kanye-trump-img') 

reloadQuote.addEventListener('click',()=>{
    console.log(`reload`,);
    fadeImage(kanye_trump_img)
})


function fadeImage(img){
    img.style.animation = `fadeImage linear 1s forwards`
}