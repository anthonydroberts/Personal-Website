var board = [[0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0]];
var gameType = 0; //game type refers to 0 for standard C4, or 1 for alternate dropping version
var playType = 0; //0 for human vs human, 1 for human vs ai, 2 for ai vs ai
var playerTurn = 1; //1 for player 1, or 2 for player 2
var depthLimit = 0;
var statisticsString = "";
var p1Wins = 0; var p2Wins = 0;
var gameOverFlag = 0; //flag for whether the game has ended, 0 means it is active, 1 means it needs to be reset
var newAIMove = [-1,-1]; //holds newest AI decision, row,col
var nodesSearched = 0; //global tracks nodes searched for minimax

//update board grid values, x position, y position, player number (1 or 2)			 
function updateBoardValues(x,y,p){
	//if alternative game mode, and position is y=5, and spot taken by same player, then drop col
	if(gameType == 1 && y == 5 && board[y][x] == p){
		for(let i = 5; i > 0; i--){
			board[i][x] = board[i-1][x];
		}
		board[0][x] = 0;
		return 1;
	}
	
	//if position taken, traverse upwards to find empty 
	if(board[y][x] != 0){
		for(let i = y; i >= 0; i--){
			if(board[i][x] == 0){
				board[i][x] = p;
				return 1;
			}
		}
	}

	//if position not taken, drop to lowest slot and fill
	else{
		for (let i = 5; i >= y; i--) {
			if (board[i][x] == 0) {
				board[i][x] = p;
				return 1;
			}
		}
	}
	
	return 0;
}

//allows the computer to drop a piece on a col, returns new board
function computerDropPiece(b,c,p){
	let state = JSON.parse(JSON.stringify(b));
	for(let i = 5; i >= 0; i--){
		if (state[i][c] == 0){
			state[i][c] = p;
			return state;
		}
	}
	console.log("ERROR: COMPUTER DROPPED PIECE ON FULL COL")
	return null;
}
//allows the computer to remove a piece on a col, returns new board
function computerRemovePiece(b,c,p){
	let state = JSON.parse(JSON.stringify(b));
	for(let i = 5; i > 0; i--){
		state[i][c] = state[i-1][c];
	}
	state[0][c] = 0;
	return state;
}

//clear old board, then redraw all table entries based on grid values in each entry
function drawBoard(){
	for(let i = 0; i < board.length; i++){
		for(let j = 0; j < board[i].length; j++){
			if(board[i][j] == 0){
				let cell = $("tr:eq(" + i + ")").find('td').eq(j).css('background', 'transparent');
			}
			if(board[i][j] == 1){
				let cell = $("tr:eq(" + i + ")").find('td').eq(j).css('background', '#ff3c64');
			}
			else if(board[i][j] == 2){
				let cell = $("tr:eq(" + i + ")").find('td').eq(j).css('background', '#3062D9');
			}
			if(i == newAIMove[0] && j == newAIMove[1]){ //newest ai move, color it different
				let cell = $("tr:eq(" + i + ")").find('td').eq(j).css('background', 'blue');
			}
		}
	}
}


