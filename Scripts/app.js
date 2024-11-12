const testItemContainer = document.getElementById("testItemContainer");
const numberInput = document.getElementById("NumberInput");
const timeDisplay = document.getElementById("StopWatchDisplay");
const currentTheme = localStorage.getItem('theme');
var form = document.getElementById("inputRow");
var toggleSwitch = document.getElementById("checkbox");

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

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

function SwitchTheme(event) {
    if (event.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    else {        
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }    
}

function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);
toggleSwitch.addEventListener('change', SwitchTheme, false);