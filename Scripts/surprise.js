const snakeFieldClass = "snake-block";
const snakeHeadFieldClass = "snake-head-block";
const snakeTailFieldClass = "snake-tail-block";
const fruitFieldClass = "fruit-block";
const collisionFieldClass = "collision-block";

class Game {
    constructor(gridBounds){
        this.gridBounds = gridBounds;
        this.tickRate = 350;
        this.fields = [];
        this.validKeys = ['w', 'a', 's', 'd']
        this.direction = "";
        this.directionQueue = [];
        this.snakeDied = false;

        this.fruit;
        this.snake = new Snake(this, Math.floor(Math.random() * (this.gridBounds - 1 + 1)) + 1,
                                Math.floor(Math.random() * (this.gridBounds - 1 + 1)) + 1 );
    }


    startGame(){
        setInterval(() => this.GameTick(), this.tickRate)
    }

    GameTick(){
        if (this.directionQueue.length > 0) {
            console.log(this.directionQueue)
            this.direction = this.directionQueue.shift();
        }

        if(this.direction != "" && !this.snakeDied){
            if(this.fruit == null){
                this.GenerateFruit();
            }
            this.snake.Move();
            this.UpdateGrid();
        }
    }

    InitializeGrid(){
        for(let i = 0; i < this.gridBounds ** 2; i++){
            var currentY = Math.floor(i / this.gridBounds) + 1;
            var currentX = i % this.gridBounds + 1;

            var currentField = new Field(currentX, currentY);
            this.fields.push(currentField)

            if(currentX == this.snake.x && currentY == this.snake.y )
            {
                currentField.fieldHtml.classList.add(snakeFieldClass);
                currentField.fieldHtml.classList.add(snakeHeadFieldClass);
                currentField.occupiedValue = this.snake.segmentCount;
            }

            gameGrid.appendChild(currentField.fieldHtml);
        }

        gameGrid.style.grid = `repeat(${this.gridBounds}, 1fr) / repeat(${this.gridBounds}, 1fr)`
        this.GenerateFruit()
    }

    UpdateGrid(){
        gameGrid.innerHTML = "";

        this.fields.forEach(field => {
            gameGrid.appendChild(field.fieldHtml);
        })
    }

    GenerateFruit(){
        var fruitX;
        var fruitY;
        
        const GetFruitCoordinates = () => {
            fruitX = Math.floor(Math.random() * this.gridBounds) + 1;
            fruitY = Math.floor(Math.random() * this.gridBounds) + 1;
        
            if (this.fields.find(field => field.x === fruitX && field.y === fruitY && field.occupiedValue > 0)) {
                GetFruitCoordinates();
            }
        };
    
        GetFruitCoordinates();

        this.fruit = new Fruit(this, fruitX, fruitY);

        var fieldToUpdate = this.fields.find(field => field.x === fruitX && field.y === fruitY);

        fieldToUpdate.fieldHtml.classList.add(fruitFieldClass);
    }

    GetOppositeDirection(direction) {
        const opposites = {
            'w': 's',
            's': 'w',
            'a': 'd',
            'd': 'a'
        };
        return opposites[direction];
    }
}

class Field {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.occupiedValue = 0;

        this.fieldHtml = document.createElement("div");
        this.fieldHtml.classList.add("grid-item");
        this.fieldHtml.dataset.x = this.x;
        this.fieldHtml.dataset.y = this.y;
    }
}

class Snake{
    constructor(game, x, y){
        this.x = x;
        this.y = y;
        this.segmentCount = 2

        this.game = game;
    }

    Move(){
        this.game.fields.filter(field => field.occupiedValue > 0).forEach(field => {
            field.occupiedValue = field.occupiedValue - 1;
            if(field.occupiedValue < 1){
                field.fieldHtml.classList.remove(snakeFieldClass);
            }
        });

        switch(this.game.direction){
            case "w":
                this.y = this.y - 1 < 1 ? this.game.gridBounds : this.y - 1;
                break;
            case "a":
                this.x = this.x - 1 < 1 ? this.game.gridBounds : this.x - 1;
                break;
            case "s":
                this.y = this.y + 1 > this.game.gridBounds ? 1 : this.y + 1;
                break;
            case "d":
                this.x = this.x + 1 > this.game.gridBounds ? 1 : this.x + 1;
                break;
        }

        var fieldToUpdate = this.game.fields.find(field => field.x === this.x && field.y === this.y);
        var lastField = this.game.fields.find(field => field.occupiedValue == 1);
        
        this.CheckField(fieldToUpdate);

        this.game.fields.find(field => field.fieldHtml.classList.contains(snakeHeadFieldClass)).fieldHtml.classList.remove(snakeHeadFieldClass);
        if(this.game.fields.find(field => field.fieldHtml.classList.contains(snakeTailFieldClass))){
            this.game.fields.find(field => field.fieldHtml.classList.contains(snakeTailFieldClass)).fieldHtml.classList.remove(snakeTailFieldClass);
        }

        lastField.fieldHtml.classList.add(snakeTailFieldClass);
        fieldToUpdate.fieldHtml.classList.add(snakeFieldClass);
        fieldToUpdate.fieldHtml.classList.add(snakeHeadFieldClass);
        fieldToUpdate.occupiedValue = this.segmentCount;
    }

    CheckField(fieldToUpdate){
        if(fieldToUpdate.fieldHtml.classList.contains(snakeFieldClass)){
            fieldToUpdate.fieldHtml.classList.remove(snakeFieldClass);
            fieldToUpdate.fieldHtml.classList.add(collisionFieldClass);
            this.game.snakeDied = true;
        }
        
        if(fieldToUpdate.fieldHtml.classList.contains(fruitFieldClass)){
            this.PickUpItem();
            this.game.fruit = null;
            fieldToUpdate.fieldHtml.classList.remove(fruitFieldClass);
        }
    }

    PickUpItem(){
        this.game.fields.filter(field => field.occupiedValue > 0).forEach(field => {field.occupiedValue++;});
        this.segmentCount++;
    }
}

class Fruit{
    constructor(game, x, y){
        this.x = x;
        this.y = y;
        this.game = game;
    }
}

var gameGrid = document.querySelector(".grid-container");
var game = new Game(8);

document.addEventListener('keypress', (e) => {
    if (game.validKeys.includes(e.key)) {
        const lastDirectionInQueue = game.directionQueue[game.directionQueue.length - 1] || game.direction;
        
        if (e.key !== game.GetOppositeDirection(lastDirectionInQueue)) {
            if (game.directionQueue.length < 3) {
                game.directionQueue.push(e.key);
            }
        }
    }
});

game.InitializeGrid();
game.startGame();