import _ from 'underscore';
import { crearNuevoDeck , pedirCarta, valorCarta} from './usecases';


// Se encierra todo el código en una función anónima con el fin de que no tenga una
// referencia o valor de donde se pueda llamar desde consola. 
const miModulo = (() => {
  "use strict";

  // 2C = Two of Clubs (Tréboles)
  // 2D = Two of Diamonds (Diamantes)
  // 2H = Two of Hearts (Corazones)
  // 2S = Two of Spades (Espadas)

  let deck = [];
  const tipos = ["C", "D", "H", "S"];
  const especiales = ["A", "J", "Q", "K"];

  let puntosJugadores = [];

  const valorSmall       = document.querySelectorAll("small"),
        divCartasJugadores = document.querySelectorAll(".divCartas")

  // Referencias HTML
  const btnPedir   = document.querySelector("#btnPedir"),
        btnNuevo   = document.querySelector("#btnNuevo"),
        btnDetener = document.querySelector("#btnDetener"),
        audioBtn   = document.querySelector("audio");

  //!Aquí se crea el nuevo Deck
  deck = crearNuevoDeck(tipos,especiales);

  //* Ésta función inicializa el juego
  const inicializarJuego = ( numJugadores = 2) => {
    deck = crearNuevoDeck(tipos,especiales);
    puntosJugadores = [];
    for (let i = 0; i < numJugadores; i++) {
        puntosJugadores.push(0);
    }
    valorSmall.forEach( elem => elem.innerText = 0 );
    divCartasJugadores.forEach( elem => elem.innerHTML = '');
    btnPedir.disabled = false;
    btnDetener.disabled = false;
  }

//?  función que retorna los puntos acumulados
  const acumularPuntos = (carta , turno) => {
    puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
    valorSmall[turno].innerText = puntosJugadores[turno];
    return puntosJugadores[turno]; //son los puntos acumulados.
  }

  //? Función que hace que la carta aparezca en el html
  const crearCarta = ( carta , turno) => {
      const imgCarta = document.createElement("img");
      imgCarta.src = `assets/cartas/${carta}.png`;
      imgCarta.classList.add("carta");
      imgCarta.className += " animate__fadeInRight";
      imgCarta.style = "animation-duration: 0.5s;";
      divCartasJugadores[turno].append(imgCarta)
  }

  const determinarGanador = () => {

    const [ puntosMinimos , puntosComputadora ] = puntosJugadores;
    setTimeout(() => {
        if (puntosComputadora === puntosMinimos) {
          audioBtn.setAttribute("src", "assets/audios/wow.mp3");
          audioBtn.play();
          Swal.fire({
            icon: "warning",
            title: "Empate",
            text: "Los dos sacaron el mismo puntaje, intentalo de nuevo.",
          });
        } else if (puntosMinimos > 21) {
          audioBtn.setAttribute("src", "assets/audios/kirby-death.mp3");
          audioBtn.play();
          setTimeout(() => {
            Swal.fire({
              icon: "error",
              title: "Computadora Gana",
              text: "El jugador excedió los 21 puntos.",
            });
          }, 200);
        } else if (puntosComputadora > 21) {
          audioBtn.setAttribute("src", "assets/audios/kirby-victory.mp3");
          audioBtn.play();
          setTimeout(() => {
            Swal.fire({
              icon: "success",
              title: "Jugador Gana",
              text: "La computadora excedió los 21 puntos.",
            });
          }, 20);
        } else {
          audioBtn.setAttribute("src", "assets/audios/kirby-death.mp3");
          audioBtn.play();
          setTimeout(() => {
            Swal.fire({
              icon: "error",
              text: `Sacó ${puntosComputadora} puntos y tú ${puntosMinimos}`,
              title: "Computadora Gana",
            });
          }, 20);
        }
      }, 100);

  }

  //! turno de la computadora
  const turnoComputadora = (puntosMinimos) => {
    let puntosComputadora = 0;
    do {
      const carta = pedirCarta(deck);
    //   puntosComputadora = puntosComputadora + valorCarta(carta);
    //   valorSmall[1].innerText = puntosComputadora;
      puntosComputadora = acumularPuntos( carta , puntosJugadores.length-1 );  
      crearCarta( carta , puntosJugadores.length-1 );
    //   const imgCarta = document.createElement("img");
    //   imgCarta.src = `assets/cartas/${carta}.png`;
    //   imgCarta.classList.add("carta");
    //   imgCarta.className += " animate__fadeInRight";
    //   imgCarta.style = "animation-duration: 0.5s;";
    //   cartaComputadora.append(imgCarta);
    } while ( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

    determinarGanador();
    
  };

  //* Eventos

  //? Btn Pedir Carta
  btnPedir.addEventListener("click", () => {
    const carta = pedirCarta(deck);
    const puntosJugador = acumularPuntos( carta , 0 );

    crearCarta( carta , 0 );
    // const imgCarta = document.createElement("img");
    // imgCarta.className += "animate__fadeInRight";
    // imgCarta.style = "animation-duration: 0.5s;";
    // imgCarta.src = `assets/cartas/${carta}.png`;
    // imgCarta.classList.add("carta");
    // cartaJugador.append(imgCarta);

    if (puntosJugador > 21) {
      // console.warn('Perdiste ya que excediste los 21 puntos');
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(puntosJugador);
    } else if (puntosJugador === 21) {
      console.warn("Genial llegaste a 21");
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(puntosJugadores[0]);
    }
    audioBtn.setAttribute("src", "assets/audios/button-click-off-click.mp3");
    audioBtn.play();
  });

  //? Btn Detener
  btnDetener.addEventListener("click", () => {
    btnPedir.disabled = true;
    btnDetener.disabled = true;
    turnoComputadora(puntosJugadores[0]);
  });

  //? Btn Nuevo
  btnNuevo.addEventListener("click", () => {
    audioBtn.setAttribute("src", "assets/audios/juego-nuevo.mp3");
    audioBtn.play();
    inicializarJuego();
  });

  return {
    nuevoJuego : inicializarJuego
  };
})();
