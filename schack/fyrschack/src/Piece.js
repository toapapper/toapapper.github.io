import Tile from "./Tile.js";

//#region image-loading
let PAWN_IMG = new Image();
PAWN_IMG.src = "sprites/bonde.png";

let ROOK_IMG = new Image();
ROOK_IMG.src = "sprites/torn.png";

let KNIGHT_IMG = new Image();
KNIGHT_IMG.src = "sprites/häst.png";

let BISHOP_IMG = new Image();
BISHOP_IMG.src = "sprites/löpare.png";

let QUEEN_IMG = new Image();
QUEEN_IMG.src = "sprites/drottning.png";

let KING_IMG = new Image();
KING_IMG.src = "sprites/kung.png";

let PAWN2_IMG = new Image();
PAWN2_IMG.src = "sprites/bonde_r.png";

let ROOK2_IMG = new Image();
ROOK2_IMG.src = "sprites/torn_r.png";

let KNIGHT2_IMG = new Image();
KNIGHT2_IMG.src = "sprites/häst_r.png";

let BISHOP2_IMG = new Image();
BISHOP2_IMG.src = "sprites/löpare_r.png";

let QUEEN2_IMG = new Image();
QUEEN2_IMG.src = "sprites/drottning_r.png";

let KING2_IMG = new Image();
KING2_IMG.src = "sprites/kung_r.png";
//#endregion

export default class Piece{

    /**
     * @param {Tile} tile 
     * @param {string} type no capital letters, english name of piece: pawn, rook, knight, bishop, queen, king
     * @param {number} player facing directions: 0 = up, 1 = down, 2 = left, 3 = right
     * @param {[]} graveyard this teams graveyard, contains only the type-string
     * @param {SquareBoard} board reference to the board this is a part of
     * @param {string} fwdDir string referencing which direction is forward for this piece
     * @param {bool} teams true if there are teams enabled
     */
    constructor(tile, type, player, graveyard, board, fwdDir, teams){
        this.tile = tile;
        this.type = type;
        this.player = player;
        this.graveyard = graveyard;
        this.board = board;
        this.fwdDir = fwdDir;
        this.teamsEnabled = teams;

        if(type == "pawn"){//för att kunna flytta 2 steg första, IMPLEMENTERA
            this.hasMoved = false;
        }

        this.tile.SetPiece(this);
    }

    GetPossibleMoves(){
        return this[this.type + "Move"]();
    }

    MoveToTile(tile){
        this.tile.piece = undefined;

        if(tile.piece != undefined){
            tile.piece.KillPiece();
        }

        this.tile = tile;
        this.tile.piece = this;

        if(this.type == "pawn" && !this.hasMoved){
            this.hasMoved = true;
        }

        if(this.type == "pawn"){
            if(this.fwdDir == "up"){
                if(this.board.GetTileAtCoordinate(this.tile.coordX, this.tile.coordY - 1) == undefined){
                    this.type = "queen";
                }
            }
            else if(this.fwdDir == "down"){
                if(this.board.GetTileAtCoordinate(this.tile.coordX, this.tile.coordY + 1) == undefined){
                    this.type = "queen";
                }
            }
            else if(this.fwdDir == "right"){
                if(this.board.GetTileAtCoordinate(this.tile.coordX + 1, this.tile.coordY) == undefined){
                    this.type = "queen";
                }
            }
            else if(this.fwdDir == "left"){
                if(this.board.GetTileAtCoordinate(this.tile.coordX - 1, this.tile.coordY) == undefined){
                    this.type = "queen";
                }
            }
        }
        
    }

    KillPiece(){
        this.graveyard.push(this.type);
        this.tile.piece = undefined;
        this.tile = undefined;

        if(this.type == "king"){
            this.board.KingTaken(this.player);
        }
    }

