class App {
  data = [];
  constructor() {
    this._loadData();
  }
  async _loadData() {
    const apiResponse = await fetch("http://127.0.0.1:8080/users");
    this.data = await apiResponse.json();
    this._renderUser(this.data);
  }
  _setLocalStorage() {
    localStorage.setItem("data", JSON.stringify(this.data));
  }
  _getLocalStorage() {
    const todoData = JSON.parse(localStorage.getItem("data"));
    if (!todoData) return null;
    this.data = todoData;
    this._renderUser(this.data);
    return todoData;
  }
  _renderUser(dataItems) {
    const tablelist = document.querySelector(".tableContainer");
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
                <th class="userid">${data.userid}</th>
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
    const iconDelete = document.querySelectorAll(".iconDisplay");
    const iconEdit = document.querySelectorAll(".iconEdit");
    const searchBox = document.querySelector(".searchbox");
    const idSortAscending = document.querySelector(".id__sort-Ascending");
    const idSortDescending = document.querySelector(".id__sort-Descending");
    const titleSortAscending = document.querySelector(".title__sort-Ascending");
    const titleSortDescending = document.querySelector(
      ".title__sort-Descending"
    );
    document.getElementById("createUser").onclick = this._createUser.bind(this);
    iconDelete.forEach((i) =>
      i.addEventListener("click", this.renderDelete.bind(this))
    );
    iconEdit.forEach((i) => i.addEventListener("click", this.edit.bind(this)));
    searchBox.addEventListener("input", this._searchData.bind(this));
    idSortAscending.addEventListener("click", this._idsortAscending.bind(this));
    idSortDescending.addEventListener(
      "click",
      this._idsortDescending.bind(this)
    );
    titleSortAscending.addEventListener(
      "click",
      this._titlesortAscending.bind(this)
    );
    titleSortDescending.addEventListener(
      "click",
      this._titlesortDescending.bind(this)
    );
  }
  async renderDelete(e) {
    const idAttribute = e.target.getAttribute("data-id");
    let status = 0;
    const apiData = await fetch(`http://127.0.0.1:8080/delete/${idAttribute}`, {
      method: "DELETE",
    });
    status = (await apiData).status;
    if (status == 200) {
      const index = this.data.findIndex((obj) => {
        return obj.id == idAttribute;
      });
      this.data.splice(index, 1);

      this._renderUser(this.data);
    }
  }
  edit(e) {
    const idAttribute = e.target.getAttribute("data-id");
    let idx;
    this.data.forEach((obj, i) => {
      if (obj.id == idAttribute) {
        idx = i;
      }
    });
    const titleData = document.querySelector(`.title-${idAttribute}`);
    titleData.innerHTML = "";
    const html = `
    <input type="text" class="editform" placeholder="title" />`;
    titleData.insertAdjacentHTML("beforeend", html);
    const editform = document.querySelector(".editform");
    editform.addEventListener("keydown", async (e) => {
      if (e.key !== "Enter") return;
      //   app.manikanta(idx, idAttribute);
      let status = 0;
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
      status = (await apiData).status;
      if (status == 200) {
        this.data[idx].title = editform.value;
        this._renderUser(this.data);
      }
    });
  }
  _searchData(e) {
    let searchData = this.data;
    const target = e.target.value;
    searchData = searchData.filter((user) =>
      user.title.includes(target.toLowerCase())
    );
    this._renderUser(searchData);
  }
  _idsortAscending() {
    function compare(a, b) {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    }
    this.data.sort(compare);
    this._renderUser(this.data);
  }
  _idsortDescending() {
    function compare(a, b) {
      if (a.id > b.id) return -1;
      if (a.id < b.id) return 1;
      return 0;
    }
    this.data.sort(compare);
    this._renderUser(this.data);
  }
  _titlesortAscending() {
    function compare(a, b) {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    }
    this.data.sort(compare);
    this._renderUser(this.data);
  }
  _titlesortDescending() {
    function compare(a, b) {
      if (a.title > b.title) return -1;
      if (a.title < b.title) return 1;
      return 0;
    }
    this.data.sort(compare);
    this._renderUser(this.data);
  }
  _createUser(e) {
    const userHTML = `
        <tr class="heading-row">
            <th class="userid">
                <input type="text" class="create-userid" placeholder="USERID" />
            </th>
           
            <th class="title">
                <input type="text" class="create-title" placeholder="TITLE" />
            </th>
            <th class="completed">
            <form action="#">
                <label for="lang">completed</label>
                <select class="create-completed" id="lang">
                    <option class="option" value="true">true</option>
                    <option class="option" value="false">false</option>
                </select>
            </form>
            </th>
            <th>
                <button type=button class="createSubmit" placeholder="create">Create</button>
            </th>
        </tr>
    
    `;
    const create = document.querySelector(".createNewUser");
    create.insertAdjacentHTML("beforeend", userHTML);
    const completed = document.querySelector(".create-completed");
    const userId = document.querySelector(".create-userid");
    // const id = document.querySelector(".create-id");
    const title = document.querySelector(".create-title");
    const createSubmit = document.querySelector(".createSubmit");
    let newUser;
    createSubmit.addEventListener("click", async (e) => {
      newUser = {
        userid: userId.value,
        // id: this.data.length + 1,
        title: title.value,
        completed: completed.value,
      };
      const apiData = await fetch("http://127.0.0.1:8080/post", {
        method: "POST",
        body: JSON.stringify({
          userid: Number.parseInt(newUser.userid),

          title: newUser.title,
          completed: newUser.completed,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (apiData.status == 200) {
        const apiResponse = await fetch("http://127.0.0.1:8080/users");
        let arr = await apiResponse.json();
        this.data = arr;
        this._renderUser(this.data);
      }
      const createNew = document.querySelector(".createNewUser");
      createNew.innerHTML = "";
    });
  }
}
const app = new App();
