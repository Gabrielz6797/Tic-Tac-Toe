<?php
include 'db.php';

function startGame()
{
    session_start();

    // Initialize the game board
    $board = array(
        array('', '', ''),
        array('', '', ''),
        array('', '', '')
    );

    return $board;
}

function makeMove($board, $x, $y)
{
    session_start();

    // Check if the move is valid
    if ($x < 0 || $x > 2 || $y < 0 || $y > 2) {
        return "Invalid move. Please select a valid cell.";
    }

    // Check if the selected cell is empty
    if ($board[$x][$y] !== '') {
        return "Invalid move. Cell already occupied.";
    }

    // Update the game board
    $board[$x][$y] = 'X';

    // Check if the player wins
    if (checkWin($board, 'X')) {
        return array("You win!", $board);
    }

    // Check if the game is a draw
    if (isBoardFull($board)) {
        return array("It's a draw!", $board);
    }

    // Let the server make its move
    $board = makeServerMove($board);

    // Check if the server wins
    if (checkWin($board, 'O')) {
        return array("Server wins!", $board);
    }

    // Return the updated game board
    return $board;
}

function makeServerMove($board)
{
    // Find an empty cell on the board
    $emptyCells = array();

    foreach ($board as $x => $row) {
        foreach ($row as $y => $cell) {
            if ($cell === '') {
                $emptyCells[] = array($x, $y);
            }
        }
    }

    // Randomly select an empty cell
    $randomCell = $emptyCells[array_rand($emptyCells)];

    // Update the game board
    $board[$randomCell[0]][$randomCell[1]] = 'O';

    // Return the updated game board
    return $board;
}

function checkWin($board, $player)
{
    // Check rows
    for ($i = 0; $i < 3; $i++) {
        if ($board[$i][0] === $player && $board[$i][1] === $player && $board[$i][2] === $player) {
            return true;
        }
    }

    // Check columns
    for ($i = 0; $i < 3; $i++) {
        if ($board[0][$i] === $player && $board[1][$i] === $player && $board[2][$i] === $player) {
            return true;
        }
    }

    // Check diagonals
    if (
        ($board[0][0] === $player && $board[1][1] === $player && $board[2][2] === $player) ||
        ($board[0][2] === $player && $board[1][1] === $player && $board[2][0] === $player)
    ) {
        return true;
    }

    return false;
}

function isBoardFull($board)
{
    foreach ($board as $row) {
        foreach ($row as $cell) {
            if ($cell === '') {
                return false;
            }
        }
    }

    return true;
}

function saveScore($player, $start, $finish, $seconds)
{
    $con = OpenCon();

    $query = "
        INSERT INTO `tic-tac-toe` (`player`, `start`,
        `finish`, `seconds`) VALUES ('$player', 
        '$start', '$finish', $seconds);
    ";

    if (!$con->query($query)) {
        printf("Error message: %s\n", $con->error);
    }

    CloseCon($con);

    return true;
}

function getScores()
{
    $con = OpenCon();

    // Get 10 best scores
    $query = "
        SELECT * FROM `tic-tac-toe` ORDER BY `seconds` ASC, `start` ASC LIMIT 10;
    ";

    $html = "<table><tr><th>Player's name</th><th>Start date</th><th>Finish date</th><th>Time (Seconds)</th></tr>";

    // Format database data to show on html
    if ($result = $con->query($query)) {
        while ($row = $result->fetch_assoc()) {
            $html .= "<tr><td>" . $row["player"] . "</td><td>" . $row["start"] . "</td><td>" . $row["finish"] . "</td><td>" . $row["seconds"] . "</td></tr>";
        }
        $html .= "</table>";
        return $html;
    }

    return "There's no data to show";
}

// Handle JSON-RPC requests
$request = json_decode(file_get_contents('php://input'), true);

if (isset($request['method'])) {
    $method = $request['method'];
    $params = $request['params'];

    switch ($method) {
        case 'startGame':
            $response = startGame();
            break;
        case 'makeMove':
            $response = makeMove($params['board'], $params['x'], $params['y']);
            break;
        case 'saveScore':
            $response = saveScore($params['player'], $params['start'], $params['finish'], $params['seconds']);
            break;
        case 'getScores':
            $response = getScores();
            break;
        default:
            $response = "Invalid method";
    }

    header('Content-Type: application/json');
    echo json_encode(
        array(
            'jsonrpc' => '2.0',
            'result' => $response,
            'id' => $request['id']
        )
    );
}
?>