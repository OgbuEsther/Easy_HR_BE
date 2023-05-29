function getArray<T>(items: T[]): T[] {
    return items;
  }

let numArray1 = getArray<{}>([{
    name: "bola",
    email: "sannifortune11",
    password: "",
}]);
let numArray2 = getArray<{}>([{
    name: "bola",
    email: "sannifortune11",
    password: "",
}]);
let numArray3 = getArray<{}>([{
    name: "bola",
    email: "sannifortune11",
    password: "",
}]);
console.log("1",numArray1);
console.log(numArray2);
console.log(numArray3);
// let strArray = getArray<string>(["bola", "sanni", "ola"]);
// console.log(strArray);