//check for a win or a draw by scanning board
function checkBoard(){
	let HEIGHT = board.length;
    let WIDTH = board[0].length;
    let EMPTY_SLOT = 0;
	
    for (let r = 0; r < HEIGHT; r++) { // iterate rows, bottom to top
        for (let c = 0; c < WIDTH; c++) { // iterate columns, left to right
            let player = board[r][c];
            if (player == EMPTY_SLOT)
                continue; // don't check empty slots

            if (c + 3 < WIDTH &&
                player == board[r][c+1] && // look right
                player == board[r][c+2] &&
                player == board[r][c+3]){
					let cell = $("tr:eq(" + r + ")").find('td').eq(c).css('background', 'yellow');
					let cell2 = $("tr:eq(" + r + ")").find('td').eq(c+1).css('background', 'yellow');
					let cell3 = $("tr:eq(" + r + ")").find('td').eq(c+2).css('background', 'yellow');
					let cell4 = $("tr:eq(" + r + ")").find('td').eq(c+3).css('background', 'yellow');
					console.log("HORIZONTAL WIN FOR " + player);
					return player;
				}

            if (r + 3 < HEIGHT) {
                if (player == board[r+1][c] && // look up
                    player == board[r+2][c] &&
                    player == board[r+3][c]){
						let cell = $("tr:eq(" + r + ")").find('td').eq(c).css('background', 'yellow');
						let cell2 = $("tr:eq(" + (r+1) + ")").find('td').eq(c).css('background', 'yellow');
						let cell3 = $("tr:eq(" + (r+2) + ")").find('td').eq(c).css('background', 'yellow');
						let cell4 = $("tr:eq(" + (r+3) + ")").find('td').eq(c).css('background', 'yellow');
						console.log("VERTICAL WIN FOR " + player);
						return player;
					}

                if (c + 3 < WIDTH &&
                    player == board[r+1][c+1] && // look up & right
                    player == board[r+2][c+2] &&
                    player == board[r+3][c+3]){
						let cell = $("tr:eq(" + r + ")").find('td').eq(c).css('background', 'yellow');
						let cell2 = $("tr:eq(" + (r+1) + ")").find('td').eq(c+1).css('background', 'yellow');
						let cell3 = $("tr:eq(" + (r+2) + ")").find('td').eq(c+2).css('background', 'yellow');
						let cell4 = $("tr:eq(" + (r+3) + ")").find('td').eq(c+3).css('background', 'yellow');
						console.log("POSITIVE DIAGONAL WIN FOR " + player);
						return player;
					}

                if (c - 3 >= 0 &&
                    player == board[r+1][c-1] && // look up & left
                    player == board[r+2][c-2] &&
                    player == board[r+3][c-3]){
						let cell = $("tr:eq(" + r + ")").find('td').eq(c).css('background', 'yellow');
						let cell2 = $("tr:eq(" + (r+1) + ")").find('td').eq(c-1).css('background', 'yellow');
						let cell3 = $("tr:eq(" + (r+2) + ")").find('td').eq(c-2).css('background', 'yellow');
						let cell4 = $("tr:eq(" + (r+3) + ")").find('td').eq(c-3).css('background', 'yellow');
						console.log("NEGATIVE DIAGONAL WIN FOR " + player);
						return player;
					}

            }
        }
    }

	//no win, check for draw
	for(let i = 0; i < board.length; i++){
		for(let j = 0; j < board[i].length; j++){
			if(board[i][j] == 0){
				return 0; //no draw, keep going
			}
		}
	}
	//draw check did not detect any empty grids, game is a draw return draw
	console.log("DRAW GAME");
	return 3;
}

