let count: number = 0;
count += 1;
// count = '문자열'; // 에러발생

const message: string = 'hello world';

const done: boolean = true;

const numbers: number[] = [1, 2, 3];
const messages: string[] = ['hello', 'world'];

// messages.push(123); // error

let mightBeUndefined: string | undefined = undefined;
let nullableNumber: number | null = null;

let color: 'red' | 'orange' | 'yellow' = 'red';
color = 'yellow';
// color = 'green'; // error

function sum(x: number, y: number): number {
  return x + y;
}

console.log(sum(1, 2));

const sumArray = (numbers: number[]): number => {
  return numbers.reduce((a, b) => a + b);
};

const total = sumArray([1, 2, 3, 4, 5]);
console.log(total);

function voidFn(): void {
  console.log('반환 없음');
}

interface Shape {
  getArea(): number;
}

class Circle implements Shape {
  constructor(public radius: number) {
    this.radius = radius;
  }

  getArea() {
    return this.radius * this.radius * Math.PI;
  }
}

class Rectangle implements Shape {
  // width: number;
  // height: number;

  constructor(private width: number, private height: number) {
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

console.log(new Circle(3).getArea()); // 28
console.log(new Rectangle(3, 4).getArea()); // 28

const shapes: Shape[] = [new Circle(3), new Rectangle(3, 4)];

shapes.forEach((shape) => {
  console.log(shape.getArea());
});

// const shapes = [] //
