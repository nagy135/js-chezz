const square_size = 80;
const size = 8;
const piece_size = 40;
const target_size = 20;
const piece_margin = square_size / 2 - piece_size / 2;
const player_turn_margin_left = 20;
const player_turn_margin_top = 20;
const player_turn_size = 40;
const player_turn_arrow_size = 50;
const player_turn_arrow_width = 5;
const target_line_width = 4;
const turn_arrow_margin_top = player_turn_margin_top + 110;
const white =  'rgb(255,255,255)';
const red =  'rgb(200,20,20)';
const target_black =  'rgba(0,0,0,0.8)';
const target_white =  'rgba(255,255,255,0.8)';
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
    deactivate_all(){
        for (var piece of Object.keys(this.pieces)){
            this.pieces[piece].active = false;
        };
        for (var piece of this.pieces.pawns)
            piece.active = false;
    }
    kill_piece_if_exists(x,y){
        for (var piece of Object.keys(this.pieces))
            if (this.pieces[piece].x == x && this.pieces[piece].y == y)
                this.pieces[piece].dead = true;
        for (var piece of this.pieces.pawns)
            if (piece.x == x && piece.y == y)
                piece.dead = true;
    }
    activate(x,y){
        var activated = null;
        for (var piece of Object.keys(this.pieces))
            if (!this.pieces[piece].dead)
                if (this.pieces[piece].x == x && this.pieces[piece].y == y){
                    this.pieces[piece].active = ! this.pieces[piece].active;
                    activated = this.pieces[piece];
                } else {
                    this.pieces[piece].active = false;
                }

        for (var piece of this.pieces.pawns)
            if (!piece.dead)
                if (piece.x == x && piece.y == y){
                    piece.active = ! piece.active;
                    activated = piece;
                } else {
                    piece.active = false;
                }
        return (activated && activated.active) ? activated : null;
    }
}

class Board {
    constructor(ctx) {
        this.ctx = ctx;

        this.fillStyles = [white, black];
        this.ctx.font = '40px serif';

        this.player1 = null;
        this.player2 = null;

        this.turn = 'white';
        this.activated = null;
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

        // clean turn section before redraw
        this.ctx.fillStyle = white;
        this.ctx.fillRect(size * square_size + player_turn_margin_left, player_turn_margin_top, player_turn_size * 3, player_turn_size * 3);

        // draw turn section
        this.ctx.fillStyle = white;
        this.ctx.fillRect(size * square_size + player_turn_margin_left, player_turn_margin_top, player_turn_size, player_turn_size);
        this.ctx.fillStyle = black;
        this.ctx.fillRect(size * square_size + player_turn_margin_left + player_turn_size, player_turn_margin_top, player_turn_size, player_turn_size);
        this.ctx.strokeStyle = black;
        this.ctx.strokeRect(size * square_size + player_turn_margin_left, player_turn_margin_top, player_turn_size * 2, player_turn_size);

        // draw turn sections arrow
        var shift = player_turn_margin_left + Math.floor(player_turn_size / 2);
        if (this.turn == 'black')
            shift += player_turn_size;
        canvas_arrow(this.ctx, size * square_size + shift, turn_arrow_margin_top, size * square_size + shift, turn_arrow_margin_top - player_turn_arrow_size );
    }
    create_players(){
        this.player1 = new Player('black', this.ctx);
        this.player2 = new Player('white', this.ctx);

        this.player1.init_game(this.player2);
        this.player2.init_game(this.player1);
    }
    click(x,y){
        console.log(this.activated);
        if (this.activated)
            if (this.move(x, y)){
                this.turn = (this.turn == 'white') ? 'black' : 'white';
                this.draw();
                return;
            }
        var new_activated = this.player1.activate(x,y);
        if (!new_activated){
            new_activated = this.player2.activate(x,y);
            this.player1.deactivate_all();
        } else {
            this.player2.deactivate_all();
        }
        console.log(new_activated);
        if (new_activated){
            this.activated = new_activated;
        }
        this.draw();
    }
    move(x,y){
        var player = (this.turn == 'black') ? this.player1 : this.player2;
        const activated = this.activated;
        if (activated.enemy.color == player.color){
            return false;
        } else {
            for(let move of activated.available_moves()){
                if (activated.x + move[0] == x
                    && activated.y + move[1] == y){
                    activated.x = x;
                    activated.y = y;
                    activated.active = false;
                    this.activated = null;
                    activated.enemy.kill_piece_if_exists(x,y);
                    return true;
                }
            }
        }
        return false;
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
        this.dead = false;
        this.label = "";
    }
    draw(color){
        if (this.dead)
            return;
        this.ctx.fillStyle = (color == 0) ? black : white;
        this.ctx.fillRect(this.x*square_size + piece_margin, this.y*square_size + piece_margin, piece_size, piece_size);
        this.ctx.strokeStyle = (color == 1) ? black : white;
        this.ctx.strokeRect(this.x*square_size + piece_margin, this.y*square_size + piece_margin, piece_size, piece_size);

        this.ctx.fillStyle = (color == 1) ? black : white;
        this.ctx.fillText(this.label, this.x*square_size + piece_margin + 7, this.y*square_size + piece_margin + 33);

        if (!this.active) return;
        this.ctx.lineWidth = target_line_width;
        this.ctx.fillStyle = (this.player.color == 'black') ? target_black : target_white;
        this.ctx.strokeStyle = red;
        for(let move of this.available_moves()){
            // this.ctx.fillRect(piece_margin + square_size * (this.x + move[0]), piece_margin + square_size * (this.y + move[1]), 30,30);
            this.ctx.beginPath();
            this.ctx.arc(2*piece_margin + square_size * (this.x + move[0]), 2*piece_margin + square_size * (this.y + move[1]), target_size, 0, 2 * Math.PI, true);
            this.ctx.fill();
            this.ctx.stroke();
        }
        this.ctx.lineWidth = 1;
    }
    available_moves(){
        var result = [];
        const moves = this.all_moves();
        for (var i = 0; i < moves.length; i++){
            if (this.available_move(moves[i]))
                result.push(moves[i]);
        };
        return result;
    }
    own_reserved_positions(){
        return this.reserved_positions(this.player);
    }
    enemy_reserved_positions(){
        return this.reserved_positions(this.enemy);
    }
    reserved_positions(player){
        var positions = [];
        if (!player.pieces.king.dead)
            positions.push([player.pieces.king.x, player.pieces.king.y]);
        if (!player.pieces.queen.dead)
            positions.push([player.pieces.queen.x, player.pieces.queen.y]);
        if (!player.pieces.rookL.dead)
            positions.push([player.pieces.rookL.x, player.pieces.rookL.y]);
        if (!player.pieces.rookR.dead)
            positions.push([player.pieces.rookR.x, player.pieces.rookR.y]);
        if (!player.pieces.bishopL.dead)
            positions.push([player.pieces.bishopL.x, player.pieces.bishopL.y]);
        if (!player.pieces.bishopR.dead)
            positions.push([player.pieces.bishopR.x, player.pieces.bishopR.y]);
        if (!player.pieces.knightL.dead)
            positions.push([player.pieces.knightL.x, player.pieces.knightL.y]);
        if (!player.pieces.knightR.dead)
            positions.push([player.pieces.knightR.x, player.pieces.knightR.y]);
        for (var pawn of player.pieces.pawns)
            if (!pawn.dead)
                positions.push([pawn.x, pawn.y]);
        return positions;
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
            if (this.x + x == reserved[0] && this.y + y == reserved[1])
                fits = false;
        };
        if (!fits)
            return false;
        // }}}