// takes in a new board state and returns its evaluated score 
function getScore(b, p){
	let SCORE = 0;
	let HEIGHT = b.length;
    let WIDTH = b[0].length;
	let player1 = -1;
	let player2 = -2;
	
	if(p == 1){
		player1 = 1;
		player2 = 2;
	}
	else if(p == 2){
		player1 = 2;
		player2 = 1;
	}
	
    for (let r = 0; r < HEIGHT; r++) { // iterate rows, bottom to top
        for (let c = 0; c < WIDTH; c++) { // iterate columns, left to right
            if (b[r][c] == 0)
                continue; // don't check empty slots
			else if (b[r][c] == player1){ // we are checking a computers tile
				if(c == 3 && player1 == b[r][c]){ //middle column pieces are worth more
					SCORE = SCORE + 2;
				}
				
				if (c + 3 < WIDTH &&
					player1 == b[r][c+1] && // look right
					player1 == b[r][c+2] &&
					player1 == b[r][c+3]){
							//player1 4 in a row horizontally
						SCORE = SCORE + 10000;
					}
					
				if (c + 2 < WIDTH &&
					player1 == b[r][c+1] && // look right
					player1 == b[r][c+2]){
							//player1 3 in a row horizontally
						SCORE = SCORE + 5;
					}
				
				if (c + 1 < WIDTH &&
					player1 == b[r][c+1]){
							//player1 2 in a row horizontally
						SCORE = SCORE + 2;
					}
				
				if (r + 3 < HEIGHT &&
					player1 == b[r+1][c] && // look up
					player1 == b[r+2][c] &&
					player1 == b[r+3][c]){
						//player1 4 in a row vertically
						SCORE = SCORE + 10000;
					}

				if (r + 2 < HEIGHT &&
					player1 == b[r+1][c] && // look up
					player1 == b[r+2][c]){
						//player1 3 in a row vertically
						SCORE = SCORE + 5;
					}
					
				if (r + 1 < HEIGHT &&
					player1 == b[r+1][c]){
						//player1 2 in a row vertically
						SCORE = SCORE + 2;
					}
					
				if (r + 3 < HEIGHT &&
					c + 3 < WIDTH &&
					player1 == b[r+1][c+1] && // look up & right
					player1 == b[r+2][c+2] &&
					player1 == b[r+3][c+3]){
						//player1 4 in a row diagonally
						SCORE = SCORE + 10000;
					}
					
				if (r + 2 < HEIGHT &&
					c + 2 < WIDTH &&
					player1 == b[r+1][c+1] && // look up & right
					player1 == b[r+2][c+2]){
						//player1 3 in a row diagonally
						SCORE = SCORE + 5;
					}
					
				if (r + 1 < HEIGHT &&
					c + 1 < WIDTH &&
					player1 == b[r+1][c+1]){
						//player1 2 in a row diagonally
						SCORE = SCORE + 2;
					}
					
				if (r + 3 < HEIGHT &&
					c - 3 >= 0 &&
					player1 == b[r+1][c-1] && // look up & left
					player1 == b[r+2][c-2] &&
					player1 == b[r+3][c-3]){
						//player1 4 in a row diagonally
						SCORE = SCORE + 10000;
					}
					
				if (r + 2 < HEIGHT &&
					c - 2 >= 0 &&
					player1 == b[r+1][c-1] && // look up & left
					player1 == b[r+2][c-2]){
						//player1 3 in a row diagonally
						SCORE = SCORE + 5;
					}

				if (r + 1 < HEIGHT &&
					c - 1 >= 0 &&
					player1 == b[r+1][c-1]){
						//player1 2 in a row diagonally
						SCORE = SCORE + 2;
					}
						
			}
			else if(b[r][c] == player2){  // we are checking a players tile
				if(c == 3 && player2 == b[r][c]){ //middle column pieces are worth more
					SCORE = SCORE - 2;
				}
			
				if (c + 3 < WIDTH &&
					player2 == b[r][c+1] && // look right
					player2 == b[r][c+2] &&
					player2 == b[r][c+3]){
							//player2 4 in a row horizontally
						SCORE = SCORE - 10000;
					}
					
				if (c + 2 < WIDTH &&
					player2 == b[r][c+1] && // look right
					player2 == b[r][c+2]){
							//player2 3 in a row horizontally
						SCORE = SCORE - 500;
					}
				
				if (c + 1 < WIDTH &&
					player2 == b[r][c+1]){
							//player2 2 in a row horizontally
						SCORE = SCORE - 2;
					}
				
				if (r + 3 < HEIGHT &&
					player2 == b[r+1][c] && // look up
					player2 == b[r+2][c] &&
					player2 == b[r+3][c]){
						//player2 4 in a row vertically
						SCORE = SCORE - 10000;
					}

				if (r + 2 < HEIGHT &&
					player2 == b[r+1][c] && // look up
					player2 == b[r+2][c]){
						//player2 3 in a row vertically
						SCORE = SCORE - 500;
					}
					
				if (r + 1 < HEIGHT &&
					player2 == b[r+1][c]){
						//player2 2 in a row vertically
						SCORE = SCORE - 2;
					}
					
				if (r + 3 < HEIGHT &&
					c + 3 < WIDTH &&
					player2 == b[r+1][c+1] && // look up & right
					player2 == b[r+2][c+2] &&
					player2 == b[r+3][c+3]){
						//player2 4 in a row diagonally
						SCORE = SCORE - 10000;
					}
					
				if (r + 2 < HEIGHT &&
					c + 2 < WIDTH &&
					player2 == b[r+1][c+1] && // look up & right
					player2 == b[r+2][c+2]){
						//player2 3 in a row diagonally
						SCORE = SCORE - 500;
					}
					
				if (r + 1 < HEIGHT &&
					c + 1 < WIDTH &&
					player2 == b[r+1][c+1]){
						//player2 2 in a row diagonally
						SCORE = SCORE - 2;
					}
					
				if (r + 3 < HEIGHT &&
					c - 3 >= 0 &&
					player2 == b[r+1][c-1] && // look up & left
					player2 == b[r+2][c-2] &&
					player2 == b[r+3][c-3]){
						//player2 4 in a row diagonally
						SCORE = SCORE - 10000;
					}
					
				if (r + 2 < HEIGHT &&
					c - 2 >= 0 &&
					player2 == b[r+1][c-1] && // look up & left
					player2 == b[r+2][c-2]){
						//player2 3 in a row diagonally
						SCORE = SCORE - 500;
					}

				if (r + 1 < HEIGHT &&
					c - 1 >= 0 &&
					player2 == b[r+1][c-1]){
						//player2 2 in a row diagonally
						SCORE = SCORE - 2;
					}
			}

        }
    }
	
	return SCORE;
}

