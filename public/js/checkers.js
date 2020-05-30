var socket = io.connect('http://localhost:3000');
let game = {
    "method": null,
    "gameId": null,
    "myName": null,
    "otherName": null,
    "myScore": 12,
    "otherScore": 12,
    "playturn": '\ud83d\udc2f',
    "index1": -1,
    "index": -1,
    "from": null,
    "play": false,
    "bound": [9, 7],
    "mySymbol": null,
    "otherSymbol": null,
    "player1": null,
    "player2": null,
    "sender": null,
    "message": null
};
let board = document.getElementsByClassName("chessboard")[0];
const btnCreate = document.getElementById("btnCreate");
const btnJoin = document.getElementById("btnJoin");
const txtGameId = document.getElementById("txtGameId");
const divBoard = document.getElementById("checkersBoard");
let playerName = document.getElementById("playerName");

//debugger;
//wiring events

btnCreate.addEventListener("click", e => {
    //  debugger;

    const error = document.getElementById("error");

    if (((playerName.value === "") || (playerName.value === null))) {
        error.style.display = "block";
    } else {
        error.style.display = "none";
        game.myName = playerName.value;
        game.player1 = "tiger";
        game.mySymbol = "\ud83d\udc2f";
        game.player2 = "lion";
        game.otherSymbol = "\ud83e\udd81";
        restart();
        socket.emit("create", game);


    }

})

btnJoin.addEventListener("click", e => {

    gameId = txtGameId.value;
    const error = document.getElementById("error");

    if (((gameId === "") || (gameId === null)) || ((playerName.value === "") || (playerName.value === null))) {
        error.style.display = "block";
    } else {
        error.style.display = "none";
        game.myName = playerName.value;
        game.player1 = "lion";
        game.mySymbol = "\ud83e\udd81";
        game.player2 = "tiger";
        game.otherSymbol = "\ud83d\udc2f";
        game.gameId = gameId;
        game.sender = game.myName;
        socket.emit("join", game);


    }


})

