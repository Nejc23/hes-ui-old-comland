export const nameOf = <T>(property: (object: T) => void) => {
  const chaine = property.toString();
  const arr = chaine.match(/([a-z,0-9,-])\w+/);
  return arr[0];
};
