const convertToCurrency = (value) => {
	return Number(parseFloat(value).toFixed(2)).toLocaleString('en', {
		minimumFractionDigits: 2,
	});
};

// inside the object convert a number (field/object key) to a currency format
const objectFieldToCurrency = (items, field) => {
	return items.map((item) => {
		item[field] = convertToCurrency(item[field]);
		return item;
	});
};

module.exports = { convertToCurrency, objectFieldToCurrency };
