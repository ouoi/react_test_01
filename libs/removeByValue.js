/**
 * 값을 통한 배열 삭제 모듈
 *
 * @auth	ldw
 * @date	2017.04.26
 */
module.exports = function () {
	Array.prototype.removeByValue = function (search) {
		var index = this.indexOf(search);
		if (index !== -1) {
			this.splice(index, 1);
		}
	}
};