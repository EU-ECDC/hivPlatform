export default file => {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onload = e => {
      resolve(e.target.result);
    };
    fileReader.onerror = reject;
    fileReader.readAsText(file);
  });
};