    static GetImage(pieceType, player){
        let drawImg;

        //set drawImg
        if(player == 0 || player == 1){
            switch(pieceType){
                case "pawn":
                    drawImg = PAWN_IMG;
                    break;
                case "rook":
                    drawImg = ROOK_IMG;
                    break;
                case "knight":
                    drawImg = KNIGHT_IMG;
                    break;
                case "bishop":
                    drawImg = BISHOP_IMG;
                    break;
                case "queen":
                    drawImg = QUEEN_IMG;
                    break;
                case "king":
                    drawImg = KING_IMG;
                    break;
            }
        }
        else{
            switch(pieceType){
                case "pawn":
                    drawImg = PAWN2_IMG;
                    break;
                case "rook":
                    drawImg = ROOK2_IMG;
                    break;
                case "knight":
                    drawImg = KNIGHT2_IMG;
                    break;
                case "bishop":
                    drawImg = BISHOP2_IMG;
                    break;
                case "queen":
                    drawImg = QUEEN2_IMG;
                    break;
                case "king":
                    drawImg = KING2_IMG;
                    break;
            }
        }

        return drawImg;
    }

    Draw(ctx){
        let drawImg;

        //set drawImg
        drawImg = Piece.GetImage(this.type, this.player);

        if(drawImg != undefined){
            if(this.player == 1 || this.player == 3){
                ctx.filter = "invert(1)";
            }

            ctx.drawImage(drawImg,this.tile.left, this.tile.top, this.tile.size, this.tile.size);

            if(this.player == 1 || this.player == 3){ //reset inversion
                ctx.filter = "invert(0)";
            }
        }
    }
    
    //#region moveRules
    pawnMove(){
        let moves = [];
    
        let fwdTile;
        let scndFwdTile;
        let fwdRightTile;
        let fwdLeftTile;
    
        if(this.fwdDir == "up"){//which player dictates which direction for pawn
            fwdTile = this.board.GetTileAtCoordinate(this.tile.coordX, this.tile.coordY - 1);
            fwdRightTile = this.board.GetTileAtCoordinate(this.tile.coordX + 1, this.tile.coordY - 1);
            fwdLeftTile = this.board.GetTileAtCoordinate(this.tile.coordX - 1, this.tile.coordY - 1);
            if(!this.hasMoved){
                scndFwdTile = this.board.GetTileAtCoordinate(this.tile.coordX, this.tile.coordY - 2);
            }
        }
        else if(this.fwdDir == "down"){
            fwdTile = this.board.GetTileAtCoordinate(this.tile.coordX, this.tile.coordY + 1);
            fwdRightTile = this.board.GetTileAtCoordinate(this.tile.coordX - 1, this.tile.coordY + 1);
            fwdLeftTile = this.board.GetTileAtCoordinate(this.tile.coordX + 1, this.tile.coordY + 1);
            if(!this.hasMoved){
                scndFwdTile = this.board.GetTileAtCoordinate(this.tile.coordX, this.tile.coordY + 2);
            }
        }
        else if(this.fwdDir == "right"){
            fwdTile = this.board.GetTileAtCoordinate(this.tile.coordX + 1, this.tile.coordY);
            fwdRightTile = this.board.GetTileAtCoordinate(this.tile.coordX + 1, this.tile.coordY - 1);
            fwdLeftTile = this.board.GetTileAtCoordinate(this.tile.coordX + 1, this.tile.coordY + 1);
            if(!this.hasMoved){
                scndFwdTile = this.board.GetTileAtCoordinate(this.tile.coordX + 2, this.tile.coordY);
            }
        }
        else if(this.fwdDir == "left"){
            fwdTile = this.board.GetTileAtCoordinate(this.tile.coordX - 1, this.tile.coordY);
            fwdRightTile = this.board.GetTileAtCoordinate(this.tile.coordX - 1, this.tile.coordY + 1);
            fwdLeftTile = this.board.GetTileAtCoordinate(this.tile.coordX - 1, this.tile.coordY - 1);
            if(!this.hasMoved){
                scndFwdTile = this.board.GetTileAtCoordinate(this.tile.coordX - 2, this.tile.coordY);
            }
        }
        else{
            console.error("VAFAN?");
        }
    
        if(fwdTile != undefined){
            if(fwdTile.piece == undefined){
                moves.push(fwdTile);

                if(scndFwdTile != undefined){
                    if(scndFwdTile.piece == undefined){
                        moves.push(scndFwdTile);
                    }
                }
            }
        }
    
        if(fwdRightTile != undefined){
            if(fwdRightTile.piece != undefined){
                if(fwdRightTile.piece.player != this.player){
                    moves.push(fwdRightTile);
                }
            }
        }
        if(fwdLeftTile != undefined){
            if(fwdLeftTile.piece != undefined){
                if(fwdLeftTile.piece.player != this.player){//teams
                    moves.push(fwdLeftTile);
                }
            }
        }
        
        return moves;
    };
    
