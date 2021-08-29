const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users";
const users = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-2">
    <div class="mb-2">
      <div class="card">
        <img src="${item.avatar
      }" class="card-img-top" alt="User Photo" data-toggle="modal" data-target="#user-modal" data-id='${item.id
      }'>
        <div class="card-body">
          <h5 class="card-title">${item.name + " " + item.surname}</h5>
        </div>
        </div>
      </div>
    </div>
  </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

function showUserModal(id) {
  // get elements
  const modalName = document.querySelector("#user-modal-name");
  const modalImage = document.querySelector("#user-modal-image");
  const modalemail = document.querySelector("#user-modal-email");
  const modalgender = document.querySelector("#user-modal-gender");
  const modalage = document.querySelector("#user-modal-age");
  const modalregion = document.querySelector("#user-modal-region");
  const modalbirthday = document.querySelector("#user-modal-birthday");

  // send request to show api
  axios.get(INDEX_URL + "/" + id).then((response) => {
    console.log(response.data);
    const data = response.data;

    // insert data into modal ui
    modalName.innerText = data.name + " " + data.surname;
    modalemail.innerText = "Email: " + data.email;
    modalgender.innerText = "Gender: " + data.gender;
    modalage.innerText = "Age: " + data.age;
    modalregion.innerText = "Region: " + data.region;
    modalbirthday.innerText = "Birthday: " + data.birthday;
    modalImage.innerHTML = `<img src="${data.avatar}" alt="user-image" class="img-fluid">`;
  });
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".card-img-top")) {
    showUserModal(event.target.dataset.id);
  }
});

//listen to search form
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {

  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  let filteredUsers = [] //搜尋清單

  filteredUsers = users.filter((user) =>
    (user.name + user.surname).toLowerCase().includes(keyword)
  )

  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的用戶`)
  }
  renderUserList(filteredUsers)
})

axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results);
    renderUserList(users);
  })
  .catch((err) => console.log(err));
