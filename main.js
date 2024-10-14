
const botones = document.getElementsByClassName('boton');
const elevator = document.querySelector('.elevator');
let elevatorStyles = getComputedStyle(elevator);
let ascensorActivo = false;
let subiendo = false;
let bajando = false;
let colaDePisos = [];
let pisoActual = 0;
let pisoObjetivo;

/* Colocar los botones en su respectivo gridRow */
for (let i = 0; i < botones.length; i++) {
    botones[i].style.gridRow = (i + 1).toString();
}

/* Añadir onclick a todos los botones */
for (let boton of botones) {
    boton.addEventListener("click", function () {

        boton.style.backgroundColor = "red"; /* mostrar visualmente el botón activado */
        let pisoBoton = parseInt(boton.textContent); /* convertir el numero del boton a Int para usarlo en comparaciones */

        if (ascensorActivo) { /* ascensor está en movimiento */
            if (subiendo) { /* ascensor está subiendo */
                if (pisoBoton < pisoActual) {
                    bajando = true;
                    bajarA(pisoBoton, boton);
                } else {
                    subiendo = true;
                    subirA(pisoBoton, boton);
                }
            } else {

            }
        } else { /* ascensor está parado */
            ascensorActivo = true; /* mostar el ascensor en movimiento */
            pisoObjetivo = pisoBoton;
            if (pisoBoton < pisoActual) {
                bajando = true;
                bajarA(pisoBoton, boton);
            } else {
                subiendo = true;
                subirA(pisoBoton, boton);
            }
        }
    });
}

function irAPisoObjetivo() {
    while (colaDePisos[0]) {
        if (pisoObjetivo < pisoActual) {
            bajarA(pisoObjetivo);
        } else {
            subirA(pisoObjetivo);
        }
    }
}

function subirA(boton) {
    const intervalId = setInterval(() => {
        /* condición para mover el ascensor */
        if (pisoObjetivo > pisoActual) { 
            elevator.style.gridRow = (parseInt(elevatorStyles.gridRow) - 1);
            pisoActual += 1;
        }
        /* condición para comprobar la llegada */
        if (pisoObjetivo === pisoActual) {
            boton.style.backgroundColor = "white";
            clearInterval(intervalId);
        }
    }, 3000);
}

function bajarA(boton) {
    const intervalId = setInterval(() => {
        /* condición para mover el ascensor */
        if (pisoObjetivo < pisoActual) { 
            elevator.style.gridRow = (parseInt(elevatorStyles.gridRow) + 1);
            pisoActual -= 1;
        }
        /* condición para comprobar la llegada */
        if (pisoObjetivo === pisoActual) {
            boton.style.backgroundColor = "white";
            clearInterval(intervalId);
        }
    }, 3000);
}