//node object, declare ex: let newNode = new Node(params);
function Node(state, score, depth, par) {
	this.state = state;
	this.score = score;
	this.depth = depth;
	this.parent = par;
	this.children = [];
}


//define all values, learn them and track them through the algorithm
// minimax algorithm, takes current board (game)
function MINIMAXDECISION(){
	let b = JSON.parse(JSON.stringify(board));
	let root = new Node (b, 0, 0, null);
	nodesSearched = 0;
	let v = MAXVALUE(root, -Infinity, Infinity);
	for(let i = 0; i < root.children.length; i++){
		if(root.children[i].score == v){
			for(let k = 0; k < board.length; k++){
				for(let q = 0; q < board[k].length; q++){
					if(board[k][q] != root.children[i].state[k][q]){
						console.log("NODES SEARCHED FOR THIS AI MOVE: " + nodesSearched);
						document.getElementById("newAIMoveString").style.visibility = "visible";
						document.getElementById("newAIMoveString").innerHTML = "AI played Row: " + k + " Col: " + q;
						newAIMove = [k,q];
					}
				}
			}
			return root.children[i].state;
		}
	}
	
	return null;
}

//maximum function for minmax
function MAXVALUE(node, alpha, beta){
	let b = JSON.parse(JSON.stringify(node.state));
	let v = -Infinity;
	if (node.depth >= depthLimit){
		return getScore(node.state, 2);
	}
	for(let c = 0; c < 7; c++){
		if(b[0][c] == 0){ 
			nodesSearched = nodesSearched + 1;
			let newState = computerDropPiece(b,c,2);
			let newScore = 0;
			let newNode = new Node(newState, newScore, node.depth + 1, node);
			node.children.push(newNode);
			
			newNode.score = MINVALUE(newNode, alpha, beta);

			v = Math.max(v, newNode.score);
			if(v >= beta){
				return v;
			}
			alpha = Math.max(alpha,v);
			
		}
	}
	
	if(gameType == 1){
		for(let c = 0; c < 7; c++){
			if(b[5][c] == 2){ 
				nodesSearched = nodesSearched + 1;
				let newState2 = computerRemovePiece(b,c,2);
				let newScore2 = 0;
				let newNode2 = new Node(newState2, newScore2, node.depth + 1, node);
				node.children.push(newNode2);
				
				newNode2.score = MINVALUE(newNode2, alpha, beta);

				v = Math.max(v, newNode2.score);
				if(v >= beta){
					return v;
				}
				alpha = Math.max(alpha,v);
				
			}
		}
	}
	return v;
}


function MINVALUE(node, alpha, beta){
	let b = JSON.parse(JSON.stringify(node.state));
	let v = Infinity;
	
	if (node.depth >= depthLimit){
		return getScore(node.state, 1);
	}
	for(let c = 0; c < 7; c++){
		if(b[0][c] == 0){ 
			nodesSearched = nodesSearched + 1;
			let newState = computerDropPiece(b,c,1);
			let newScore = 0;
			let newNode = new Node(newState, newScore, node.depth + 1, node);
			node.children.push(newNode);
			newNode.score = MAXVALUE(newNode, alpha, beta);
			v = Math.min(v, newNode.score);
			
			if(v <= alpha){
				return v;
			}
			beta = Math.min(beta,v);
			
		}
	}
	
	if(gameType == 1){
		for(let c = 0; c < 7; c++){
			if(b[5][c] == 2){ 
				nodesSearched = nodesSearched + 1;
				let newState2 = computerRemovePiece(b,c,2);
				let newScore2 = 0;
				let newNode2 = new Node(newState2, newScore2, node.depth + 1, node);
				node.children.push(newNode2);
				newNode2.score = MAXVALUE(newNode2, alpha, beta);

				v = Math.min(v, newNode2.score);
				if(v <= alpha){
					return v;
				}
				beta = Math.min(beta,v);
			}
		}
	}
	return v;
}


