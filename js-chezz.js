const square_size = 80;
const size = 8;
const piece_size = 40;
const piece_margin = square_size / 2 - piece_size / 2;
const white =  'rgb(255,255,255)';
const red =  'rgb(200,20,20)';
const black =  'rgb(0,0,0)';

class Player {
    constructor(color, ctx){
        this.ctx = ctx;
        this.color = color;
        this.enemy = null;
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


        this.ctx.fillStyle = red;
        for(let move of this.pieces.queen.available_moves()){
            this.ctx.fillRect(piece_margin + square_size * (this.pieces.queen.x + move[0]), piece_margin + square_size * (this.pieces.queen.y + move[1]), 30,30);
        }
    }
    init_game(enemy){
        this.enemy = enemy;
        if (this.color == 'black'){
            this.pieces = {
                king: new King(this.ctx, 4,0, this, enemy),
                queen: new Queen(this.ctx, 3,0, this, enemy),
                rookL: new Rook(this.ctx, 0,0, this, enemy),
                rookR: new Rook(this.ctx, 7,0, this, enemy),
                bishopL: new Bishop(this.ctx, 2,0, this, enemy),
                bishopR: new Bishop(this.ctx, 5,0, this, enemy),
                knightL: new Knight(this.ctx, 1,0, this, enemy),
                knightR: new Knight(this.ctx, 6,0, this, enemy),
                pawns: []
            };
        } else {
            this.pieces = {
                king: new King(this.ctx, 4,7, this, enemy),
                queen: new Queen(this.ctx, 3,7, this, enemy),
                rookL: new Rook(this.ctx, 0,7, this, enemy),
                rookR: new Rook(this.ctx, 7,7, this, enemy),
                bishopL: new Bishop(this.ctx, 2,7, this, enemy),
                bishopR: new Bishop(this.ctx, 5,7, this, enemy),
                knightL: new Knight(this.ctx, 1,7, this, enemy),
                knightR: new Knight(this.ctx, 6,7, this, enemy),
                pawns: []
            };
        }
        const pawnY = (this.color == 'black') ? 1 : 6;
        const direction = (this.color == 'black') ? 'down' : 'up';
        for (var i = 0; i < size; i++)
            this.pieces.pawns.push(new Pawn(this.ctx, i, pawnY, this, enemy, direction));
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

        this.player1.init_game(this.player2);
        this.player2.init_game(this.player1);
    }
    draw(){
        this.draw_board();
        this.player1.draw();
        this.player2.draw();
    }
}

class Piece {
    repeats = false;
    constructor(ctx, x, y, player, enemy){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.player = player;
        this.enemy = enemy;
        this.active = false;
        this.label = "";
    }
    draw(color){
        this.ctx.fillStyle = (color == 0) ? black : white;
        this.ctx.fillRect(this.x*square_size + piece_margin, this.y*square_size + piece_margin, piece_size, piece_size);
        this.ctx.strokeRect(this.x*square_size + piece_margin, this.y*square_size + piece_margin, piece_size, piece_size);

        this.ctx.fillStyle = (color == 1) ? black : white;
        this.ctx.fillText(this.label, this.x*square_size + piece_margin + 7, this.y*square_size + piece_margin + 33);
    }
    available_moves(){
        var result = [];
        for (var i = 0; i < this.moves.length; i++){
            if (this.available_move(this.moves[i]))
                result.push(this.moves[i]);
        };
        return result;
    }
    own_reserved_positions(){
        var owned_positions = [];
        owned_positions.push([this.player.pieces.king.x, this.player.pieces.king.y]);
        owned_positions.push([this.player.pieces.queen.x, this.player.pieces.queen.y]);
        owned_positions.push([this.player.pieces.rookL.x, this.player.pieces.rookL.y]);
        owned_positions.push([this.player.pieces.rookR.x, this.player.pieces.rookR.y]);
        owned_positions.push([this.player.pieces.bishopL.x, this.player.pieces.bishopL.y]);
        owned_positions.push([this.player.pieces.bishopR.x, this.player.pieces.bishopR.y]);
        owned_positions.push([this.player.pieces.knightL.x, this.player.pieces.knightL.y]);
        owned_positions.push([this.player.pieces.knightR.x, this.player.pieces.knightR.y]);
        for (var pawn of this.player.pieces.pawns)
            owned_positions.push([pawn.x, pawn.y]);
        return owned_positions;
    }
    available_move(move){
        const x = move[0];
        const y = move[1];
        // borders {{{
        if (this.x + x < 0)
            return false;
        if (this.y + y < 0)
            return false;
        if (this.x + x >= size)
            return false;
        if (this.y + y >= size)
            return false;
        // }}}

        /// {{{ check owned pieces
        var fits = true;
        const owned_positions = this.own_reserved_positions();
        for (let key in owned_positions){
            const reserved = owned_positions[key];
            console.log(this.x + x, this.y + y, ' ##### ', reserved);
            if (this.x + x == reserved[0] && this.y + y == reserved[1])
                fits = false;
        };
        if (!fits)
            return false;
        // }}}

        return true;
    }
}

class King extends Piece {
    label = "K";
    moves = [
        [1,1],
        [1,0],
        [1,-1],
        [0,1],
        [0,-1],
        [-1,-1],
        [-1,0],
        [-1,1]
    ];
}
class Queen extends Piece {
    label = "Q";
    //the same as king but infinite repeat
    repeats = true;
    moves = [
        [1,1],
        [1,0],
        [1,-1],
        [0,1],
        [0,-1],
        [-1,-1],
        [-1,0],
        [-1,1]
    ];
}
class Rook extends Piece {
    label = "R";
    repeats = true;
    moves = [
        [1,0],
        [0,1],
        [-1,0],
        [0,-1]
    ];
}
class Bishop extends Piece {
    label = "B";
    repeats = true;
    moves = [
        [1,1],
        [-1,1],
        [1,-1]
    ];
}
class Knight extends Piece {
    label = "H";
    moves = [
        [-2,-1],
        [-2,1],
        [2,1],
        [2,-1],
        [1,2],
        [1,-2],
        [-1,2],
        [-1,-2],
    ];
}
class Pawn extends Piece {
    label = "P";
    constructor(ctx, x, y, player, enemy, direction){
        super(ctx, x, y, player, enemy);
        this.direction = direction;
        if (this.direction == 'up')
            this.moves = [
                [0, -1],
                [1, -1],
                [-1, -1],
            ];
        else
            this.moves = [
                [0, 1],
                [1, 1],
                [-1, 1],
            ];
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
