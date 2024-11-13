const snakeFieldClass = "snake-block";
const snakeHeadFieldClass = "snake-head-block";
const snakeTailFieldClass = "snake-tail-block";
const fruitFieldClass = "fruit-block";
const collisionFieldClass = "collision-block";
const animateEat = "animate-eat";
let gameTickIntervalId = null;
class Game {
    constructor(gridBounds){
        this.gridBounds = gridBounds;
        this.tickRate = 230;
        this.fields = [];
        this.validKeys = ['w', 'a', 's', 'd']
        this.direction = "";
        this.directionQueue = [];
        this.snakeDied = false;
        this.playerWon = false;

        this.fruit;
        this.snake = new Snake(this, Math.floor(Math.random() * (this.gridBounds - 1 + 1)) + 1,
                                Math.floor(Math.random() * (this.gridBounds - 1 + 1)) + 1 );
    }


    startGame(){
        gameTickIntervalId = setInterval(() => this.GameTick(), this.tickRate);
    }

    GameTick(){
        if (this.directionQueue.length > 0) {
            this.direction = this.directionQueue.shift();
        }

        if(this.direction != "" && !this.snakeDied && !this.playerWon){
            if(this.fruit == null){
                this.GenerateFruit();
            }
            this.snake.Move();
            this.UpdateGrid();
        }
        else if(this.playerWon){
            var emptyField = this.fields.find(field => !field.fieldHtml.classList.contains(snakeFieldClass));
            if(emptyField != null){
                console.log(emptyField)
                this.fields.find(field => field.fieldHtml.classList.contains(snakeHeadFieldClass)).fieldHtml.classList.remove(snakeHeadFieldClass);
                emptyField.fieldHtml.classList.add(snakeFieldClass);
                emptyField.fieldHtml.classList.add(snakeHeadFieldClass);
            }
        }
    }

    InitializeGrid(){
        console.log("dasdf");
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

        gameGrid.style.grid = `repeat(${this.gridBounds}, 1fr) / repeat(${this.gridBounds}, 1fr)`;
        this.GenerateFruit();
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
        this.segmentCount = 3;

        this.eatDuration = 100;
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
            var snakeTail = this.game.fields.find(field => field.fieldHtml.classList.contains(snakeTailFieldClass));
            snakeTail.fieldHtml.classList.remove(snakeTailFieldClass);
            snakeTail.fieldHtml.style.animation = "";
        }

        if(lastField != null){
            lastField.fieldHtml.classList.add(snakeTailFieldClass);
            lastField.fieldHtml.style.animation = "shrink 1s forwards";
        }
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
        this.game.fields
    .filter(field => field.occupiedValue > 0)
    .sort((a, b) => b.occupiedValue - a.occupiedValue)
    .forEach((field, index) => {
        field.occupiedValue++;

        let calculatedAnimDuration = this.eatDuration - this.segmentCount * (this.eatDuration / (this.game.gridBounds ** 2 + 1))
        setTimeout(() => {
            console.log(1 / this.game.gridBounds ** 2)
            if(field.fieldHtml.classList.contains(snakeFieldClass)){
            field.fieldHtml.style.animation = `eat 0.2s forwards`;
            }

            setTimeout(() => {
                field.fieldHtml.style.animation = "";
            }, 200);
        }, index * calculatedAnimDuration);
    });


        this.segmentCount++;


        if(this.segmentCount === this.game.gridBounds ** 2){
            console.log("You won!")
            this.game.fields.find(field => field.fieldHtml.classList.contains(snakeTailFieldClass)).fieldHtml.style.animation = "";
            this.game.playerWon = true;
        }
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
var gridSize = 8;
var game = new Game(gridSize);

document.querySelector(".resetBtn").addEventListener("click", (e) => {
    gameGrid.innerHTML = "";
    clearInterval(gameTickIntervalId);
    game = new Game(gridSize);
    game.InitializeGrid();
    game.startGame();
});

document.addEventListener('keypress', (e) => {
    if (game.validKeys.includes(e.key)) {
        const lastDirectionInQueue = game.directionQueue[game.directionQueue.length - 1] || game.direction;
        
        if (e.key !== game.GetOppositeDirection(lastDirectionInQueue)) {
            if (game.directionQueue.length < 2) {
                game.directionQueue.push(e.key);
            }
        }
    }
});

game.InitializeGrid();
game.startGame();