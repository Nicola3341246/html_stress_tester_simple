const container = document.getElementById("Container");
        const numberInput = document.getElementById("NumberInput");
        const timeDisplay = document.getElementById("StopWatchDisplay");

        function LoadDivs() {
            let startTime = new Date();
            let htmlContent = '';

            for (let index = 1; index <= numberInput.value; index++) {
                htmlContent += `<p class="TestContainer">
                    Test ${index}
                    </p>`;
            }
            
            container.innerHTML = htmlContent;
            timeDisplay.innerHTML = `Time: ${(new Date - startTime)}ms`;
        }

        function Clear(){
            container.innerHTML = '';
            timeDisplay.innerHTML = 'Time: XXXms'
        }