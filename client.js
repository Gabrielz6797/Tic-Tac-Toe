function jsonRpcRequest(method, params, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://titanic.ecci.ucr.ac.cr/~eb98755/Tic-Tac-Toe/server.php",
    true
  );
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      if (response.error) {
        console.error("JSON-RPC error:", response.error);
      } else {
        callback(response.result);
      }
    }
  };
  var request = {
    jsonrpc: "2.0",
    method: method,
    params: params,
    id: Math.floor(Math.random() * 1000) + 1,
  };
  xhr.send(JSON.stringify(request));
}

// Initializes variables an saves them on the browser to allow for multiple players simultaneously
function startGame() {
  jsonRpcRequest("startGame", {}, function (result) {
    console.log(result);
    sessionStorage.setItem("board", JSON.stringify(result));
    sessionStorage.setItem("start", new Date());
  });
}

function makeMove(x, y) {
  console.log(x, y);
  jsonRpcRequest(
    "makeMove",
    { board: JSON.parse(sessionStorage.getItem("board")), x: x, y: y },
    function (result) {
      console.log(result);
      let board = "";
      let gameOver = false;
      if (
        result[0] == "You win!" ||
        result[0] == "Server wins!" ||
        result[0] == "It's a draw!"
      ) {
        gameOver = true;
        board = result[1];
        sessionStorage.setItem("board", JSON.stringify(board));
      }
      if (board == "") {
        board = result;
        sessionStorage.setItem("board", JSON.stringify(board));
      }
      for (var i = 0; i < board.length; i++) {
        var row = board[i];
        for (var j = 0; j < row.length; j++) {
          if (board[i][j] != "") {
            document.getElementById(i + " " + j).innerHTML = board[i][j];
          }
        }
      }
      if (gameOver) {
        for (var i = 0; i < board.length; i++) {
          var row = board[i];
          for (var j = 0; j < row.length; j++) {
            if (board[i][j] == "") {
              document.getElementById(i + " " + j).innerHTML = "";
            }
          }
        }
        document.getElementById("btn").innerHTML =
          document.getElementById("after-game-btns").innerHTML;
        sessionStorage.setItem("finish", new Date());
        alert(result[0]);
        saveScore();
        sessionStorage.removeItem("board");
        sessionStorage.removeItem("start");
        sessionStorage.removeItem("finish");
      }
    }
  );
}

function saveName(name) {
  if (name.length == 0) {
    name = "Anonymous";
  }
  sessionStorage.setItem("player", name);
}

function saveScore() {
  let start = new Date(sessionStorage.getItem("start"));
  console.log(sessionStorage.getItem("start"));
  console.log(start);
  console.log(
    start.toLocaleString("sv-SE", { timeZone: "America/Costa_Rica" })
  );
  let finish = new Date(sessionStorage.getItem("finish"));
  let seconds = (finish.getTime() - start.getTime()) / 1000;
  jsonRpcRequest(
    "saveScore",
    {
      player: sessionStorage.getItem("player"),
      start: start.toLocaleString("sv-SE", { timeZone: "America/Costa_Rica" }),
      finish: finish.toLocaleString("sv-SE", {
        timeZone: "America/Costa_Rica",
      }),
      seconds: seconds,
    },
    function (result) {
      console.log(result);
    }
  );
}

function getScores() {
  jsonRpcRequest("getScores", {}, function (result) {
    console.log(result);
    document.getElementById("scores").innerHTML = result;
  });
}
