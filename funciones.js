/**
 * Módulo de funciones para el juego del Ahorcado
 * Contiene funciones reutilizables para la lógica del juego
 */

/**
 * Carga el archivo JSON de palabras
 * @param {string} archivo - Nombre del archivo JSON a cargar (por defecto: "words.json")
 * @returns {Promise<Array>} Array de palabras
 */
export async function cargarPalabras(archivo = "words.json") {
  try {
    const response = await fetch(archivo);
    if (!response.ok) {
      throw new Error("Error al cargar el archivo JSON");
    }
    const data = await response.json();
    return data.words;
  } catch (error) {
    console.error("Error cargando palabras:", error);
    throw error;
  }
}

/**
 * Selecciona una palabra aleatoria del array
 * @param {Array} palabras - Array de objetos con palabras
 * @returns {string} Palabra secreta en mayúsculas
 */
export function obtenerPalabraAleatoria(palabras) {
  const indiceAleatorio = Math.floor(Math.random() * palabras.length);
  return palabras[indiceAleatorio].item.toUpperCase();
}

/**
 * Crea la visualización inicial de la palabra con guiones
 * @param {string} palabra - Palabra secreta
 * @returns {Array} Array con guiones para cada letra
 */
export function crearGuiones(palabra) {
  return Array(palabra.length).fill("_");
}

/**
 * Valida que el input sea una única letra
 * @param {string} input - Texto introducido por el usuario
 * @returns {Object} {valido: boolean, mensaje: string}
 */
export function validarInput(input) {
  if (!input || input.trim() === "") {
    return { valido: false, mensaje: "Por favor, introduce una letra" };
  }

  if (input.length > 1) {
    return { valido: false, mensaje: "Solo puedes introducir una letra" };
  }

  if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/.test(input)) {
    return { valido: false, mensaje: "Solo se permiten letras" };
  }

  return { valido: true, mensaje: "" };
}

/**
 * Comprueba si una letra existe en la palabra secreta
 * @param {string} letra - Letra a comprobar
 * @param {string} palabraSecreta - Palabra secreta
 * @returns {Array} Array de índices donde aparece la letra (vacío si no existe)
 */
export function comprobarLetra(letra, palabraSecreta) {
  const letraMayuscula = letra.toUpperCase();
  const indices = [];

  for (let i = 0; i < palabraSecreta.length; i++) {
    if (palabraSecreta[i] === letraMayuscula) {
      indices.push(i);
    }
  }

  return indices;
}

/**
 * Actualiza el array de letras descubiertas
 * @param {Array} letrasDescubiertas - Array actual de letras descubiertas
 * @param {string} letra - Letra a revelar
 * @param {Array} indices - Índices donde aparece la letra
 * @returns {Array} Array actualizado
 */
export function revelarLetras(letrasDescubiertas, letra, indices) {
  const nuevoArray = [...letrasDescubiertas];
  indices.forEach((indice) => {
    nuevoArray[indice] = letra.toUpperCase();
  });
  return nuevoArray;
}

/**
 * Comprueba si el juego ha sido ganado
 * @param {Array} letrasDescubiertas - Array de letras descubiertas
 * @returns {boolean} True si no quedan guiones
 */
export function comprobarVictoria(letrasDescubiertas) {
  return !letrasDescubiertas.includes("_");
}

/**
 * Actualiza la imagen del ahorcado
 * @param {number} intentos - Número de intentos fallidos
 * @returns {string} Ruta de la imagen
 */
export function obtenerImagenAhorcado(intentos) {
  return `images/Hangman-${intentos}.png`;
}

/**
 * Renderiza la palabra en el DOM
 * @param {Array} letrasDescubiertas - Array de letras descubiertas
 * @param {HTMLElement} contenedor - Elemento contenedor
 */
export function renderizarPalabra(letrasDescubiertas, contenedor) {
  contenedor.innerHTML = "";
  letrasDescubiertas.forEach((letra) => {
    const letraBox = document.createElement("span");
    letraBox.className = "letter-box";
    letraBox.textContent = letra === "_" ? "" : letra;
    contenedor.appendChild(letraBox);
  });
}
