/* eslint-disable quotes */

/* eslint-disable no-undef */

let innerFunction;
let nameOfWeek;
let names;
$(document).ready(function () {
    $(".title").lettering();
    $(".button").lettering();
  });
  axios.get('/api/getLeftUser').then(response => {
    names = response.data   
    nameOfWeek = Math.floor(Math.random() * names.length)

  const DATA = [
    "Loading...",
    "Saving the joke for PI day",
    "And the lucky one is 🥁 🥁 🥁 🥁",
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
})


$('.btn').click(async function() {
    this.style.display = 'none'
    innerFunction(1500)
     const winner = names[nameOfWeek]
     await axios.post('/api/navigator', {'userName': winner})
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

  