


const para  = document.querySelector('.item');
const btn  = document.querySelector('.btn');
const namesWrapper = document.querySelector('.carousel-wrapper')
const choreWrapper = document.querySelector('.carousel-wrapper2')
const carousel = document.querySelector('.carousel')
const nextPair = document.querySelector('.next-pair')
const picked = document.querySelector('.picked')
const submit = document.querySelector('.submit')
const image = document.querySelector('.image')

//GLOBALS
let names;
let chores;
let loading = true
let callCounter = 0
let firstCall = true
let selected = {name: "", chore:""}
let allSelected = []


const fetchData = async () => {
    let namesJson = await fetch('/api/getLeftUser')
    names = await namesJson.json()
    loading = false
    //Check this latter
    if(!names.length || !chores.length)  nextPair.disabled = true
}
fetchData()



const winner = "http://codeskulptor-demos.commondatastorage.googleapis.com/descent/gotitem.mp3"
const clic = "http://codeskulptor-demos.commondatastorage.googleapis.com/descent/spring.mp3"
const playSound = (url) => {
    var a = new Audio(url);
    return a.play()
}


const startCarousel = (className, speed, items, wrapp, cb) => {
    nextPair.disabled = true;
    // nextPair.textContent = 'Next'
    let i = 0
    let counter = 0
    let vv = speed
    let interval = setInterval(() => {
        const slider = document.querySelector('.'+className)
        counter+=vv
        slider.style.transform =  `translateY(${counter}px)`
        if(vv <= 20) {
                slider.style.transition = 'all 0.5s'
                slider.style.transform = `translateY(${-18}px)`
                clearInterval(interval)
                callCounter++
                cb(slider.children[0].textContent)
                if(callCounter === 1) {
                    image.classList.remove('spin')
                    setTimeout(() => {
                        pickedPair(() => {
                            nextPair.disabled = false
                            callCounter = 0
                        })
                    },500)
                }
        }
        if(counter > 50){
            playSound(clic)
                 i++
                 wrapp.removeChild(slider)
                createDiv(items[i % items.length], className, wrapp)
                counter = -100
                vv -= 3
        }
    },100)
    return interval
}



nextPair.onclick = function() {
    //shuffleArray
    image.classList.add('spin')
    startCarousel('carousel-slider', 55, shuffleArray(names), namesWrapper, getNames.bind(null, 'name'))
    //startCarousel('carousel-slider2', 55, shuffleArray(chores), choreWrapper, getNames.bind(null, 'chore'))
}

submit.onclick = async function() {
    // await axios.post("/api/weeklyChores", {weeklyChores: JSON.stringify(allSelected)})
    // setTimeout(() => {
    //     window.location ='/admin'
    // },2000)
    await axios.post('/api/navigator', {'userName': selected.name})
}

function getNames  (field, item) {
    selected[field] = item
}

const pickedPair = (cb) => {
    // createPair(selected.name, selected.chore)
    // allSelected.push([selected.name, selected.chore])
    // names = names.filter(n => n !== selected.name)
    // chores = chores.filter(n => n !== selected.chore)
    playSound(winner)

        nextPair.style.display = 'none'
        submit.style.display = 'block'
        return
    
    cb()
}


const createDiv = (name, className, wrapp) => {
    const div = document.createElement('div')
    const p = document.createElement('p')
    p.classList.add('item')
    div.style.transform = `translateY(${-100}px)`
    p.textContent = name
    div.classList.add(className)
    div.appendChild(p)
    wrapp.appendChild(div)
}
const shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}



const createPair = (name, chore) => {
    const parent = document.createElement('div')
    const child1 = document.createElement('div')
    const child2 = document.createElement('div')
    parent.classList.add('parent')
    child1.classList.add('pair-item')
    child1.classList.add('child1')
    child2.classList.add('pair-item')
    child1.textContent = name
    child2.textContent = chore

    parent.appendChild(child1)
    parent.appendChild(child2)
    picked.appendChild(parent)
}






