const square_size = 80;

class Board {
    constructor(ctx) {
        this.ctx = ctx;

        this.fillStyles = ['rgb(0, 0, 0)', 'rgb(255,255,255)'];
        this.size = 8;
    }
    draw_board(){
        var color = 0;
        for (var y=0; y < this.size; y++) {
            for (var x=0; x < this.size; x++) {
                this.ctx.fillStyle = this.fillStyles[color];
                color = (color + 1 ) % 2;
                this.ctx.fillRect(x * square_size, y * square_size, square_size, square_size);
                console.log(x,y);
            }
            color = (color + 1 ) % 2;
        };
        const whole_size = this.size * square_size;
        this.ctx.strokeRect(0, 0, whole_size, whole_size);
    }
    draw(){
        this.draw_board();
    }
}

const main = () => {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var board = new Board(ctx);
        board.draw();
    } else {
        alert('cant get canvas context!');
    }
}

main();



