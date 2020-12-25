const square_size = 80;
const size = 8;
const piece_size = 40;
const piece_margin = square_size / 2 - piece_size / 2;
const white =  'rgb(255,255,255)';
const black =  'rgb(0,0,0)';

class Player {
    constructor(color, ctx){
        this.ctx = ctx;
        this.color = color;
        if (color == 'black'){
            this.pieces = {
                king: new King(ctx, 4,0),
                queen: new Queen(ctx, 3,0),
                rookL: new Rook(ctx, 0,0),
                rookR: new Rook(ctx, 7,0),
                bishopL: new Bishop(ctx, 2,0),
                bishopR: new Bishop(ctx, 5,0),
                knightL: new Knight(ctx, 1,0),
                knightR: new Knight(ctx, 6,0),
                pawns: []
            };
        } else {
            this.pieces = {
                king: new King(ctx, 4,7),
                queen: new Queen(ctx, 3,7),
                rookL: new Rook(ctx, 0,7),
                rookR: new Rook(ctx, 7,7),
                bishopL: new Bishop(ctx, 2,7),
                bishopR: new Bishop(ctx, 5,7),
                knightL: new Knight(ctx, 1,7),
                knightR: new Knight(ctx, 6,7),
                pawns: []
            };
        }
        const pawnY = (color == 'black') ? 1 : 6;
        for (var i = 0; i < size; i++)
            this.pieces.pawns.push(new Pawn(ctx, i, pawnY));
    }
    draw(){
        const colorBit = (this.color == 'black') ? 0 : 1;

        this.pieces.king.draw(colorBit);
        this.pieces.queen.draw(colorBit);
        this.pieces.rookL.draw(colorBit);
        this.pieces.rookR.draw(colorBit);
        this.pieces.knightL.draw(colorBit);
        this.pieces.knightR.draw(colorBit);
        this.pieces.bishopL.draw(colorBit);
        this.pieces.bishopR.draw(colorBit);
        for (let pawn of this.pieces.pawns)
            pawn.draw(colorBit);
    }
}

class Board {
    constructor(ctx) {
        this.ctx = ctx;

        this.fillStyles = [white, black];
        this.ctx.font = '40px serif';

        this.player1 = null;
        this.player2 = null;
    }
    draw_board(){
        var color = 0;
        for (var y=0; y < size; y++) {
            for (var x=0; x < size; x++) {
                this.ctx.fillStyle = this.fillStyles[color];
                color = (color + 1 ) % 2;
                this.ctx.fillRect(x * square_size, y * square_size, square_size, square_size);
            }
            color = (color + 1 ) % 2;
        };
        const whole_size = size * square_size;
        this.ctx.strokeRect(0, 0, whole_size, whole_size);
    }
    create_players(){
        this.player1 = new Player('black', this.ctx);
        this.player2 = new Player('white', this.ctx);
    }
    draw(){
        this.draw_board();
        this.player1.draw();
        this.player2.draw();
    }
}

class Piece {
    constructor(ctx, x, y){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
    }
    draw(color){
        this.ctx.fillStyle = (color == 0) ? black : white;
        this.ctx.fillRect(this.x*square_size + piece_margin, this.y*square_size + piece_margin, piece_size, piece_size);
        this.ctx.strokeRect(this.x*square_size + piece_margin, this.y*square_size + piece_margin, piece_size, piece_size);
    }
}

class King extends Piece {
    draw(color){
        super.draw(color);
        this.ctx.fillStyle = (color == 1) ? black : white;
        this.ctx.fillText("K", this.x*square_size + piece_margin + 5, this.y*square_size + piece_margin + 33);
    }
}
class Queen extends Piece {
    draw(color){
        super.draw(color);
        this.ctx.fillStyle = (color == 1) ? black : white;
        this.ctx.fillText("Q", this.x*square_size + piece_margin + 5, this.y*square_size + piece_margin + 33);
    }
}
class Rook extends Piece {
    draw(color){
        super.draw(color);
        this.ctx.fillStyle = (color == 1) ? black : white;
        this.ctx.fillText("R", this.x*square_size + piece_margin + 5, this.y*square_size + piece_margin + 33);
    }
}
class Bishop extends Piece {
    draw(color){
        super.draw(color);
        this.ctx.fillStyle = (color == 1) ? black : white;
        this.ctx.fillText("B", this.x*square_size + piece_margin + 5, this.y*square_size + piece_margin + 33);
    }
}
class Knight extends Piece {
    draw(color){
        super.draw(color);
        this.ctx.fillStyle = (color == 1) ? black : white;
        this.ctx.fillText("H", this.x*square_size + piece_margin + 5, this.y*square_size + piece_margin + 33);
    }
}
class Pawn extends Piece {
    draw(color){
        super.draw(color);
        this.ctx.fillStyle = (color == 1) ? black : white;
        this.ctx.fillText("P", this.x*square_size + piece_margin + 5, this.y*square_size + piece_margin + 33);
    }
}

const main = () => {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var board = new Board(ctx);
        board.create_players();
        board.draw();
    } else {
        alert('cant get canvas context!');
    }
}

main();