    rookMove(){
        let moves = [];
    
        for(let i = 0; i < 4; i++){
            //0 = up, 1 = down, 2 = right, 3 = left
            
            let loops = 0;
            while(true){
                loops++;
                
                let tile;
                switch(i){
                    case 0:
                        tile = this.board.GetTileAtCoordinate(this.tile.coordX, this.tile.coordY - loops);
                        break;
                    case 1:
                        tile = this.board.GetTileAtCoordinate(this.tile.coordX, this.tile.coordY + loops);
                        break;
                    case 2:
                        tile = this.board.GetTileAtCoordinate(this.tile.coordX + loops, this.tile.coordY);
                        break;
                    case 3:
                        tile = this.board.GetTileAtCoordinate(this.tile.coordX - loops, this.tile.coordY);
                        break;
                }
                
                
                if(this.CheckTile(tile)){
                    moves.push(tile);
                    if(tile.piece != undefined){//if can take a piece it shouldnt be able to move further hence the loop breaks
                        break;
                    }
                }
                else{
                    break;
                }
            }
        }
    
        return moves;
    };
    
    knightMove(){
        let moves = [];
    
        //up left
        let tile = this.board.GetTileAtCoordinate(this.tile.coordX - 1, this.tile.coordY - 2);
        if(this.CheckTile(tile)){
            moves.push(tile);
        }
        
        //up right
        tile = this.board.GetTileAtCoordinate(this.tile.coordX + 1, this.tile.coordY - 2);
        if(this.CheckTile(tile)){
            moves.push(tile);
        }
    
        //right up
        tile = this.board.GetTileAtCoordinate(this.tile.coordX + 2, this.tile.coordY -1);
        if(this.CheckTile(tile)){
            moves.push(tile);
        }
    
        //right down
        tile = this.board.GetTileAtCoordinate(this.tile.coordX + 2, this.tile.coordY +1);
        if(this.CheckTile(tile)){
            moves.push(tile);
        }
    
        //down right
        tile = this.board.GetTileAtCoordinate(this.tile.coordX + 1, this.tile.coordY + 2);
        if(this.CheckTile(tile)){
            moves.push(tile);
        }
    
        //down left
        tile = this.board.GetTileAtCoordinate(this.tile.coordX - 1, this.tile.coordY + 2);
        if(this.CheckTile(tile)){
            moves.push(tile);
        }
    
        //left down
        tile = this.board.GetTileAtCoordinate(this.tile.coordX - 2, this.tile.coordY + 1);
        if(this.CheckTile(tile)){
            moves.push(tile);
        }
    
        //left up
        tile = this.board.GetTileAtCoordinate(this.tile.coordX - 2, this.tile.coordY -1);
        if(this.CheckTile(tile)){
            moves.push(tile);
        }
    
        return moves;
    };
    
    bishopMove(){
        let moves = [];
    
        for(let i = 0; i < 4; i++){
            let loops = 0;
    
            while(true){
                loops++;
    
                let tile;
    
                switch(i){
                    case 0: //up + right
                        tile = this.board.GetTileAtCoordinate(this.tile.coordX + loops, this.tile.coordY - loops);
                        break;
                    case 1: //down + right
                        tile = this.board.GetTileAtCoordinate(this.tile.coordX + loops, this.tile.coordY + loops);
                        break;
                    case 2: //down + left
                        tile = this.board.GetTileAtCoordinate(this.tile.coordX - loops, this.tile.coordY + loops);
                        break;
                    case 3: //up + left
                        tile = this.board.GetTileAtCoordinate(this.tile.coordX - loops, this.tile.coordY - loops);
                        break;
                }
    
                if(this.CheckTile(tile)){
                    moves.push(tile);
                    if(tile.piece != undefined){
                        break;
                    }
                }
                else{
                    break;
                }
            }
        }
    
        return moves;
    };
    
