let testItemContainer = document.getElementById("testItemContainer");
let numberInput = document.getElementById("NumberInput");
let timeDisplay = document.getElementById("StopWatchDisplay");
var form = document.getElementById("inputRow");

function LoadDivs() {
    let startTime = new Date();
    let htmlContent = '';

    for (let index = 1; index <= numberInput.value; index++) {
        htmlContent += `<p class="TestContainer">
        Test ${index}
        </p>`;
    }
    
    testItemContainer.innerHTML = htmlContent;
    timeDisplay.innerHTML = `Time: ${(new Date - startTime)}ms`;
}

function Clear(){
    testItemContainer.innerHTML = '<div class="FactoryLoader"></div>';
    timeDisplay.innerHTML = 'Time: XXXms'
}

function handleForm(event) { event.preventDefault(); } 

function elementStressTestInitialize(){
    console.log("Initialize stress test")
    testItemContainer = document.getElementById("testItemContainer");
    numberInput = document.getElementById("NumberInput");
    timeDisplay = document.getElementById("StopWatchDisplay");
    form = document.getElementById("inputRow");
    
    form.addEventListener('submit', handleForm);
}