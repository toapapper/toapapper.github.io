import Piece from "./Piece.js";

const BOARDCOLOR = "#6d2e1d";

let PAWN_IMG = new Image();
PAWN_IMG.src = "sprites/bonde.png";

let PAWN2_IMG = new Image();
PAWN2_IMG.src = "sprites/bonde_r.png";

const graveyardColumnsBig = 2;//i column ett ritas spelare 0 och 2s döda pjäser ut och i kolumn 2 1 och 3., börja alltid på en ny rad med en ny spelare.1
const graveyardColumnsSmall = 4;
const graveyardSizeLimit = 20;//finns det fler än såhär många pjäser i kyrkogården så gör ritas pjäserna mindre

export default class Sideboard{

    constructor(players, graveyards, sizeX, sizeY, posX, posY){
        this.players = players;
        this.graveyards = graveyards;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.posX = posX;
        this.posY = posY;
    }

    /**
     * Acts as update and draw
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} currentPlayer 
     */
    Draw(ctx, currentPlayer){

        let playerImg;

        if(currentPlayer == 0 || currentPlayer == 1){
            playerImg = PAWN_IMG;
        }
        else if(currentPlayer == 2 || currentPlayer == 3){
            playerImg = PAWN2_IMG;
        }

        //background
        ctx.fillStyle = BOARDCOLOR;
        ctx.fillRect(this.posX, this.posY, this.sizeX, this.sizeY);

        //current player
        if(currentPlayer == 1 || currentPlayer == 3){ctx.filter = "invert(1)";}

        ctx.drawImage(playerImg, this.posX, this.posY, this.sizeX, this.sizeX);

        if(currentPlayer == 1 || currentPlayer == 3){ ctx.filter = "invert(0)";}

        //#region graveyards
        let currentColumns = graveyardColumnsBig;
        let pieceSizeX = this.sizeX/currentColumns;

        let currentRow = 0;

        for(let i = 0; i < this.players; i++){
            let graveyardSize = this.graveyards[i].length;
            let column = 0;
            
            for(let j = 0; j < graveyardSize; j++){
                
                if(i == 1 || i == 3){ctx.filter = "invert(1)";} 
                ctx.drawImage(Piece.GetImage(this.graveyards[i][j], i), this.posX + column * pieceSizeX, this.sizeX + currentRow * pieceSizeX, pieceSizeX, pieceSizeX);
                if(i == 1 || i == 3){ctx.filter = "invert(0)";}

                column++;
                if(column == currentColumns){
                    currentRow++;
                    column = 0;
                }
            }
            if(column != 0)
                currentRow++;
        }

        //#endregion

    }

}