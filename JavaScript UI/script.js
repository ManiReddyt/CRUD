const tablelist = document.querySelector(".tableContainer");
let data;
let editform;
class App {
  #newData = [];
  constructor() {
    this._loadData();
  }
  async _loadData() {
    // console.log(localStorage);
    if (localStorage.data == null || localStorage.data.length == 2) {
      console.log("api call");
      const kanta = await fetch("http://127.0.0.1:8080/users");
      let arr = await kanta.json();
      // arr = arr.slice(0, 10);
      data = arr;
      this._setLocalStorage();
    } else {
      data = JSON.parse(localStorage.data);
    }
    this._getLocalStorage();
  }
  renderDelete(e) {
    const idAttribute = e.target.getAttribute("data-id");
    const object = data.findIndex((obj) => {
      return obj.id == idAttribute;
    });
    data.splice(object, 1);
    let status = 0;
    (async () => {
      console.log("delete api");
      const apiData = await fetch(`http://127.0.0.1:8080/delete/${object}`, {
        method: "DELETE",
      });
      status = (await apiData).status;
    })();
    this._renderUser(data);
    this._setLocalStorage();
  }
  edit(e) {
    const idAttribute = e.target.getAttribute("data-id");
    console.log(idAttribute);
    let idx;
    data.forEach((obj, i) => {
      if (obj.id == idAttribute) {
        idx = i;
      }
    });
    console.log(idx);
    const titleData = document.querySelector(`.title-${idAttribute}`);
    console.log(titleData);
    titleData.innerHTML = "";
    const html = `
    <input type="text" class="editform" placeholder="title" />`;
    titleData.insertAdjacentHTML("beforeend", html);
    editform = document.querySelector(".editform");
    editform.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      app.manikanta(idx, idAttribute);
      // titleData.innerHTML = editform.value;
    });
  }
  manikanta(idx, idAttribute) {
    (async () => {
      const apiData = await fetch(
        `http://127.0.0.1:8080/update/${idAttribute}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            title: editform.value,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
    })();
    data[idx].title = editform.value;
    console.log(data);
    this._renderUser(data);
    this._setLocalStorage();
  }
  _renderUser(dataItems) {
    tablelist.innerHTML = "";
    const headingHTML = `
    <tr class="heading-row">
          <th class="userid">USERID</th>
          <th class="id">ID<iconify-icon class="id__sort-Ascending" icon="uil:sort-amount-down"></iconify-icon>
            <iconify-icon class="id__sort-Descending" icon="uil:sort-amount-up"></th>
          <th class="title">TITLE<iconify-icon class="title__sort-Ascending" icon="uil:sort-amount-down"></iconify-icon>
          <iconify-icon class="title__sort-Descending" icon="uil:sort-amount-up"></th>
          <th>
            DELETE
          </th>
          <th>EDIT</th>
          <th class="completed">COMPLETED</th>
        </tr>`;
    tablelist.insertAdjacentHTML("beforeend", headingHTML);
    dataItems.forEach(function (data) {
      const html = `
        <tbody class="removable">
            <tr >
                <th class="userid">${data.userId}</th>
                <th class="id">${data.id}</th>
                <th class="title-${data.id}">${data.title}</th>
              
                <th>
                <iconify-icon class="iconDisplay" data-id=${data.id} icon="ic:round-delete-outline"></iconify-icon>
                </th>
                <th>
                    <iconify-icon class="iconEdit" data-id="${data.id}" icon="material-symbols:edit"></iconify-icon>
                </th>
                <th class="completed">${data.completed}</th>
            </tr>
        </tbody>`;

      tablelist.insertAdjacentHTML("beforeend", html);
    });
    const iconEvent = document.querySelectorAll(".iconDisplay");
    const iconEdit = document.querySelectorAll(".iconEdit");
    const searchBox = document.querySelector(".searchbox");
    const idSortAscending = document.querySelector(".id__sort-Ascending");
    const idSortDescending = document.querySelector(".id__sort-Descending");
    const titleSortAscending = document.querySelector(".title__sort-Ascending");
    const titleSortDescending = document.querySelector(
      ".title__sort-Descending"
    );
    document.getElementById("createUser").onclick = this._createUser;
    iconEvent.forEach((i) =>
      i.addEventListener("click", this.renderDelete.bind(this))
    );
    iconEdit.forEach((i) => i.addEventListener("click", this.edit.bind(this)));
    searchBox.addEventListener("input", this._searchData);
    idSortAscending.addEventListener("click", this._idsortAscending);
    idSortDescending.addEventListener("click", this._idsortDescending);
    titleSortAscending.addEventListener("click", this._titlesortAscending);
    titleSortDescending.addEventListener("click", this._titlesortDescending);
  }
  _titlesortAscending() {
    //   data=data.sort();
    console.log("title Ascending");
    function compare(a, b) {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    }
    data.sort(compare);
    app._renderUser(data);
  }
  _titlesortDescending() {
    //   data=data.sort();
    console.log("title Descending");
    function compare(a, b) {
      if (a.title > b.title) {
        return -1;
      }
      if (a.title < b.title) {
        return 1;
      }
      return 0;
    }
    data.sort(compare);
    app._renderUser(data);
  }
  _idsortAscending() {
    function compare(a, b) {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    }
    data.sort(compare);
    app._renderUser(data);
  }
  _idsortDescending() {
    function compare(a, b) {
      if (a.id > b.id) {
        return -1;
      }
      if (a.id < b.id) {
        return 1;
      }
      return 0;
    }

    data.sort(compare);
    app._renderUser(data);
  }
  _createUser(e) {
    const userHTML = `
        <tr class="heading-row">
            <th class="userid">
                <input type="text" class="create-userid" placeholder="USERID" />
            </th>
            <th class="id">
                <input type="text" class="create-id" placeholder="ID" />
            </th>
            <th class="title">
                <input type="text" class="create-title" placeholder="TITLE" />
            </th>
            <th class="completed">
                <input type="text" class="create-completed" placeholder="COMPLETED" />
            </th>
        </tr>
    
    `;
    const searchAndCreate = document.querySelector(".createNewUser");
    searchAndCreate.insertAdjacentHTML("beforeend", userHTML);
    const completed = document.querySelector(".create-completed");
    const userId = document.querySelector(".create-userid");
    const id = document.querySelector(".create-id");
    const title = document.querySelector(".create-title");
    let newUser;
    completed.addEventListener("keydown", function (e) {
      console.log(e.key);
      if (e.key !== "Enter") return;
      // const response = fetch("https://jsonplaceholder.typicode.com/todos", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     userId: 1,
      //     id: 12,
      //     title: "foo",
      //     completed: "bar",
      //   }),
      //   headers: {
      //     "Content-type": "application/json; charset=UTF-8",
      //   },
      // });
      // console.log(response.status);
      newUser = {
        userid: userId.value,
        id: id.value,
        title: title.value,
        completed: completed.value,
      };
      (async () => {
        const apiData = await fetch("http://127.0.0.1:8080/post", {
          method: "POST",
          body: JSON.stringify({
            userID: newUser.userId,
            id: newUser.id,
            title: newUser.title,
            completed: newUser.completed,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
      })();
      data.push(newUser);
      app._renderUser(data);
      app._setLocalStorage();
      //   console.log(newUser);
      const createNew = document.querySelector(".createNewUser");
      createNew.innerHTML = "";
    });
  }
  _searchData(e) {
    let searchData = data;
    const target = e.target.value;
    searchData = searchData.filter((user) =>
      user.title.includes(target.toLowerCase())
    );
    app._renderUser(searchData);
  }
  _setLocalStorage() {
    localStorage.setItem("data", JSON.stringify(data));
  }
  _getLocalStorage() {
    const todoData = JSON.parse(localStorage.getItem("data"));
    if (!todoData) return null;
    data = todoData;
    this._renderUser(data);
    return todoData;
  }
}
const app = new App();

// console.log(data);
