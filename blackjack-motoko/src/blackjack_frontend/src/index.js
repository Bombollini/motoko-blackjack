// This file contains the JavaScript code for the frontend, handling user interactions and communicating with the backend.

const { Actor, HttpAgent } = require('@dfinity/agent');
const { idlFactory } = require('../../../../src/blackjack_backend/main.did.js');
const { Principal } = require('@dfinity/principal');

const agent = new HttpAgent();
const backendCanisterId = 'your_backend_canister_id_here'; // Replace with your actual backend canister ID
const backendActor = Actor.createActor(idlFactory, { agent, canisterId: Principal.fromText(backendCanisterId) });

document.addEventListener('DOMContentLoaded', () => {
    const createGameButton = document.getElementById('create-game');
    const betInput = document.getElementById('bet-amount');
    const gameStateDisplay = document.getElementById('game-state');

    createGameButton.addEventListener('click', async () => {
        const initialHP = 100; // Example initial HP
        const gameState = await backendActor.createGame(initialHP);
        updateGameStateDisplay(gameState);
    });

    // Additional event listeners for other game actions can be added here
});

function updateGameStateDisplay(gameState) {
    if (gameState) {
        gameStateDisplay.innerText = JSON.stringify(gameState, null, 2);
    } else {
        gameStateDisplay.innerText = 'No game state available.';
    }
}