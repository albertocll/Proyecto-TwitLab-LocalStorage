// Variables
const formulario = document.querySelector('#formulario');
const listaTweets = document.querySelector('#lista-tweets');
const textarea = document.querySelector('#tweet');
const contador = document.querySelector('#contador');
let tweets = [];

// Event Listeners
eventListeners();

function eventListeners() {
    formulario.addEventListener('submit', agregarTweet);

    // contador caracteres
    textarea.addEventListener('input', actualizarContador);

    document.addEventListener('DOMContentLoaded', () => {
        tweets = JSON.parse(localStorage.getItem('tweets')) || [];
        crearHTML();
    });
}

// Funciones
function agregarTweet(e) {
    e.preventDefault();

    const tweet = textarea.value.trim();

    if (tweet === '') {
        mostrarMensaje('Un mensaje de texto no puede ir vacío', 'error');
        return;
    }

    const tweetObj = {
        id: Date.now(),
        tweet,
        fecha: new Date().toLocaleString()
    };

    tweets = [...tweets, tweetObj];
    crearHTML();

    mostrarMensaje('Tweet agregado ✔', 'success');

    formulario.reset();
    actualizarContador(); // reset contador
}

function mostrarMensaje(msg, tipo) {
    const mensaje = document.createElement('p');
    mensaje.textContent = msg;
    mensaje.classList.add(tipo);

    const contenido = document.querySelector('#contenido');
    contenido.appendChild(mensaje);

    setTimeout(() => {
        mensaje.remove();
    }, 2000);
}

function crearHTML() {
    limpiarHTML();

    if (tweets.length > 0) {
        tweets.forEach(tweet => {
            const btnEliminar = document.createElement('a');
            btnEliminar.classList.add('borrar-tweet');
            btnEliminar.innerText = 'X';
            btnEliminar.onclick = () => borrarTweet(tweet.id);

            const li = document.createElement('li');
            li.innerHTML = `
                <p>${tweet.tweet}</p>
                <span class="fecha">${tweet.fecha}</span>
            `;
            li.appendChild(btnEliminar);

            listaTweets.appendChild(li);
        });
    }

    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('tweets', JSON.stringify(tweets));
}

function borrarTweet(id) {
    tweets = tweets.filter(tweet => tweet.id !== id);
    crearHTML();
    mostrarMensaje('Tweet eliminado ❌', 'error');
}

function limpiarHTML() {
    while (listaTweets.firstChild) {
        listaTweets.removeChild(listaTweets.firstChild);
    }
}

// Contador de caracteres
function actualizarContador() {
    const max = 200;
    const restantes = max - textarea.value.length;
    contador.textContent = `${restantes} caracteres restantes`;

    if (restantes < 20) {
        contador.style.color = 'red';
    } else {
        contador.style.color = '';
    }
}
