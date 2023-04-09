/**
 * Obtener el valor de la carta
 * @param {String} carta 
 * @returns {Number} es el valor de la carta
 */

export const valorCarta = (carta) => {
    const valor = carta.substring(0, carta.length - 1);
    return isNaN(valor) ? (valor === "A" ? 11 : 10) : valor * 1;
    //* se multiplica por 1 para que pase de ser un string a un valor numérico
};