const reloadUsersBtn = document.querySelector(".reload-btn");
const addUser = document.querySelector(".add-user");
const removeUser = document.querySelector(".remove-user");
const displayUsers = document.querySelector(".display-users");
const displayUsersbtn = document.querySelector(".display-users-btn");
const removeuserbtn = document.querySelector(".remove-user-btn");
const adduserbtn = document.querySelector(".add-user-btn");
const presentations = document.querySelector(".display-presentations");
const logout = document.querySelector(".logout");
const jokeForm = document.querySelector(".joke-form");
const listAllJokesBtn = document.querySelector(".read-jokes-btn");
const jokeList = document.querySelector(".jokesList");
//Buttons
reloadUsersBtn.onclick = () => {
  window.alert("All data will be reloaded to the intial state! Refresh the page if you want to cancel this action!");
  fetch("/api/reload").then(async (response) => {
    {
      const message = await response.json();
      window.alert(message);
      window.location.reload();
    }
  });
};
logout.onclick = function () {
  fetch("/api/logout")
    .then((_) => window.location.reload())
    .catch((error) => console.log(error));
};
displayUsersbtn.onclick = () => {
  if (displayUsers?.children?.length) {
    displayUsers.innerHTML = "";
    return;
  }

  fetch("/api/userList").then(async (response) => {
    let data = await response.json();
    data = data.sort();
    data.forEach((name) => createUsersList(name));
  });
};

const parseDate = (d) => {
  const options = {  year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(d).toLocaleDateString('en', options)
};

const createJokeDiv = (joke, name, date) => {
  const div = document.createElement("div");
  const innerDiv = document.createElement("div");
  const jokePar = document.createElement("h4");
  const namePar = document.createElement("p");
  const datePar = document.createElement("p");
  const line = document.createElement("hr");
  div.classList.add("single-joke");
  innerDiv.classList.add("innerDiv-joke");
  jokePar.textContent = joke;
  namePar.textContent = name + " - ";
  datePar.textContent = " -- " + parseDate(date);

  div.appendChild(jokePar);
  innerDiv.appendChild(namePar);
  innerDiv.appendChild(datePar);
  div.appendChild(innerDiv);
  div.appendChild(line);
  return div;
};
listAllJokesBtn.onclick = () => {
  if (jokeList?.children?.length) {
    jokeList.innerHTML = "";
    return;
  }
  fetch("/api/getAllJokes").then(async (response) => {
    const jokes = await response.json();

    jokes.forEach((j) => {
      jokeList.appendChild(createJokeDiv(j.joke, j.name, j.date));
    });
  });
};

presentations.onclick = () => {
  if (displayUsers?.children?.length) {
    displayUsers.innerHTML = "";
    return
  }
  fetch("/api/presentations").then(async (response) => {
    const data = await response.json();
    const options = { year: "numeric", month: "long", day: "numeric" };
    data.forEach((unit) => {
      const formatedDate = new Date(unit?.date).toLocaleDateString(undefined, options);
      createUsersList(`${unit?.name} - ${formatedDate}`);
    });
  });
};

adduserbtn.onclick = () => {
  createOrDeleteUser("/api/createUser", "POST", "User Exists", "User is Created", addUser);
};

removeuserbtn.onclick = () => {
  createOrDeleteUser("/api/removeUser", "POST", "User doesn't exists", "User is Removed", removeUser);
};

jokeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const joke = e.target.joke?.value.trim();
  const name = e.target.name.value || "anonymous";
  if (!joke.length) return window.alert("EMPTY JOKES ARE NOT FUNNY!");
  fetch("/api/createJoke", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ joke, name }),
  }).then((_) => {
    window.alert(`You made my backend laugh ${formatName(name)}!!`);
    window.location.reload();
  });
});

//Util
const createUsersList = (name) => {
  const li = document.createElement("li");
  li.textContent = name;
  displayUsers.appendChild(li);
};
const formatName = (name) => {
  if (!name) return "";
  return name[0].toUpperCase() + name.slice(1).toLowerCase();
};

const createOrDeleteUser = (path, method, errorMessage, successMessage, reference) => {
  const name = formatName(reference.value);
  if (!name.length) return;
  fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName: name }),
  })
    .then(async (response) => {
      if (response.status === 422) {
        window.alert(`${response.statusText}: ${errorMessage}`);
        reference.value = "";
        return;
      }
      window.alert(successMessage);
      reference.value = "";
      window.location.reload();
    })
    .catch((error) => {
      console.log("Error", error);
    });
};
