const gameRef = firebase.database().ref("Game");

const btnJoins = document.querySelectorAll(".btn-join");
btnJoins.forEach((btnJoin) => btnJoin.addEventListener("click", joinGame));

function joinGame(event) {
    const currentUser = firebase.auth().currentUser;
    console.log("[Join] Current user", currentUser);
    if (currentUser) {
        const btnJoinID = event.currentTarget.getAttribute("id");
        const player = btnJoinID[btnJoinID.length - 1];
        
        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if (playerForm.value == "") {
            // Add Player into database 
            let tmpID = `user-${player}-id`; 
            let tmpEmail = `user-${player}-email`;
            gameRef.child("game-1").update({
                [tmpID]: currentUser.uid,
                [tmpEmail]: currentUser.email
            });
            console.log(currentUser.email + " added.");
            event.currentTarget.disabled = true;
        }
    }
}

gameRef.on("value", (snapshot) => {
    getGameInfo(snapshot);
})
function getGameInfo(snapshot) {
    document.getElementById("inputPlayer-x").value = "";
    document.getElementById("inputPlayer-o").value = "";
    const currentUser = firebase.auth().currentUser;
        snapshot.forEach((data) => {
            const gameInfo = data.val();
            Object.keys(gameInfo).forEach((key) => {
                switch (key) {
                    case "user-x-email":
                        document.getElementById("inputPlayer-x").value = gameInfo[key];
                        document.querySelector("#btnJoin-x").disabled = true;
                        if (currentUser.email == gameInfo[key]) {
                            document.querySelector("#btnJoin-o").disabled = true;
                        }
                        break;
                    case "user-o-email":
                        document.getElementById("inputPlayer-o").value = gameInfo[key];
                        document.querySelector("#btnJoin-o").disabled = true;
                        if (currentUser.email == gameInfo[key]) {
                            document.querySelector("#btnJoin-x").disabled = true;
                        }
                        break;
                }
            })
        })
}

const btnCancelJoins = document.querySelectorAll(".btn-cancel-join-game");
btnCancelJoins.forEach((btnCancel) => btnCancel.addEventListener("click", cancelJoin));

function cancelJoin(event) {
    const currentUser = firebase.auth().currentUser;
    console.log("[Cancel] Current user:", currentUser);
    if (currentUser) {
        const btnCancelID = event.currentTarget.getAttribute("id");
        const player = btnCancelID[btnCancelID.length - 1];
        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if (playerForm.value && playerForm.value === currentUser.email) {
            // Delete player from database
            let tmpID = `user-${player}-id`;
            let tmpEmail = `user-${player}-email`;
            gameRef.child("game-1").child(tmpID).remove();
            gameRef.child("game-1").child(tmpEmail).remove();
            console.log(`delete on id: ${currentUser.uid}`)
            document.querySelector(`#btnJoin-${player}`).disabled = false;
            if (document.querySelector(`#inputPlayer-${player == "o" ? "x" : "o"}`).value == ""){
                document.querySelector(`#btnJoin-o`).disabled = false;
                document.querySelector(`#btnJoin-x`).disabled = false;
            }
        }
    }
}

let gameStarted = false; // Variable to track whether the game has started

const btnStart = document.getElementById("btnStartGame");
btnStart.addEventListener("click", startGame)

function startGame(event) {
    if (!gameStarted) {
        // Check if both players have joined
        const playerX = document.getElementById("inputPlayer-x").value.trim();
        const playerO = document.getElementById("inputPlayer-o").value.trim();

        if (playerX !== "" && playerO !== "") {
            // Both players have joined, start the game
            console.log("Game started!");
            gameStarted = true;

            // Disable START GAME button
            document.getElementById("btnStartGame").disabled = true;
            document.querySelector("#btnCancel-x").disabled = true;
            document.querySelector("#btnCancel-o").disabled = true;

            document.getElementById("btnTerminateGame").disabled = false;
            
            // Attach event listeners for the game board
            const cells = document.querySelectorAll(".cell");
            cells.forEach(cell => cell.addEventListener("click", handleCellClick));
        } else {
            console.log("Both players must join before starting the game.");
        }
    }
}

const btnEnd = document.getElementById("btnTerminateGame");
btnEnd.addEventListener("click", endGame)

function endGame(event) {
    if (gameStarted) {
        // Game is in progress
        console.log("Game ended!");

        // Disable END GAME button
        document.getElementById("btnTerminateGame").disabled = true;
        document.querySelector("#btnCancel-x").disabled = false;
        document.querySelector("#btnCancel-o").disabled = false;
        document.getElementById("btnStartGame").disabled = false;

        // Remove event listeners from the game board
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => cell.removeEventListener("click", handleCellClick));

        gameStarted = false; // Reset game state
    }
}

for(let i = 1; i < 4; i++){
    for(let j = 1; j < 4; j++){
        document.getElementById(`row-${i}-col-${j}`).addEventListener("click", handleCellClick)
    }
}

function handleCellClick(event) {
    // Check if the game is in progress
    if (gameStarted) {
        const cellId = event.currentTarget.id;
        
        // Log the cell ID to the console
        console.log(cellId);
    }
}