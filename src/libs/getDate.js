export default (value) => {
	var date = new Date(value);
	var twoDigit = (num) => {
		return (num > 9 ? '' : '0') + num;
	};

	return {
		year: date.getFullYear(),
		month: twoDigit(date.getMonth() + 1),
		day: twoDigit(date.getDate())
	}
}