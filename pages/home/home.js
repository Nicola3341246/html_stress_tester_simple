const snakeButton = document.getElementById("snakeButton");
snakeButton.addEventListener("click", OpenSnakePage);

function OpenSnakePage(){
    console.log("opensnake");
    window.location.replace = "http://127.0.0.1:5500/?#snake";
}