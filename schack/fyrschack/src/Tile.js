import Piece from "./Piece.js";
import SquareBoard from "./SquareBoard.js";

const BLACK = "#CD853F";
const WHITE = "#F9E29C";

const BLACK_HIGHLIGHT = "#8e2d4c";
const WHITE_HIGHLIGHT = "#bffff9";

export default class Tile{
    /**
     * 
     * @param {number} posX 
     * @param {number} posY 
     * @param {number} coordX 
     * @param {number} coordY 
     * @param {string} color 
     * @param {number} size 
     */
    constructor(posX, posY, coordX, coordY, color, size){
        this.posX = posX;
        this.posY = posY;
        this.coordX = coordX;
        this.coordY = coordY;
        this.color = color;
        this.size = size;

        this.top = posY - size/2;
        this.bottom = posY + size/2;
        this.left = posX - size/2;
        this.right = posX + size/2;

        this.piece = undefined;
        this.highlighted = false;
    }

    SetPiece(piece){
        this.piece = piece;
    }
    
    Draw(ctx){
        let drawColor;

        if(this.color === "white"){
            if(this.highlighted){
                drawColor = WHITE_HIGHLIGHT;
            }
            else{
                drawColor = WHITE;
            }
        }
        else{
            if(this.highlighted){
                drawColor = BLACK_HIGHLIGHT;
            }
            else{
                drawColor = BLACK;
            }
        }
        
        ctx.beginPath();
        ctx.fillStyle = drawColor;
        //ctx.fillRect(this.posX - (this.size/2), this.posY - (this.size/2), this.posX + (this.size/2), this.posY + (this.size/2));
        ctx.fillRect(this.posX - (this.size/2), this.posY - (this.size/2), this.size, this.size);
        
        
        console.log((this.posX - (this.size/2)) + " " + (this.posY - (this.size/2)) + " " + (this.posX + (this.size/2)) + " " + (this.posY + (this.size/2)));

        if(this.piece != undefined)
            this.piece.Draw(ctx);
    }
}