(() => {
    /*
    * 2C = Two of Clubs
    * 2D = Two of Diamonds
    * 2H = Two of Hearts
    * 2S = Two of Spades
    */
    'use strict'
    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'],
          especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];

    // Referencias del HTML.  (#) es para referenciar el ID. (.) Para referenciar la clase.
    const btnPedir = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo = document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas');

    const puntosHTML = document.querySelectorAll('small');

    //Función para iniciar el juego.
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for(let i = 0; i < numJugadores; i++){
            puntosJugadores.push(0);
        }

        // puntosHTML[0].innerText = 0;
        // puntosHTML[1].innerText = 0;
        puntosHTML.forEach(elem => elem.innerText = 0);

        // divCartasJugadores[0].innerHTML = '';
        // divCartasJugadores[1].innerHTML = ''; 
        divCartasJugadores.forEach(elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }

    //Función para crear un nuevo deck.
    const crearDeck = () => {
        deck = [];
        for(let i = 2; i <= 10; i++){
            for(let tipo of tipos){
                deck.push(i + tipo);
            }
        }

        for(let tipo of tipos){
            for(let especial of especiales){
                deck.push(especial + tipo);
            }
        }
        // console.log(deck);
        return _.shuffle(deck);
    }

    //Función permite tomar una carta.
    const pedirCarta = () => {
        if(deck.length === 0){
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    }

    // Función para convertir el valor de la carta de strings a ints.
    const valorCarta = (carta) => {

        const valor = carta.substring(0, carta.length - 1);
        return ( isNaN( valor ) ) ? 
               ( valor === 'A' ) ? 11 : 10
               : valor * 1;

        // return (!isNaN(carta.substring(0, carta.length - 1))) ? carta.substring(0, carta.length - 1) * 1 : 
        //     (carta.substring(0, carta.length - 1) === 'A') ? 11 : 10;    
        
    }

    // Turno: [0] = primer jugador y el último será la computadora [puntosJugadores.length - 1].
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] += valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        // <img class="carta" src="assets/cartas/2C.png">
        const imgCarta = document.createElement('img');
        // .src para agregar la fuente
        imgCarta.src = `assets/cartas/${carta}.png`;
        // classList.add para agregar la clase
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
        
    }

    const determinarGanador = () => {
        const [puntosMinimos, puntosComputadora] = puntosJugadores;
        setTimeout(() => {
            if( puntosComputadora === puntosMinimos){
                alert('Draw');
            }else if(puntosMinimos <= 21 && puntosComputadora > 21){
                alert('You won');
            }else{
                alert('You lose');
            }
        }, 105); 
    }

    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;
        do{
            const carta = pedirCarta()
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);

            crearCarta(carta, puntosJugadores.length - 1);

            if (puntosMinimos > 21){break;}
        }while((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();
    }

    // Eventos
    btnPedir.addEventListener('click', () => {  // Callback: Función como argumento
        const carta = pedirCarta()
        const puntosJugador = acumularPuntos(carta, 0);
        
        crearCarta(carta, 0);

        if(puntosJugador > 21){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        } else if( puntosJugador === 21){
            console.warn('21, you won!');
            btnPedir.disabled = true;
            turnoComputadora(puntosJugador);
        }
    })

    btnDetener.addEventListener('click', () => {
        btnDetener.disabled = true;
        btnPedir.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    })

    btnNuevo.addEventListener('click', () => {
        inicializarJuego();
    })
})();