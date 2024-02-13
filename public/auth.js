const signupForm = document.querySelector("#signup-form");
console.dir(signupForm)
signupForm.addEventListener("submit", createUser);

const signupFeedback = document.querySelector("#feedback-msg-signup");
const signupModal = new bootstrap.Modal(document.querySelector("#modal-signup"));

function createUser(event){
    console.log('create user');
    console.dir(event);
    event.preventDefault();
    const email = signupForm["input-email-signup"].value;
    const password = signupForm["input-password-signup"].value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            signupFeedback.style.color = "green";
            signupFeedback.innerHTML = "<i class='bi bi-check-circle-fill'></i> Signup completed.";

            setTimeout(() => {
                signupModal.hide();
            }, 1000);
        })
        .catch((error) => {
            signupFeedback.style.color = "crimson";
            signupFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> ${error.message}`;
            signupForm.reset();
        })
}

const btnCancels = document.querySelectorAll(".btn-cancel");
btnCancels.forEach((btn) => {
    btn.addEventListener("click", () => {
        signupForm.reset(); 
        signupFeedback.innerHTML = "";
    })
});

var isthereuser = false ;

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
         console.log("User :",user);
         isthereuser = true;
        }
        else { 
            console.log("Unavailable User");
        }
        setupUI(user);
    });

const btnLogout = document.querySelector("#btnLogout"); 
btnLogout.addEventListener("click", function() {
    firebase.auth().signOut();
    console.log("Logout completed.");
    isthereuser = false
    })
    
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", loginUser);
    
const loginFeedback = document.querySelector("#feedback-msg-login");
const loginModal = new bootstrap.Modal(document.querySelector("#modal-login"));
    
function loginUser(event) {
    event.preventDefault();
    const email = loginForm["input-email-login"].value;
    const password = loginForm["input-password-login"].value;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
        loginFeedback.style.color = "green";
        loginFeedback.innerHTML = "<i class='bi bi-check-circle-fill'></i> Login succeed!.";
    
            setTimeout(() => {
                loginModal.hide();
            }, 1000);
        })
        .catch((error) => {
            loginFeedback.style.color = "crimson";
            loginFeedback.innerHTML = `<i class='bi bi-exclamation-triangle-fill'></i> ${error.message}`;
            loginForm.reset();
        });
    }
    
