import Piece from "./Piece.js";
import Tile from "./Tile.js";

export default class SquareBoard{
    /**
     * @param {number} playerAmount - amount of players inform which board to load
     * @param {number} canvasSize
     * @param {bool} teams
     */
    constructor(playerAmount, canvasSize, teams){
        this.playerAmount = playerAmount;
        this.canvasSize = canvasSize;
        
        this.graveyards = [];
        for(let i = 0; i < playerAmount; i++){
            this.graveyards.push([]);
        }

        if(this.playerAmount === 2){
            this.Create2PlayerBoard();
        }
        else if(this.playerAmount === 4){
            this.Create4PlayerBoard(teams);
        }
        else{
            console.error("fel mängd spelare " + this.playerAmount);
        }

    }

    /**
     * 
     * @param {number} x pixelposition x
     * @param {number} y pixelposition y
     */
    GetTileAtPixel(x, y){
        let coordX = Math.floor((x/this.canvasSize) * this.boardSizeX);
        let coordY = Math.floor((y/this.canvasSize) * this.boardSizeY);

        return this.GetTileAtCoordinate(coordX, coordY);
    }

    /**
     * 
     * @param {number} x
     * @param {number} y 
     */
    GetTileAtCoordinate(x, y){
        if(x > this.boardSizeX - 1 || x < 0 || y > this.boardSizeY - 1 || y < 0){
            return undefined;
        }
        else{
            return this.tiles[x][y];
        }
    }

    Draw(ctx){
        for(let i = 0; i < this.boardSizeX; i++){
            for(let j = 0; j < this.boardSizeY; j++){
                let tile = this.tiles[i][j];
                if(tile != undefined){
                    tile.Draw(ctx);
                }
            }
        }
    }
    
    
    CheckCheck(tile, player){
        return false;
        //om check return "check", om schack matt return "mate"
    }

    CheckMateCheck(tile, player){
        /**
         * stoppa spelet på nåt sätt eller bara gör vad som göras skall.
         * 
         * är iofs nog bättre om man måste ta kungen för att halva armén ska förödas.
         * annars ganska najs om man bara blir förlamad medans man är schack mattad.
         * måste lägga till att det är i lag.
         * turordning behöver också fixas.
         */

        return false;
    }

    HighlightPossibleMoves(piece){
        let tiles = piece.GetPossibleMoves();
        let count = 0;

        tiles.forEach(function(tile){
            tile.highlighted = true;
            count++;
        });

        return tiles;
    }

    ResetHighlights(){
        this.tiles.forEach(function (row){
            row.forEach(function(tile){
                if(tile != undefined)
                    tile.highlighted = false;
            });
        });
    }

    KingTaken(player){
        for(let i = 0; i < this["player" + player].length; i++){
            this["player" + player].tile = undefined;
        }
    }

