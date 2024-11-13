class Question {

    moveNoButton() {
        const container = document.querySelector('.container');
        const noButton = document.getElementById('noButton');
        
        // Generiere zufällige Positionen innerhalb des Containers
        const containerRect = container.getBoundingClientRect();
        const maxX = containerRect.width - noButton.offsetWidth;
        const maxY = containerRect.height - noButton.offsetHeight;
    
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
    
        // Setze die neue Position des Buttons
        noButton.style.position = 'absolute';
        noButton.style.left = `${randomX}px`;
        noButton.style.top = `${randomY}px`;
    }
    
    showCongratulations() {
        const container = document.querySelector('.container');
        
        // Entferne den gesamten Inhalt des Containers
        container.innerHTML = '';
        
        // Erstelle ein neues <h1>-Element mit dem Text "Gratulieren"
        const congratsMessage = document.createElement('h1');
        congratsMessage.textContent = 'Gratulieren';
        
        // Füge die Nachricht dem leeren Container hinzu
        container.appendChild(congratsMessage);
    }
    
}

// Erstelle eine Instanz der Klasse Question
const question = new Question();

// Weise die Methoden der Instanz globale Referenzen zu, damit sie im HTML aufgerufen werden können
window.moveNoButton = question.moveNoButton.bind(question);
window.showCongratulations = question.showCongratulations.bind(question);
