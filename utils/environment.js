/**
 * Devuelve true si el valor del entorno cargado se encuentra en los indicados en la función.
 * @returns {boolean}
 */
export const verifyEnviroment = () => {
  const { NODE_ENV } = process.env;
  return NODE_ENV === 'development';
};