//implements dumb ai
function randomMove(){
	if (gameType == 1){
		if (Math.floor((Math.random() * 2) + 1) == 1){ // 1 in 3 chance of attempting to removing piece
			console.log("ATTEMPTING A REMOVAL");
			for(let k = 0; k < board[5].length;k++){//make sure there is a piece to remove
				if(board[5][k] == 1){
					console.log("CORRECT PIECE DETECTED");
					while(1){
						let c = Math.floor((Math.random() * 6) + 0);
						if (board[5][c] == 1){
							for(let i = 5; i > 0; i--){
								board[i][c] = board[i-1][c];
							}
							board[0][c] = 0;
							console.log("REMOVAL SUCCESS AT COL: " + c);
							return 1;
						}
					}
				}
			}

		}
		//if we failed removing in some way, we will attempt to randomly place until we succeed
		while(1){
			let c = Math.floor((Math.random() * 6) + 0);
			if(board[0][c] == 0){
				for(let i = 5; i >= 0; i--){
					if (board[i][c] == 0){
						board[i][c] = 1;
						return 1;
					}
				}
			}
		}
	}
	else if (gameType == 0){ //classic
		//we will attempt to randomly place until we succeed
		while(1){
			let c = Math.floor((Math.random() * 6) + 0);
			if(board[0][c] == 0){
				for(let i = 5; i >= 0; i--){
					console.log("ATTEMPTING ROW " + i + " COL: " + c);
					if (board[i][c] == 0){
						board[i][c] = 1;
						return 1;
					}
				}
			}
		}
	}
}

function endHandler(string){
	document.getElementById("endString").style.visibility = "visible";
	document.getElementById("endString").innerHTML = string;
	gameOverFlag = 1;
}

//function to set all relevant variables, also used for resetting game
function init(gt,pt,depth){
	board = [[0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0]];
	newAIMove = [-1,-1];
	document.getElementById("board").style.visibility = "visible";
	document.getElementById("newAIMoveString").style.visibility = "hidden";
	document.getElementById("endString").style.visibility = "hidden";
	document.getElementById("initGame").innerHTML = "Restart";
	let gameString = "";
	if(gt == 0){gameString = "Classic";}
	else{gameString = "Alternative";}
	if(pt == 1){gameString = gameString + " Human(Red) vs AI(Blue)";}
	else if(pt == 2){gameString = gameString + " Dumb AI(Red) vs AI(Blue) (Click board to execute turns)";}
	else if(pt == 0){gameString = gameString + " Player 1(Red) vs Player 2(Blue)";}
	document.getElementById("currentGame").innerHTML = gameString;
	gameType = gt; //game type refers to 0 for standard C4, or 1 for alternate dropping version
	playType = pt; //0 for human vs human, 1 for human vs ai, 2 for ai vs ai
	playerTurn = 1; //1 for player 1, or 2 for player 2
	depthLimit = depth; //maximum depth to search ahead for AI
	statisticsString = "";
	drawBoard();
	gameOverFlag = 0;
	
}

//click handler for grid positions when player clicks
$('#board td').click(tableClick);
function tableClick(){
	if(gameOverFlag == 0){
		if (playType == 0 || playType == 1){
			let y = $('#board tr').index($(this).closest('tr'));
			let x = $(this).closest('tr').find('td').index($(this).closest('td'));
			
			//check if updateBoardValues returns success then proceed
			if(updateBoardValues(x,y, playerTurn) == 1){
				drawBoard()
				let checkBoardRet = checkBoard();
				if (checkBoardRet == 1 || checkBoardRet == 2){endHandler("Player " + playerTurn + " wins!"); return 0;}//player wins
				else if(checkBoardRet == 3){endHandler("Draw!"); return 0;}//draw
				if(playType == 0){ //human vs human, switch turns
					if (playerTurn == 1){
						playerTurn = 2;
					}
					else if(playerTurn == 2){
						playerTurn = 1;
					}
				}
				else if(playType == 1){
					board = MINIMAXDECISION(board);
					drawBoard();
					let checkBoardRet = checkBoard();
					if (checkBoardRet == 2){endHandler("AI wins!"); return 0;}//AI wins
					else if(checkBoardRet == 3){endHandler("Draw!"); return 0;}//draw
				}
			}
		}
		
		else if (playType == 2){ //dumb ai vs ai
			if(playerTurn == 1){
				randomMove();
				drawBoard();
				let checkBoardRet = checkBoard();
				if (checkBoardRet == 1){endHandler("Dumb AI wins!"); return 0;}//DUMB AI wins
				else if(checkBoardRet == 3){endHandler("Draw!"); return 0;}//draw
				playerTurn = 2;
			}
			else if(playerTurn == 2){
				board = MINIMAXDECISION(board);
				drawBoard();
				checkBoardRet = checkBoard();
				if (checkBoardRet == 2){endHandler("AI wins!"); return 0;}//AI wins
				else if(checkBoardRet == 3){endHandler("Draw!"); return 0;}//draw
				playerTurn = 1;
			}
		}
	}
}

$('#initGame').click(function(){
	init(document.getElementById("SelectGameType").value,
	document.getElementById("SelectPlayType").value,
	document.getElementById("SelectDepth").value);
	
});