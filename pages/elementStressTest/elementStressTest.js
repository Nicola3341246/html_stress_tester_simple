const ids = {
    testItemContainer: "elementStressTest-testItemContainer",
    numberInput: "elementStressTest-numberInput",
    timeDisplay: "elementStressTest-stopWatchDisplay",
    form: "elementStressTest-inputRow",
}
let testItemContainer = document.getElementById(ids.testItemContainer);
let numberInput = document.getElementById(ids.numberInput);
let timeDisplay = document.getElementById(ids.timeDisplay);
var form = document.getElementById(ids.form);

function LoadDivs() {
    let startTime = new Date();
    let htmlContent = '';

    if (numberInput.value == '' || numberInput.value == 0) {
        Clear();
        return;
    }

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
    testItemContainer = document.getElementById(ids.testItemContainer);
    numberInput = document.getElementById(ids.numberInput);
    timeDisplay = document.getElementById(ids.timeDisplay);
    form = document.getElementById(ids.form);
    
    form.addEventListener('submit', handleForm);
}