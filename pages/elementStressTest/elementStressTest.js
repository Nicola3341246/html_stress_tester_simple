const testItemContainer = document.getElementById("testItemContainer");
const numberInput = document.getElementById("NumberInput");
const timeDisplay = document.getElementById("StopWatchDisplay");
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
form.addEventListener('submit', handleForm);