    queenMove(){
        let moves = [];
    
        for(let i = 0; i < 8; i++){
            let loops = 0;
    
            while(true){
                loops++;
    
                let tile;
    
                switch(i){
                    case 0: //up + right
                        tile = this.board.GetTileAtCoordinate(this.tile.coordX + loops, this.tile.coordY - loops);
                        break;
                    case 1: //down + right
                        tile = this.board.GetTileAtCoordinate(this.tile.coordX + loops, this.tile.coordY + loops);
                        break;
                    case 2: //down + left
                        tile = this.board.GetTileAtCoordinate(this.tile.coordX - loops, this.tile.coordY + loops);
                        break;
                    case 3: //up + left
                        tile = this.board.GetTileAtCoordinate(this.tile.coordX - loops, this.tile.coordY - loops);
                        break;
                    case 4: //up
                        tile = this.board.GetTileAtCoordinate(this.tile.coordX, this.tile.coordY - loops);
                        break;
                    case 5: //rigth
                        tile = this.board.GetTileAtCoordinate(this.tile.coordX + loops, this.tile.coordY);
                        break;
                    case 6: //down
                        tile = this.board.GetTileAtCoordinate(this.tile.coordX, this.tile.coordY + loops);
                        break;
                    case 7: //left
                        tile = this.board.GetTileAtCoordinate(this.tile.coordX - loops, this.tile.coordY);
                        break;
                }
    
                if(this.CheckTile(tile)){
                    moves.push(tile);
                    if(tile.piece != undefined){
                        break;
                    }
                }
                else{
                    break;
                }
            }
        }
    
    
        return moves;
    };
    
    kingMove(){
        let moves = [];
     
        //up
        let tile = this.board.GetTileAtCoordinate(this.tile.coordX, this.tile.coordY - 1);
        if(this.CheckTile(tile) && !this.board.CheckCheck(tile, this.player)){
            moves.push(tile);
        }
        
        //right
        tile = this.board.GetTileAtCoordinate(this.tile.coordX + 1, this.tile.coordY);
        if(this.CheckTile(tile) && !this.board.CheckCheck(tile, this.player)){
            moves.push(tile);
        }
    
        //down
        tile = this.board.GetTileAtCoordinate(this.tile.coordX, this.tile.coordY + 1);
        if(this.CheckTile(tile) && !this.board.CheckCheck(tile, this.player)){
            moves.push(tile);
        }
    
        //left
        tile = this.board.GetTileAtCoordinate(this.tile.coordX - 1, this.tile.coordY);
        if(this.CheckTile(tile) && !this.board.CheckCheck(tile, this.player)){
            moves.push(tile);
        }
    
        //up right
        tile = this.board.GetTileAtCoordinate(this.tile.coordX + 1, this.tile.coordY - 1);
        if(this.CheckTile(tile) && !this.board.CheckCheck(tile, this.player)){
            moves.push(tile);
        }
    
        //down right
        tile = this.board.GetTileAtCoordinate(this.tile.coordX + 1, this.tile.coordY + 1);
        if(this.CheckTile(tile) && !this.board.CheckCheck(tile, this.player)){
            moves.push(tile);
        }
    
        //left down
        tile = this.board.GetTileAtCoordinate(this.tile.coordX - 1, this.tile.coordY + 1);
        if(this.CheckTile(tile) && !this.board.CheckCheck(tile, this.player)){
            moves.push(tile);
        }
    
        //left up
        tile = this.board.GetTileAtCoordinate(this.tile.coordX - 1, this.tile.coordY - 1);
        if(this.CheckTile(tile) && !this.board.CheckCheck(tile, this.player)){
            moves.push(tile);
        }
    
        return moves;
    }
    //#endregion

    /**
     * @param {Tile} tile 
     * @returns true if it's possible to hostile-move there(no friendly piece, not undefined)
     */
    CheckTile(tile){
        if(tile != undefined){
            if(tile.piece == undefined){
                return true;
            }else if(tile.piece.player != this.player){
                return true;
            }
        }
    
        return false;
    }

}

