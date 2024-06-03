let flashcards = [];
let currentIndex = -1;
let randomOrder = false;
let shuffledFlashcards = [];

function loadCSV() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    if (file) {
        readCSVFile(file)
            .then(text => {
                flashcards = parseCSV(text);
                if (flashcards.length > 0) {
                    currentIndex = -1;
                    updateOrder();
                    nextQuestion();
                } else {
                    alert('No valid data found in CSV.');
                }
            })
            .catch(error => {
                console.error('Error reading file:', error);
                alert('Failed to load the file. Please try again.');
            });
    } else {
        alert('Please select a file.');
    }
}

function readCSVFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target.result);
        };
        reader.onerror = function (e) {
            reject(e.target.error);
        };
        reader.readAsText(file);
    });
}

function parseCSV(text) {
    const lines = text.split(/\r?\n/);
    const result = [];
    const headers = lines[0].split(',').map(header => header.trim());

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue; // Skip empty lines
        const obj = {};
        const currentline = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].toLowerCase()] = currentline[j] ? currentline[j].trim() : '';
        }
        result.push(obj);
    }
    return result;
}

function showHint() {
    document.getElementById('hint').style.display = 'block';
}

function showAnswer() {
    document.getElementById('answer').style.display = 'block';
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex >= flashcards.length) {
        alert('You have reached the end of the flashcards.');
        document.getElementById('flashcard').style.display = 'none';
        return;
    }

    const currentCard = randomOrder ? shuffledFlashcards[currentIndex] : flashcards[currentIndex];
    document.getElementById('question').innerText = currentCard.question || 'No question available';
    document.getElementById('hint').innerText = currentCard.hint || 'No hint available';
    document.getElementById('answer').innerText = currentCard.answer || 'No answer available';
    document.getElementById('hint').style.display = 'none';
    document.getElementById('answer').style.display = 'none';
    document.getElementById('flashcard').style.display = 'block';
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateOrder() {
    const order = document.querySelector('input[name="order"]:checked').value;
    randomOrder = order === 'random';
    if (randomOrder) {
        shuffledFlashcards = [...flashcards];
        shuffleArray(shuffledFlashcards);
    }
}

document.querySelectorAll('input[name="order"]').forEach(input => {
    input.addEventListener('change', () => {
        updateOrder();
        currentIndex = -1;
        nextQuestion();
    });
});