    /**
     * Place the pieces for one player
     * give the tileposition of the bottom left corner if the direction is up and it will place one team
     * @param {number} tileX 
     * @param {number} tileY 
     * @param {string} direction left, right, up, down, no caps
     * @param {number} player
     * @param {bool} teams
     */
    PlacePieces(tileX, tileY, direction, player, teams){
        //a bit of a monster of a function
        this["team" + player] = [];//skapa lagets array

        
        let temp = [];

        if(direction === "up"){
            //rooks
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY), "rook", player, this.graveyards[player], this, direction, teams));
            temp.push(new Piece(this.GetTileAtCoordinate(tileX + 7, tileY), "rook", player, this.graveyards[player], this, direction, teams));
    
            //knights
            temp.push(new Piece(this.GetTileAtCoordinate(tileX + 1, tileY), "knight", player, this.graveyards[player], this, direction, teams));
            temp.push(new Piece(this.GetTileAtCoordinate(tileX + 6, tileY), "knight", player, this.graveyards[player], this, direction, teams));

            //bishops
            temp.push(new Piece(this.GetTileAtCoordinate(tileX + 2, tileY), "bishop", player, this.graveyards[player], this, direction, teams));
            temp.push(new Piece(this.GetTileAtCoordinate(tileX + 5, tileY), "bishop", player, this.graveyards[player], this, direction, teams));

            //queen
            temp.push(new Piece(this.GetTileAtCoordinate(tileX + 3, tileY), "queen", player, this.graveyards[player], this, direction, teams));

            //king
            temp.push(new Piece(this.GetTileAtCoordinate(tileX + 4, tileY), "king", player, this.graveyards[player], this, direction, teams));

            //pawns
            for(let i = 0; i < 8; i++){
                temp.push(new Piece(this.GetTileAtCoordinate(tileX + i, tileY - 1), "pawn", player, this.graveyards[player], this, direction, teams));
            }
        }
        else if(direction === "down"){
            //rooks
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY), "rook", player, this.graveyards[player], this, direction, teams));
            temp.push(new Piece(this.GetTileAtCoordinate(tileX - 7, tileY), "rook", player, this.graveyards[player], this, direction, teams));
    
            //knights
            temp.push(new Piece(this.GetTileAtCoordinate(tileX - 1, tileY), "knight", player, this.graveyards[player], this, direction, teams));
            temp.push(new Piece(this.GetTileAtCoordinate(tileX - 6, tileY), "knight", player, this.graveyards[player], this, direction, teams));

            //bishops
            temp.push(new Piece(this.GetTileAtCoordinate(tileX - 2, tileY), "bishop", player, this.graveyards[player], this, direction, teams));
            temp.push(new Piece(this.GetTileAtCoordinate(tileX - 5, tileY), "bishop", player, this.graveyards[player], this, direction, teams));

            //queen
            temp.push(new Piece(this.GetTileAtCoordinate(tileX - 4, tileY), "queen", player, this.graveyards[player], this, direction, teams));

            //king
            temp.push(new Piece(this.GetTileAtCoordinate(tileX - 3, tileY), "king", player, this.graveyards[player], this, direction, teams));

            //pawns
            for(let i = 0; i < 8; i++){
                temp.push(new Piece(this.GetTileAtCoordinate(tileX - i, tileY + 1), "pawn", player, this.graveyards[player], this, direction, teams));
            }
        }
        else if(direction === "left"){
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY), "rook", player, this.graveyards[player], this, direction, teams));
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY - 7), "rook", player, this.graveyards[player], this, direction, teams));
    
            //knights
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY - 1), "knight", player, this.graveyards[player], this, direction, teams));
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY - 6), "knight", player, this.graveyards[player], this, direction, teams));

            //bishops
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY - 2), "bishop", player, this.graveyards[player], this, direction, teams));
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY - 5), "bishop", player, this.graveyards[player], this, direction, teams));

            //queen
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY - 4), "queen", player, this.graveyards[player], this, direction, teams));

            //king
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY - 3), "king", player, this.graveyards[player], this, direction, teams));

            //pawns
            for(let i = 0; i < 8; i++){
                temp.push(new Piece(this.GetTileAtCoordinate(tileX - 1, tileY - i), "pawn", player, this.graveyards[player], this, direction, teams));
            }
        }
        else if(direction === "right"){
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY), "rook", player, this.graveyards[player], this, direction, teams));
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY + 7), "rook", player, this.graveyards[player], this, direction, teams));
    
            //knights
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY + 1), "knight", player, this.graveyards[player], this, direction, teams));
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY + 6), "knight", player, this.graveyards[player], this, direction, teams));

            //bishops
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY + 2), "bishop", player, this.graveyards[player], this, direction, teams));
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY + 5), "bishop", player, this.graveyards[player], this, direction, teams));

            //queen
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY + 4), "queen", player, this.graveyards[player], this, direction, teams));

            //king
            temp.push(new Piece(this.GetTileAtCoordinate(tileX, tileY + 3), "king", player, this.graveyards[player], this, direction, teams));

            //pawns
            for(let i = 0; i < 8; i++){
                temp.push(new Piece(this.GetTileAtCoordinate(tileX + 1, tileY + i), "pawn", player, this.graveyards[player], this, direction, teams));
            }
        }

        this["team" + player] = temp;
    }
    

    Create2PlayerBoard(){
        this.boardSizeX = 8;
        this.boardSizeY = 8;
        this.tileSize = this.canvasSize/this.boardSizeX;//pixelsize av tiles

        //create tiles
        let tiles = [];

        let odd = 1;
        for(let column = 0; column < this.boardSizeX; column++){
            odd++;

            tiles.push([]);
            for(let row = 0; row < this.boardSizeY; row++){
                let x = column * this.tileSize + this.tileSize * .5;
                let y = row * this.tileSize + this.tileSize * .5;

                let color;
                if((odd % 2) == 1){
                    color = "black";
                }
                else if(odd%2 == 0){
                    color = "white";
                }

                odd++;
                
                tiles[column][row] = new Tile(x, y, column, row, color, this.tileSize);
            }
        }
        this.tiles = tiles;
        
        
        //populate tiles
        this.PlacePieces(0, 7, "up", 0);
        this.PlacePieces(7, 0, "down", 1);
    }
    
    /**
     * 
     * @param {bool} teams 
     */
    Create4PlayerBoard(teams){
        this.boardSizeX = 14;
        this.boardSizeY = 14;

        this.tileSize = this.canvasSize/this.boardSizeX;//pixelsize av tiles

        //create tiles
        let tiles = [];

        let odd = 1;
        for(let column = 0; column < this.boardSizeX; column++){
            odd++;

            tiles.push([]);
            for(let row = 0; row < this.boardSizeY; row++){
                let x = column * this.tileSize + this.tileSize * .5;
                let y = row * this.tileSize + this.tileSize * .5;

                let color;
                if((odd % 2) == 1){
                    color = "black";
                }
                else if(odd%2 == 0){
                    color = "white";
                }

                odd++;
                
                tiles[column][row] = new Tile(x, y, column, row, color, this.tileSize);
            }
        }

        //removing top left corner of board
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                tiles[i][j] = undefined;
            }
        }

        //top right
        for(let i = 11; i < 14; i++){
            for(let j = 0; j < 3; j++){
                tiles[i][j] = undefined;
            }
        }

        //bottom left
        for(let i = 0; i < 3; i++){
            for(let j = 11; j < 14; j++){
                tiles[i][j] = undefined;
            }
        }

        //bottom right
        for(let i = 11; i < 14; i++){
            for(let j = 11; j < 14; j++){
                tiles[i][j] = undefined;
            }
        }

        this.tiles = tiles;
        
        this.PlacePieces(3, 13, "up", 0);
        this.PlacePieces(0, 3, "right", 1);
        this.PlacePieces(10, 0, "down", 2);
        this.PlacePieces(13, 10, "left", 3);
    }
}
