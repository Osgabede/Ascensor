
const botones = document.getElementsByClassName('boton');
const ascensor = document.querySelector('.elevator');
let ascensorPosicionGrid = parseInt(getComputedStyle(ascensor).gridRow);
let ascensorActivo = false;
let subiendo = false;
let bajando = false;
let colaDePisos = [];
let pisoActual = 0;
let pisoObjetivo;
let intervaloId = null;

/* Colocar los botones en su respectivo gridRow */
for (let i = 0; i < botones.length; i++) {
  botones[i].style.gridRow = (i + 1).toString();
}

/* Añadir onclick a todos los botones */
for (let boton of botones) {
  boton.addEventListener("click", function () {

    boton.disabled = true;  /* deshabilito el botón */
    boton.style.backgroundColor = "red"; /* mostrar visualmente el botón activado */
    let pisoBoton = parseInt(boton.textContent); /* convertir el numero del boton a Int para usarlo en comparaciones */

    /* ----------- Cáculo de orden de prioridades ----------- */

    if (ascensorActivo) {                                 /* -el ascensor está activo- */
      if (subiendo) {                                       /* -el ascensor está subiendo- */
        if (pisoBoton > pisoActual) {                         /* -piso pulsado está por encima del ascensor- */
          if (pisoBoton > pisoObjetivo) {                       /* -piso pulsado es más alto que el pisoObjetivo- */
            colaDePisos.unshift(pisoBoton);                       /* inserto el piso del botón pulsado en la posición de más prioridad */
            pisoObjetivo = pisoBoton;                             /* asigno pisoBotón a pisoObjetivo */
          } else if (pisoBoton < pisoObjetivo) {                /* -piso pulsado es más bajo que el pisoObjetivo- */
            for (let i = 1; i < colaDePisos.length; i++) {        /* recorro la cola de pisos en orden de prioridad saltando el pisoObjetivo */
              if (colaDePisos[i] > pisoBoton) {                     /* -encuentro un piso con más prioridad que el pulsado- */
                colaDePisos.splice(i+1, 0, pisoBoton);                /* inserto el piso pulsado justo después */
                break;                                                /* salgo del bucle */
              }
            }
          }
        } else {                                              /* -piso pulsado está por debajo del ascensor- */
          if (colaDePisos.length > 1) {                         /* -cola de pisos tiene más de 1 piso en cola- */
            for (let i = colaDePisos.length-1; i > 0; i--) {      /* recorro la cola de pisos en orden de menos prioridad */
              if (colaDePisos[i] > pisoBoton) {                     /* -encuentro un piso con más prioridad que el pulsado- */
                colaDePisos.splice(i+1, 0, pisoBoton);                /* inserto el piso pulsado justo después */
                break;                                                /* salgo del bucle */
              }
            }
          } else {                                              /* -cola de pisos tiene 1 solo piso- */
            colaDePisos.push(pisoBoton);
          }
        }
                
      } else if (bajando) {                                /* -el ascensor está bajando- */
        if (pisoBoton < pisoActual) {                       /* -piso pulsado está por debajo del ascensor- */
          if (pisoBoton > pisoObjetivo) {                     /* -piso pulsado es más alto que el pisoObjetivo- */
            colaDePisos.unshift(pisoBoton);                     /* inserto el piso del botón pulsado en la posición de más prioridad */
            pisoObjetivo = pisoBoton;                           /* asigno pisoBotón a pisoObjetivo */
          } else {                                            /* -piso pulsado es más bajo que el pisoObjetivo- */
            if (colaDePisos.length > 1) {                       /* -cola de pisos tiene más de 1 piso en cola- */
              for (let i = 1; i < colaDePisos.length; i++) {      /* recorro la cola de pisos en orden de prioridad saltando el pisoObjetivo */
                if (colaDePisos[i] > pisoBoton) {                   /* -encuentro un piso con más prioridad que el pulsado- */
                  colaDePisos.splice(i+1, 0, pisoBoton);              /* inserto el piso pulsado justo después */
                  break;                                              /* salgo del bucle */
                }
              }
            } else {                                            /* -cola de pisos tiene 1 solo piso- */
              colaDePisos.push(pisoBoton);
            }
          }
        } else {                                                    /* -piso pulsado está por encima del ascensor- */
          if (colaDePisos.length > 1) {                               /* -cola de pisos tiene más de 1 piso en cola- */
            for (let i = colaDePisos.length-1; i > 0; i--) {            /* recorro la cola de pisos en orden de menos prioridad */
              if (colaDePisos[i] > pisoBoton) {                           /* -encuentro un piso con más prioridad que el pulsado- */
                colaDePisos.splice(i+1, 0, pisoBoton);                      /* inserto el piso pulsado justo después */
                break;                                                      /* salgo del bucle */
              }
            }
          } else {                                                    /* -cola de pisos tiene 1 solo piso- */
            colaDePisos.push(pisoBoton);
          }
        }
      }
    } else {                                  /* -el ascensor está parado- */
      colaDePisos.unshift(pisoBoton);           /* inserto el piso del botón pulsado en la posición de más prioridad */
      pisoObjetivo = pisoBoton;                 /* asigno pisoBotón a pisoObjetivo */
    }

    /* ------------------------------------------------------ */

    ascensorActivo = true;      /* marco el ascensor como activo */
    if (!intervaloId) {  /* compruebo que el intervalo esté inactivo */
      irAPisoObjetivo();     /* llamo a la función que mueve el ascensor */
    }
  });
}

function irAPisoObjetivo() {
  intervaloId = setInterval(() => {
    subiendo = false;
    bajando = false;                              /* reinicio el estado del ascensor para que se actualice */

    if (pisoObjetivo < pisoActual) {              /* -si el objetivo está más abajo que el ascensor- */
      bajando = true;                               /* asigno variable bajando */
      pisoActual -= 1;                              /* bajo el ascensor 1 posición */
      ascensorPosicionGrid += 1;                    /* le aplico el estilo al css */
      ascensor.style.gridRow = ascensorPosicionGrid;
    } else if (pisoObjetivo > pisoActual) {       /* -si el objetivo está más arriba que el ascensor- */
      subiendo = true;                              /* asigno variable subiendo */
      pisoActual += 1;                              /* subo el ascensor 1 posición */
      ascensorPosicionGrid -= 1;                    /* le aplico el estilo al css */
      ascensor.style.gridRow = ascensorPosicionGrid;
    }
    if (pisoObjetivo === pisoActual) {                        /* -el ascensor llega al objetivo- */
      colaDePisos.shift();                                      /* elimino el primer piso de la cola */
      let botonPisoActual = Array.from(botones).find(boton =>   /* busco el botón del piso actual */
        parseInt(boton.textContent) === pisoObjetivo);
      botonPisoActual.style.backgroundColor = "white";          /* cambio el color del botón para indicar que ha llegado */
      botonPisoActual.disabled = false;                         /* vuelvo a habilitar el botón */
      if (typeof colaDePisos[0] === "undefined") {  /* -el array está vacío- */
        ascensorActivo = false;                       /* el ascensor ya no está en movimiento */
        clearInterval(intervaloId);                   /* paro el proceso de repetición */
      } else {                                      /* -hay al menos otro piso en el array- */
        pisoObjetivo = colaDePisos[0];                /* asignamos nuevo piso objetivo con el siguiente elemento del arrray */
      }
    }

  }, 2000);
}