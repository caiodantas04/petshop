import { phases } from './phases.js';
import { renderChoices, updateGameState } from './gameLogic.js';

let currentPhase = 0;
let lives = 3;

function startGame() {
    renderPhase();
}

function renderPhase() {
    const phase = phases[currentPhase];
    document.getElementById("story-text").textContent = phase.text;
    renderChoices(phase.choices, handleChoice);
    document.getElementById("score").textContent = `Vidas: ${lives}`;
}

function handleChoice(choice) {
    updateGameState(choice, lives, currentPhase, setLives, setCurrentPhase);
}
function renderPhase() {
    const phase = phases[currentPhase];
    
    // Atualiza o texto da história
    document.getElementById("story-text").textContent = phase.text;
    
    // Atualiza a imagem de fundo conforme a fase
    document.getElementById("scene-image").src = phase.image;

    // Renderiza as opções de escolha
    renderChoices(phase.choices, handleChoice);

    // Atualiza o contador de vidas
    document.getElementById("score").textContent = `Vidas: ${lives}`;
}


function setLives(newLives) {
    lives = newLives;
}

function setCurrentPhase(newPhase) {
    currentPhase = newPhase;
    renderPhase();
}

startGame();
function renderPhase() {
    const phase = phases[currentPhase];
    document.getElementById("story-text").textContent = phase.text;
    document.getElementById("character-img").src = phase.image; // Atualiza a imagem
    renderChoices(phase.choices, handleChoice);
    document.getElementById("score").textContent = `Vidas: ${lives}`;
}

