class Question {

    moveNoButton() {
        const container = document.querySelector('.Container');
        const noButton = document.getElementById('noButton');
        
        const containerRect = container.getBoundingClientRect();
        const maxX = containerRect.width - noButton.offsetWidth;
        const maxY = containerRect.height - noButton.offsetHeight;
    
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
    
        noButton.style.position = 'absolute';
        noButton.style.left = `${randomX}px`;
        noButton.style.top = `${randomY}px`;
    }
    
    showCongratulations() {
        const area = document.querySelector('.Area');
        
        area.innerHTML = '';
        
        area.innerHTML = `<h1>Gratuliere!</h1>`;
    }
}

const question = new Question();

window.moveNoButton = question.moveNoButton.bind(question);
window.showCongratulations = question.showCongratulations.bind(question);
