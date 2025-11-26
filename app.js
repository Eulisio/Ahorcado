/**
 * Aplicación principal del juego del Ahorcado
 * Gestiona el estado del juego y la interacción con el usuario
 */

import {
    cargarPalabras,
    obtenerPalabraAleatoria,
    crearGuiones,
    validarInput,
    comprobarLetra,
    revelarLetras,
    comprobarVictoria,
    obtenerImagenAhorcado,
    renderizarPalabra
} from './funciones.js';

// Constantes del juego
const MAX_INTENTOS = 8;

// Estado del juego
let palabraSecreta = '';
let letrasDescubiertas = [];
let intentosFallidos = 0;
let juegoTerminado = false;
let letrasUsadas = new Set();

// Elementos del DOM
const wordContainer = document.getElementById('word-container');
const letterInput = document.getElementById('letter-input');
const checkBtn = document.getElementById('check-btn');
const hangmanImg = document.getElementById('hangman-img');
const attemptsLeft = document.getElementById('attempts-left');
const resultMessage = document.getElementById('result-message');
const restartBtn = document.getElementById('restart-btn');
const titulo = document.getElementById('titulo');
const tituloFinal = document.getElementById('titulo-final');

/**
 * Inicializa el juego
 */
async function inicializarJuego() {
    try {
        // Cargar palabras del JSON
        const palabras = await cargarPalabras();
        
        // Obtener palabra aleatoria
        palabraSecreta = obtenerPalabraAleatoria(palabras);
        console.log('Palabra secreta (para debug):', palabraSecreta);
        
        // Inicializar estado
        letrasDescubiertas = crearGuiones(palabraSecreta);
        intentosFallidos = 0;
        juegoTerminado = false;
        letrasUsadas.clear();
        
        // Renderizar palabra inicial
        renderizarPalabra(letrasDescubiertas, wordContainer);
        
        // Resetear imagen
        hangmanImg.src = obtenerImagenAhorcado(0);
        
        // Resetear intentos
        actualizarIntentos();
        
        // Limpiar mensajes
        resultMessage.classList.add('hidden');
        restartBtn.classList.add('hidden');
        
        // Resetear título
        tituloFinal.textContent = '';
        
        // Habilitar controles
        letterInput.disabled = false;
        checkBtn.disabled = false;
        letterInput.value = '';
        letterInput.focus();
        
    } catch (error) {
        console.error('Error inicializando el juego:', error);
        mostrarError('Error al cargar el juego. Por favor, recarga la página.');
    }
}

/**
 * Procesa la letra introducida por el usuario
 */
function procesarLetra() {
    if (juegoTerminado) return;
    
    try {
        const letra = letterInput.value;
        
        // Validar input
        const validacion = validarInput(letra);
        if (!validacion.valido) {
            alert(validacion.mensaje);
            letterInput.value = '';
            letterInput.focus();
            return;
        }
        
        const letraMayuscula = letra.toUpperCase();
        
        // Comprobar si la letra ya fue usada
        if (letrasUsadas.has(letraMayuscula)) {
            alert('Ya has usado esta letra. Intenta con otra.');
            letterInput.value = '';
            letterInput.focus();
            return;
        }
        
        // Añadir letra a las usadas
        letrasUsadas.add(letraMayuscula);
        
        // Comprobar si la letra existe en la palabra
        const indices = comprobarLetra(letra, palabraSecreta);
        
        if (indices.length > 0) {
            // Letra correcta - revelar
            letrasDescubiertas = revelarLetras(letrasDescubiertas, letra, indices);
            renderizarPalabra(letrasDescubiertas, wordContainer);
            
            // Comprobar victoria
            if (comprobarVictoria(letrasDescubiertas)) {
                finalizarJuego(true);
            }
        } else {
            // Letra incorrecta - incrementar intentos fallidos
            intentosFallidos++;
            actualizarIntentos();
            
            // Actualizar imagen
            hangmanImg.src = obtenerImagenAhorcado(intentosFallidos);
            
            // Comprobar derrota
            if (intentosFallidos >= MAX_INTENTOS) {
                finalizarJuego(false);
            }
        }
        
        // Limpiar input
        letterInput.value = '';
        letterInput.focus();
        
    } catch (error) {
        console.error('Error procesando letra:', error);
        mostrarError('Error al procesar la letra. Intenta de nuevo.');
    }
}

/**
 * Actualiza el contador de intentos restantes
 */
function actualizarIntentos() {
    const restantes = MAX_INTENTOS - intentosFallidos;
    attemptsLeft.textContent = restantes;
    
    // Cambiar color según intentos restantes
    if (restantes <= 2) {
        attemptsLeft.style.color = '#ef4444';
    } else if (restantes <= 4) {
        attemptsLeft.style.color = '#f59e0b';
    } else {
        attemptsLeft.style.color = '#6366f1';
    }
}

/**
 * Finaliza el juego (victoria o derrota)
 * @param {boolean} victoria - True si el jugador ganó
 */
function finalizarJuego(victoria) {
    juegoTerminado = true;
    letterInput.disabled = true;
    checkBtn.disabled = true;
    
    if (victoria) {
        // Victoria
        tituloFinal.textContent = '...a quien has Ayudado';
        resultMessage.textContent = `¡Felicidades! Has salvado al abogado. La palabra era: ${palabraSecreta}`;
        resultMessage.classList.remove('lose', 'hidden');
        resultMessage.classList.add('win');
    } else {
        // Derrota
        tituloFinal.textContent = '...que tengo aquí colgado';
        
        // Revelar palabra completa
        letrasDescubiertas = palabraSecreta.split('');
        renderizarPalabra(letrasDescubiertas, wordContainer);
        
        resultMessage.textContent = `¡Oh no! El abogado ha sido ahorcado. La palabra era: ${palabraSecreta}`;
        resultMessage.classList.remove('win', 'hidden');
        resultMessage.classList.add('lose');
    }
    
    // Mostrar botón de reinicio
    restartBtn.classList.remove('hidden');
}

/**
 * Muestra un mensaje de error
 * @param {string} mensaje - Mensaje de error
 */
function mostrarError(mensaje) {
    resultMessage.textContent = mensaje;
    resultMessage.classList.remove('win', 'lose', 'hidden');
    resultMessage.style.background = 'rgba(239, 68, 68, 0.2)';
    resultMessage.style.borderColor = '#ef4444';
    resultMessage.style.color = '#ef4444';
}

/**
 * Event Listeners
 */
checkBtn.addEventListener('click', procesarLetra);

letterInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        procesarLetra();
    }
});

// Prevenir entrada de números y caracteres especiales en tiempo real
letterInput.addEventListener('input', (e) => {
    const valor = e.target.value;
    if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]?$/.test(valor)) {
        e.target.value = '';
    }
});

restartBtn.addEventListener('click', inicializarJuego);

// Inicializar el juego al cargar la página
inicializarJuego();
