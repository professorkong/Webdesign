//var ref = firebase.databaset().ref("MyList");

let readList = (snapshot) => {
    document.getElementById("main-content").innerHTML = "";

    // const currentUser = firebase.auth().currentUser;
    // userListRef.child(currentUser.uid).once("value").then((snapshot) => {
        snapshot.forEach((data) => {
            var id = data.key;
            var title = data.val().title;
            const newDiv = `
            <div class="form-check d-flex justify-content-between">
            <label class="form-check-label">${title}</label>
            <span></span>
            <button type="button" class="btn btn-outline-danger btn-delete" data-id="${id}"> <i class="bi bi-trash3"></i>
            </button>
            </span>
            </div>`;
            const newElement = document.createRange().createContextualFragment(newDiv);
            document.getElementById("main-content").appendChild(newElement);
            document.querySelectorAll("button.btn-delete").forEach((btn) => {
                btn.addEventListener("click", deleteList);
            })
        })
    // })
};


let deleteList = (event) => {
    const id = event.currentTarget.getAttribute('data-id');
    const currentUser = firebase.auth().currentUser;
    userListRef.child(currentUser.uid).child(id).remove(); 
    console.log(`delete on id:${id}`);
    }


let getList = (user) => {
    if (user) {
        userListRef.child(user.uid).on("value",(snapshot) => {
            readList(snapshot);
        });
    }
};

const logoutItems = document.querySelectorAll(".logged-out"); 
const loginItems = document.querySelectorAll(".logged-in");

let setupUI = (user) => {
    if (user) {
        document.querySelector("#user-profile-name").innerHTML = user.email;
        loginItems.forEach((item) => (item.style.display = "inline-block"));
        logoutItems.forEach((item) => (item.style.display = "none"));
    } else {
        loginItems.forEach((item) => (item.style.display = "none")); 
        logoutItems.forEach((item) => (item.style.display = "inline-block"));
    }
};

