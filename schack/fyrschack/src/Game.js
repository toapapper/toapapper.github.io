import SquareBoard from "./SquareBoard.js";
import Board from "./SquareBoard.js";
import Tile from "./Tile.js";
import Sideboard from "./SideBoard.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let board;
let sideBoard;
let currentPlayer = 0;
let players = 2;

let selectedPiece;
let highlighted;//currently highlighted tiles
let borderSize;

/**
 * 
 * @param {number} playerAmount 
 * @param {bool} teams 
 */
window.StartGame = function(playerAmount, teams){
    players = playerAmount;
    currentPlayer = 0;

    borderSize = parseInt(canvas.style.border.substring(0,2), 10);
    board = new SquareBoard(players, canvas.getBoundingClientRect().bottom - canvas.getBoundingClientRect().top - borderSize * 2, teams);
    ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight);

    let sideBoardXSize = (canvas.getBoundingClientRect().right - canvas.getBoundingClientRect().left - borderSize * 2) - (canvas.getBoundingClientRect().bottom - canvas.getBoundingClientRect().top - borderSize * 2);
    let sideBoardYSize = canvas.getBoundingClientRect().bottom - canvas.getBoundingClientRect().top - borderSize * 2;
    let sideBoardX = sideBoardYSize;
    sideBoard = new Sideboard(players, board.graveyards, sideBoardXSize, sideBoardYSize ,sideBoardX, 0);

    Draw(ctx);
};

//TODO:
/**schack + matt-koller
 * 
 * 4spelarbräde
 * speciella regler för 4spelarbräde när det gäller schack och schack matt?
 * kanske lägga till en bool: funrules i när man startar spelet, som reglerar hur schack och matt hanteras
 * och därigenom ifall man kan ta den andres kung och potentiella konsekvenser därefter.
 * Kanske är det så att halva armén försvinner och befälet läggs på högst rankade pjäs. Detta kan ske tills armén är 5 pjäser stort eller något, då är den för liten och man förlorar.
 * 
 * display graveyard kanske
 * 
 * Uppgradera bonde till vilken annan pjäs som helst
 * 
 * CheckCheck(player, tile)
 * bara kolla varenda annan spelares alla gubbar och se om nån av de kan ta kungen. kanske highlighta de gubbarna också.
 * 
 * CheckmateCheck körs i början av en spelares runda varje gång. och bara gör samma sak typ fast för varje tile som kungen kan gå på...
 * I extra kul spelreglerna så kanske det är så att kungen flyr så fort den blivit schack mattad och kronan går till nästa i befäl och en fjärdedel av armén försvinner
 * Borde kanske istället bara köra en getpossible moves av alla pjäser och spara de tilesen och sedan jämföra.
 * 
 * 
 * Lägg till att en spelare ska kunna slås ut. och dens tur därför skippas.
 */

canvas.addEventListener('click', function(event){
    let rect = canvas.getBoundingClientRect();

    let x = event.clientX - borderSize - rect.left;
    let y = event.clientY - borderSize - rect.top;
    
    let tile = board.GetTileAtPixel(x, y);
    let piece = tile.piece;

    if(selectedPiece == undefined && piece != undefined){
        SelectPiece(piece);
    }
    else if(selectedPiece != undefined){
        Move(tile);
    }
    
    Draw(ctx);
}, false);



function SelectPiece(piece){
    if(piece.player != currentPlayer){
        return;
    }

    if(piece == selectedPiece){
        ResetSelection();
        return;
    }

    //select and highlight
    selectedPiece = piece;
    highlighted = board.HighlightPossibleMoves(piece);

    if(highlighted.length == 0){//if no possible moves, reset selection
        ResetSelection();
    }
}

function Move(tile){
    if(tile == selectedPiece.tile){
        ResetSelection();
        return;
    }

    if(tile.piece != undefined){
        if(tile.piece.player == currentPlayer){
            board.ResetHighlights();
            SelectPiece(tile.piece);
        }
    }

    if(highlighted.includes(tile)){
        selectedPiece.MoveToTile(tile);

        currentPlayer++;
        if(currentPlayer == players){
            currentPlayer = 0;
        }

        ResetSelection();

    }
}

function ResetSelection(){
    board.ResetHighlights();
    highlighted = undefined;
    selectedPiece = undefined;
}

function Draw(ctx){
    ctx.fillStyle = "#6d2e1d";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    board.Draw(ctx);
    sideBoard.Draw(ctx, currentPlayer);
}