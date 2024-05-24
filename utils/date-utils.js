function convertBrazilianDateToAmericanDate(date) {
  return date.split("/").reverse().join("-");
}

module.exports = {
  convertBrazilianDateToAmericanDate,
};