        /// {{{ check enemy pieces
        // const enemy_positions = this.enemy_reserved_positions();
        // for (let key in enemy_positions){
        //     const reserved = enemy_positions[key];
        //     if (this.x + x == reserved[0] && this.y + y == reserved[1])
        //         fits = false;
        // };
        // if (!fits)
        //     return false;
        // }}}

        return true;
    }
    // overriden in some pieces
    all_moves(){
        if (this.repeats)
            return this.repeating_moves();
        return this.moves;
    }
    repeating_moves(){
        var repeating_moves = [];
        var enemy_reserved_positions = this.enemy_reserved_positions()
        var own_reserved_positions = this.own_reserved_positions()
        for (var move of this.moves){
            var cumulative_x = move[0];
            var cumulative_y = move[1];
            searching_while:
                while (this.x + cumulative_x >= 0
                    && this.y + cumulative_y >= 0
                    && this.x + cumulative_x < size
                    && this.y + cumulative_y < size
                ){
                    for (var i = 0; i < own_reserved_positions.length; i++){
                        if (this.x + cumulative_x == own_reserved_positions[i][0]
                            && this.y + cumulative_y == own_reserved_positions[i][1])
                            break searching_while;
                    };
                    for (var i = 0; i < enemy_reserved_positions.length; i++){
                        if (this.x + cumulative_x == enemy_reserved_positions[i][0]
                            && this.y + cumulative_y == enemy_reserved_positions[i][1]){
                            repeating_moves.push([cumulative_x,cumulative_y]);
                            break searching_while;
                        }
                    };
                    repeating_moves.push([cumulative_x,cumulative_y]);
                    cumulative_x += move[0];
                    cumulative_y += move[1];
                }
        };
        return repeating_moves;
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
        [1,-1],
        [-1,-1]
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

        canvas.onclick = function (event)
        {
            const x = Math.floor(event.offsetX / square_size);
            const y = Math.floor(event.offsetY / square_size);
            board.click(x,y);
        }

        var board = new Board(ctx);
        board.create_players();
        board.draw();
    } else {
        alert('cant get canvas context!');
    }
}

function canvas_arrow(context, fromx, fromy, tox, toy) {
    var headlen = 15;
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.strokeStyle = black;
    context.lineCap = 'round'
    context.lineWidth = player_turn_arrow_width;
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
    context.lineWidth = 1;
}

main();
