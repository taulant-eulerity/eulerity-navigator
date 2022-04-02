/* eslint-disable quotes */

/* eslint-disable no-undef */
let innerFunction;
let nameOfWeek;
let names;
let isTest = false
$(document).ready(function () {
    $(".title").lettering();
    $(".button").lettering();
  });

  const initializeNavigator = async () => {
     names = await axios('/api/getLeftUser')
     let randomJoke = await axios('/api/getRandomJoke')
     names = names.data
     randomJoke = randomJoke.data
     nameOfWeek = Math.floor(Math.random() * names.length)
     const DATA = [
      "Loading...",
      ` <div>
          <p>${randomJoke.joke}</p>
          <span>${randomJoke.name}</span>
        </div>
      `,
      names[nameOfWeek],
    ];
    let i = 0;
    let span = document.querySelector(".title");
    let styleString = "style=color:#f1c83c;font-size:150px;";
    innerFunction = (timer) => {
      const interval = setInterval(() => {
        span.innerHTML = `<span ${i === DATA.length - 1 ? styleString : null}>${DATA[i]}</span>`;
        i++;
        animation();
        if (i === DATA.length) {
          clearInterval(interval);
          document.querySelector('.wrapper').style.display = 'block'
        }
      }, timer);
    }
  }

  initializeNavigator()

$('.test-api').click((e) => {
  e.stopPropagation()
  isTest = !isTest
  e.target.style.backgroundColor = isTest ? 'green' : "red"
  e.target.textContent = isTest ? 'TEST ON' : "TEST OFF"
  console.log(isTest)
})
$('.btn').click(async function() {
    this.style.display = 'none'
    innerFunction(4000)
     const winner = names[nameOfWeek]
     if(!isTest) {
      await axios.post('/api/navigator', {'userName': winner})
     }
})
  function animation() {
    var title1 = new TimelineMax();
    title1.to(".button", 0, { visibility: "hidden", opacity: 0 });
    title1.staggerFromTo(
      ".title span",
      0.5,
      { ease: Back.easeOut.config(1.7), opacity: 0, bottom: -80 },
      { ease: Back.easeOut.config(1.7), opacity: 1, bottom: 0 },
      0.05
    );
  }