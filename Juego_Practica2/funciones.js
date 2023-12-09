document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const contenedor = document.getElementById('grid-container');
    const cronometroElement = document.getElementById('cronometro');
    const numeros = [];

    const modoOscuroGuardado = localStorage.getItem('modoOscuro');
    if (modoOscuroGuardado) {
        body.classList.add('dark-mode');
        cronometroElement.style.color = 'white';
    }

    for (let i = 1; i <= 25; i++) {
        numeros.push(i);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffleArray(numeros);

    let numeroEsperado = 1;
    let cronometro;
    let segundos = 0;

    numeros.forEach(function (numero) {
        const div = document.createElement("div");
        div.textContent = numero;
        div.classList.add("numero");
        div.addEventListener("click", function () {
            const numeroClickeado = parseInt(div.textContent);

            if (numeroClickeado === numeroEsperado) {
                div.classList.add("resaltado");
                if (numeroEsperado === 1) {
                    iniciarCronometro();
                } else if (numeroEsperado === 50) {
                    detenerCronometro();
                    alert("¡Felicidades! Has encontrado todos los números.");
                }
                numeroEsperado++;
                mostrarSiguienteNumero(div);
            } else {
                // Si quisiera que pasara algo al pulsar de manera incorrecta lo pondría aquí
            }
        });
        contenedor.appendChild(div);
    });

    function mostrarSiguienteNumero(div) {
        const numeroActual = parseInt(div.textContent);

        if (numeroActual <= 25) {
            const siguienteNumero = numeroActual + 25;

            if (siguienteNumero <= 50) {
                div.textContent = siguienteNumero;
            }

            const siguienteDiv = document.querySelector(`.numero:empty`);
            siguienteDiv.classList.remove("oculto");
            ordenarNumeros();
        } else if (numeroActual >= 26 && numeroActual <= 50) {
            div.textContent = '';
            div.classList.add("oculto");
        }
    }

    function ordenarNumeros() {
        const numerosOrdenados = Array.from(document.querySelectorAll('.numero')).map(div => parseInt(div.textContent));
        numerosOrdenados.sort((a, b) => a - b);
        numerosOrdenados.forEach((numero, index) => {
            const div = document.querySelector(`.numero:contains(${numero})`);
            div.style.order = index + 1;
        });
    }

    function iniciarCronometro() {
        cronometro = setInterval(function () {
            segundos++;
            cronometroElement.textContent = formatarTiempo(segundos);
        }, 10);
    }

    function detenerCronometro() {
        clearInterval(cronometro);
    }

    function formatarTiempo(milisegundos) {
        const segundos = Math.floor(milisegundos / 100);
        const segundosFormateados = segundos < 10 ? `0${segundos}` : segundos;
        const milisegundosFormateados = milisegundos % 100 < 10 ? `0${milisegundos % 100}` : milisegundos % 100;
        return `${segundosFormateados}.${milisegundosFormateados}`;
    }

    const reiniciarBtn = document.getElementById('reiniciar');
    reiniciarBtn.addEventListener('click', reiniciarPartida);

    const modoOscuroBtn = document.getElementById('modoOscuro');
    modoOscuroBtn.addEventListener('click', cambiarModoOscuro);

    function reiniciarPartida() {
        const modoOscuro = body.classList.contains('dark-mode');
        location.reload();
        if (modoOscuro) {
            body.classList.add('dark-mode');
            cronometroElement.style.color = 'white';
        }
    }

    function cambiarModoOscuro() {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('modoOscuro', 'true');
            cronometroElement.style.color = 'white';
        } else {
            localStorage.removeItem('modoOscuro');
            cronometroElement.style.color = '#333';
        }
    }
});

document.querySelector.extend({
    contains: function (text) {
        return function (node) {
            return (node.textContent || node.innerText || '').toLowerCase().indexOf(text.toLowerCase()) > -1;
        };
    }
});
