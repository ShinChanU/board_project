var count = 0;
count += 1;
// count = '문자열'; // 에러발생
var message = 'hello world';
var done = true;
var numbers = [1, 2, 3];
var messages = ['hello', 'world'];
// messages.push(123); // error
var mightBeUndefined = undefined;
var nullableNumber = null;
var color = 'red';
color = 'yellow';
// color = 'green'; // error
function sum(x, y) {
    return x + y;
}
console.log(sum(1, 2));
var sumArray = function (numbers) {
    return numbers.reduce(function (a, b) { return a + b; });
};
var total = sumArray([1, 2, 3, 4, 5]);
console.log(total);
function voidFn() {
    console.log('반환 없음');
}
var Circle = /** @class */ (function () {
    function Circle(radius) {
        this.radius = radius;
    }
    Circle.prototype.getArea = function () {
        return this.radius * this.radius * Math.PI;
    };
    return Circle;
}());
console.log(new Circle(3).getArea()); // 27~28
// const shapes = [] //
