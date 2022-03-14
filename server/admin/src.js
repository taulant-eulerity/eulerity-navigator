const reloadUsersBtn = document.querySelector(".reload-btn");
const addUser = document.querySelector(".add-user");
const removeUser = document.querySelector(".remove-user");
const displayUsers = document.querySelector(".display-users");
const displayUsersbtn = document.querySelector(".display-users-btn");
const removeuserbtn = document.querySelector(".remove-user-btn");
const adduserbtn = document.querySelector(".add-user-btn");
const presentations = document.querySelector(".display-presentations");
const logout = document.querySelector(".logout");

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
logout.onclick = function() {
  fetch("/api/logout")
  .then(_ => window.location.reload())
  .catch(error => console.log(error))
}
displayUsersbtn.onclick = () => {
  if (displayUsers?.children?.length) {
    displayUsers.innerHTML = "";
    return;
  }

  fetch("/api/userList").then(async (response) => {
    const data = await response.json();
    data.forEach((name) => createUsersList(name));
  });
};

presentations.onclick = () => {
  if (displayUsers?.children?.length) {
    displayUsers.innerHTML = "";
  }
  fetch("/api/presentations").then(async (response) => {
    const data = await response.json();
  
    const options = { year: "numeric", month: "long", day: "numeric" };
    data.forEach(unit => {
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

// const onDelayApiCalls = (options) => {
//     const delay = (ms) => new Promise(resolve => setTimeout(resolve.bind(null), ms))
//     let counter = 0
//     const recursiveCalls = async () => {
//         if(counter >= options.data) return options.onFinish()

//         if(options.delay > 0) await delay(options.delay)
//         const response = await fetchData(options.data[counter])
//         options.onLoad(response)
//         counter += 1
//         recursiveCalls()
//     }
//     recursiveCalls()
// }

// const fetchData = (data) => new Promise(resolve => {
//     setTimeout(() => {
//         resolve(data + 100)
//     },1000)
// })

// const onLoad = (response) => {
//     console.log('this is the response', response)
// }

// const onFinish = () => {
//     console.log('finished')
// }
// let options = {fetchData,  onLoad, onFinish, data: [1,2,3,4,5,6], delay: 300, retry}
// onDelayApiCalls(options)
