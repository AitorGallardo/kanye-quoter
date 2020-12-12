const reloadQuote = document.getElementById('reload') 
const kanye_trump_img = document.getElementById('kanye-trump-img') 
const kanye__talks = document.getElementById('kanye-talks') 

reloadQuote.addEventListener('click',()=>{
    console.log(`reload`,);
    fadeOutImage(kanye_trump_img)
    fadeInImage(kanye__talks)
})


function fadeInImage(img){
    img.style.animation = `fadeImage linear 1s reverse forwards`
    console.log(`saysImage`,img.style);
}
function fadeOutImage(img){
    img.style.animation = `fadeImage linear 1s forwards`

}