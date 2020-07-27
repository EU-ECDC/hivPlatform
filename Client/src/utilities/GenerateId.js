// Math.pow(36, 6)
const kIdMultiplier = 2176782336;

// Generate a 'unique' identifier.
export default prefix => {
  // It is based on time and therefore guaranteed to be unique within an application.
  // const id = new Date().getTime();

  // It is based on a random number generator and therefore provides
  // a high probability of uniquness between many instances of the application.
  const id = ('000000' + ((Math.random() * kIdMultiplier) << 0).toString(36)) // eslint-disable-line no-bitwise
    .slice(-6);

  return `${prefix}_${id}`;
};
