/**
 * 
 * @param {Array<String>} deck es un arreglo de String
 * @returns {String} retorna la carta del deck
 */

//? ésta función me permite tomar una carta
export const pedirCarta = (deck) => {
    if (!deck || deck.length === 0) {
      throw "No hay más cartas en el deck";
    }
    const carta = deck.pop();
    return carta;
  };