socket.on("message", function(response) {
    //console.log(response);

    //create
    if (response.method === "create") {
        game = response;
        gameId = game.gameId;
        setGameId = document.getElementById("txtGameId");
        setGameId.value = gameId;
        setGameId = document.getElementById("newGameId");
        setGameId.style.display = "block";
        setGameId.innerHTML += gameId;
        setGameId = document.getElementById("gameId");
        setGameId.innerHTML = "Game Id : " + game.gameId;

        console.log("game successfully created with id " + game.gameId);
    }

    if (response.method === "joined") {
        //console.log("joined")
        restart();
        socket.emit("joined", game);
    }

    //if full
    if (response.method === "full") {
        const error = document.getElementById("error");
        error.innerHTML = response.message;
        error.style.display = "block";
    }

    if (response.method === "updateName") {
        if (!(response.sender === game.myName)) {
            //console.log(response + "update");
            game.otherName = response.myName;
            let setGameId = document.getElementById("gameId");
            setGameId.innerHTML = "Game id: " + game.gameId;
            //console.log(game);
            var use = document.createElement("h1");
            let tag = document.getElementById(game.player1);
            use.innerHTML = game.myName;
            tag.appendChild(use);
            tag = document.getElementById(game.player2);
            var use1 = document.createElement("h1");
            use1.innerHTML = game.otherName;
            tag.appendChild(use1);
            tag.classList.add("active");
            game.play = true;
            socket.emit("play", game);
        }
    }



    //if wait
    if (response.method === "winner") {
        let page = document.getElementById("winner");
        page.style.display = "block";
        page = document.getElementById("reset");
        page.style.display = "none";
        page = document.getElementById("gameId");
        page.style.display = "none";
        page = document.getElementById("checkersBoard");
        page.style.display = "none";
        page = document.getElementById("gameScore");
        page.style.display = "none";
        let k = document.getElementById("data");
        //console.log(message);
        k.innerHTML = "";
        // k.classList.add("decoration");
        page = document.getElementById(response.winner);
        //page.classList.remove("success");
        page.style.display = "block";
        page = document.getElementById("loginTable");
        page.style.display = "none";
        setTimeout(waitforsuccess, 5000);
    }
    //game start
    if (response.method === "join") {
        // console.log(response);


        if (response.sender === game.myName) {
            //  console.log("from join" + game);
            var use = document.createElement("h1");
            /* let tag = document.getElementById("tiger");
             tag.classList.add("active");
             use.innerHTML = game.otherName;
             tag.appendChild(use); */
            let tag = document.getElementById("lion");
            use.innerHTML = game.myName;
            tag.appendChild(use);

        } else {
            //debugger;
            game.otherName = response.myName;
            //console.log(game);
            var use = document.createElement("h1");
            let tag = document.getElementById("tiger");
            use.innerHTML = game.myName;
            tag.appendChild(use);
            tag.classList.add("active");
            tag = document.getElementById("lion");
            var use1 = document.createElement("h1");
            use1.innerHTML = game.otherName;
            tag.appendChild(use1);
            game.sender = game.myName;
            socket.emit("updateName", game);
        }
    }
    if (response.method === "playGame") {
        game.play = true;
        // console.log(response);
        //console.log(game);
        // playing



    }

    if (response.method === "updateSelect") {
        let back1 = document.getElementById(response.index1);
        if (back1)
            back1.classList.remove("select");

        let back = document.getElementById(response.index2);
        back.classList.add("select");


    }

    if (response.method === "kill") {

        let back = document.getElementById(response.element1);
        back.innerHTML = "";
        back = document.getElementById(response.element2);
        back.innerHTML = response.animal;
        back = document.getElementById(response.element3);
        back.innerHTML = "";
        response.element2.innerHTML = response.animal;
        back = document.getElementById(response.index1);
        back.classList.remove("select");
        back = document.getElementById(response.remove);
        back.classList.remove("active");
        back = document.getElementById(response.add);
        back.classList.add("active");
        back = document.getElementById(response.score);
        back.innerHTML = response.updatedScore;
        game.myScore = response.updatedScore;
        game.playturn = response.game.playturn;


    }

    if (response.method === "move") {
        debugger;

        let back = document.getElementById(response.element1);
        back.innerHTML = "";
        back = document.getElementById(response.element2);
        back.innerHTML = response.animal;
        back = document.getElementById(response.index1);
        back.classList.remove("select");
        back = document.getElementById(response.remove);
        back.classList.remove("active");
        back = document.getElementById(response.add);
        back.classList.add("active");
        game.playturn = response.game.playturn;


    }

    if (game.play) {
        Array.from(board.children).forEach(function(cell, index) {
            // Add a click listener to each square
            // console.log(cell + index);
            // console.log(cell+"\t"+player1+player2);

            cell.onclick = function(elem) {
                // debugger;
                // Check if a player1 was selected
                if ((game.playturn === game.mySymbol) && (elem.target.innerHTML === game.mySymbol)) {
                    const dataTransferObject = {
                        "method": "updateSelect",
                        "index1": null,
                        "index2": null,
                        "game": game,

                    }
                    dataTransferObject.index1 = game.index1;
                    let back1 = document.getElementById(game.index1);
                    if (back1)
                        back1.classList.remove("select");
                    game.from = elem.target;
                    game.index1 = index;
                    let back = document.getElementById(index);
                    back.classList.add("select");
                    dataTransferObject.index2 = game.index1;
                    socket.emit("updateSelect", dataTransferObject);
                    //console.log(elem.target.innerHTML+"\t"+player1);
                    // Check if a move can be made
                }
                if ((game.playturn === game.mySymbol) && game.from && isLegalMove(game.from, elem.target)) {
                    // Put a player1 within the selected square
                    game.index2 = index;
                    // debugger;
                    //console.log(from);
                    // console.log(elem);
                    // console.log(index1 + "check" + (index2 - index1));
                    var test;
                    const symbol = '\ud83e\udd81';
                    //debugger;
                    if (game.playturn === symbol)
                        test = game.index2 - game.index1;
                    else
                        test = game.index1 - game.index2;

                    if (game.bound.includes(test)) {
                        if (elem.target.innerHTML === game.otherSymbol) {
                            let m = game.index2 - game.index1;
                            m = game.index1 + 2 * m;
                            let x = String(m);
                            //  debugger;
                            var myEle = document.getElementById(x);
                            if (myEle && document.getElementById(x).className.indexOf('yellow') > -1 && myEle.innerHTML === "") {
                                CheckTheWinner(game.mySymbol, x);
                                game.otherScore--;
                                const dataTransferObject = {
                                    "method": "kill",
                                    "game": null,
                                    "element1": game.index1,
                                    "element2": x,
                                    "element3": game.index2,
                                    "index1": game.index1,
                                    "animal": game.mySymbol,
                                    "remove": game.player1,
                                    "add": game.player2,
                                    "score": game.player2 + "Score",
                                    "updatedScore": game.otherScore
                                }
                                let updatedLife = document.getElementById(game.player2 + "Score");
                                updatedLife.innerHTML = game.otherScore;
                                elem.target.innerHTML = "";
                                let back = document.getElementById(game.index1);
                                back.classList.remove("select");
                                myEle.innerHTML = game.mySymbol;
                                // Remove it from the old square
                                game.from.innerHTML = '';
                                // Clear the `from` variable
                                game.from = null;
                                game.playturn = game.otherSymbol;
                                var element = document.getElementById(game.player1);
                                element.classList.remove("active");
                                element = document.getElementById(game.player2);
                                element.classList.add("active");
                                game.index2 = -1;
                                game.index1 = -1;
                                dataTransferObject.game = game;
                                socket.emit("kill", dataTransferObject);
                            }


                        } else {
                            CheckTheWinner(game.mySymbol, index);
                            const dataTransferObject = {
                                "method": "move",
                                "game": null,
                                "index1": game.index1,
                                "element1": game.index1,
                                "element2": index,
                                "animal": game.mySymbol,
                                "remove": game.player1,
                                "add": game.player2
                            }
                            elem.target.innerHTML = game.mySymbol;
                            // Remove it from the old square
                            game.from.innerHTML = '';
                            let back = document.getElementById(game.index1);
                            back.classList.remove("select");
                            // Clear the `from` variable
                            game.from = null;
                            game.playturn = game.otherSymbol;
                            var element = document.getElementById(game.player1);
                            element.classList.remove("active");
                            element = document.getElementById(game.player2);
                            element.classList.add("active");
                            game.index2 = -1;
                            game.index1 = -1;
                            dataTransferObject.game = game;
                            socket.emit("move", dataTransferObject);

                        }

                    }


                }




            }


        });

        function isLegalMove(from, to) {

            let result = Math.abs(from.dataset.row - to.dataset.row) === 1;
            result = result && to.innerHTML !== game.playturn;
            result = result && to.className.indexOf('yellow') > -1;

            // console.log(result);
            return result;
        }

        function CheckTheWinner(player, value) {
            let message = "";
            let iswin;
            if (player === "\ud83d\udc2f") {
                if (value < 7 || game.otherScore < 0) {
                    iswin = true;
                    message = "player1Success";
                }

            } else
            if (player === "\ud83e\udd81") {
                if (value > 55 || game.myScore < 0) {
                    iswin = true;
                    message = "player2Success";
                }

            }
            if (iswin) {
                // debugger;
                const dataTransferObject = {
                    "method": "winner",
                    "game": game,
                    "winner": message
                }
                let page = document.getElementById("winner");
                page.style.display = "block";
                page = document.getElementById("reset");
                page.style.display = "none";
                page = document.getElementById("gameId");
                page.style.display = "none";
                page = document.getElementById("checkersBoard");
                page.style.display = "none";
                page = document.getElementById("gameScore");
                page.style.display = "none";
                let k = document.getElementById("data");
                //console.log(message);
                k.innerHTML = "";
                // k.classList.add("decoration");
                page = document.getElementById(message);
                //page.classList.remove("success");
                page.style.display = "block";
                page = document.getElementById("loginTable");
                page.style.display = "none";
                setTimeout(waitforsuccess, 5000);
                socket.emit("win", dataTransferObject);
            }

        }


    }


})


function restart() {
    let page = document.getElementById("winner");
    page.style.display = "none";
    page = document.getElementById("gamerule");
    page.style.display = "none";
    page = document.getElementById("reset");
    page.style.display = "block";
    page = document.getElementById("gameId");
    page.innerHTML = "Game id : " + game.gameId;
    page.style.display = "block";
    page = document.getElementById("checkersBoard");
    page.style.display = "block";
    page = document.getElementById("gameScore");
    page.style.display = "block";


}

function reset() {
    location.reload();
}

function waitforsuccess() {
    location.reload();
}