// решение реализовано на основе метода обратной польской нотации
// https://habr.com/ru/post/100869/

let opStack = []; // стек операций (Техас)
let resStack = []; // результирующий стек (Калифорния)

// function expressionCalculator(expr) {
//     console.log(expr);
//         let exprArr = parseStrToArr(expr);

//         exprArr.forEach(char => {
//             console.log('Результирующий стек перед операцией: ' + resStack);
//             console.log('Стек операций перед операцией: ' + opStack);
//             console.log('Разбираем элемент: ' + char);
//             if (isNumber(char)) {
//                 resStack.push(char);
//             } else {
//                 processElement(char);
//             }
//         });
//         pushLeastOpsToRes();
//         console.log('ResStack после пуша остатка: ' + resStack);

//         let final = getResult();
//         return final;
// }

function expressionCalculator(expr) {
    console.log(expr);
        let exprArr = parseStrToArr(expr);

        exprArr.forEach(char => processEl);
        pushLeastOpsToRes();
        console.log('ResStack после пуша остатка: ' + resStack);

        let final = getResult();
        return final;
}

function processEl(el){
    if (isNumber(char)) {
        resStack.push(char);
    } else {
        processNewElement(char);
    }
}
// проверить, что переданное значение - число
function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

// распарсить строку с выражением в массив с числами и операциями
function parseStrToArr(expr) {
    let resArr = [];
    expr = expr.replace(/\s/g, ''); // удалить все пробелы
    // let regexp = /(\d+|\+|\-|\/|\*|\(|\))/g; // регулярное выражение для парсинга
    let regexp = /(\d+|\+|\-|\/|\*|\(|\))/g; // регулярное выражение для парсинга
    let matchAll = expr.matchAll(regexp);   // распарсить строку на символы/операции, возвращает итерируемый объект
    Array.from(matchAll).forEach(el => {
        resArr.push(el[0]);
    });

    return resArr;
}

// проверяет, что стек пустой
function stackIsEmpty(stackArr) {
    return stackArr.length === 0;
}

// получить верхний элемент стека
function getStackTop(stackArr) {
    return stackArr[stackArr.length - 1];
}

// обработать следующий пришедший элемент
function processElement(char) {
    let stackTop = getStackTop(opStack);
    if (stackIsEmpty(opStack) && (char != ')')) { // если стек операций пустой, кладем в него символ операции
        opStack.push(char);
        return;
    }
    // else {
    // let stackTop = getStackTop(opStack);
    // console.log('Верхний элемент стека: ' + stackTop);
    switch (stackTop) { // в зависимости от того, какой верхний элемент стека
        case '+':
            if (char == ')'){
                pushUpToBracket();
                return;
            }
            if (['*', '/', '('].includes(char)) {
                opStack.push(char);
            } else {
                // resStack.push(opStack.pop());
                // while(opStack.length > 0){
                //     let elem = opStack.pop();
                //     console.log('Move to: ' + elem);
                //     resStack.push(elem);
                // }
                pushAll();
                opStack.push(char);
            }
            return;
        case '-':
            if (char == ')'){
                pushUpToBracket();
                return;
            }
            if (['*', '/', '('].includes(char)) {
                opStack.push(char);
            } else {
                // for(let i = 0; i < opStack.length; i++){
                //     let elem = opStack.pop();
                //     console.log('Move to: ' + elem);
                //     resStack.push(elem);
                // }

                // while(opStack.length > 0){
                //     let elem = opStack.pop();
                //     console.log('Move to: ' + elem);
                //     resStack.push(elem);
                // }
                // resStack.push(opStack.pop());
                pushAll();
                opStack.push(char);
            }
            return;
        case '*':
            if (char == ')'){
                pushUpToBracket();
                return;
            }
            if (char == '(') {
                opStack.push(char);
            } else {
                // while(opStack.length > 0){
                //     let elem = opStack.pop();
                //     console.log('Move to: ' + elem);
                //     resStack.push(elem);
                // }
                // resStack.push(opStack.pop());
                pushAll();
                opStack.push(char);
            }
            return;
        case '/':
            if (char == ')'){
                pushUpToBracket();
                return;
            }
            if (char == '(') {
                opStack.push(char);
            } else {
                // resStack.push(opStack.pop());
                // while(opStack.length > 0){
                //     let elem = opStack.pop();
                //     console.log('Move to: ' + elem);
                //     resStack.push(elem);
                // }
                pushAll();
                opStack.push(char);
            }
            return;
        case '(':
            if (char == ')') {
                opStack.pop();
            } else {
                opStack.push(char);
            }
            return;
        case ')':

            return;
    }
    // }
}

// вытолкнуть все элементы из стека операций в результирующий стек до открывающей скобки
function pushUpToBracket(){
    if (opStack.length == 0){
        throw Error;
    }

    let topEl = opStack.pop();
    if (topEl != '('){
        resStack.push(topEl);
        pushUpToBracket();
    }
}

function pushAll(){
    while (opStack.length != 0){
        let topEl = getStackTop(opStack);
        if (topEl == '('){
            return;
        }
        resStack.push(opStack.pop());
    }
    // while (opStack.length != 0 || opStack[opStack.length-1] != '('){
    //     resStack.push(opStack.pop());
    // }
}

function pushLeastOpsToRes() { // вытолкнуть все оставшиеся операции из стека операций в результирующий стек 
    while (!stackIsEmpty(opStack)) {
        resStack.push(opStack.pop());
    }
}

function getResult() { // посчитать итоговый результат
    let res = [];
    resStack.reverse();
    console.log('Стек перед подсчетом результата: ' + resStack);
    while (!stackIsEmpty(resStack)) {
        let newEl = resStack.pop();
        console.log(newEl);

        if (['+', '-', '*', '/'].includes(newEl)) {
            let firstNum = res.pop();
            let secondNum = res.pop();
            let resOperation = 0;
            switch (newEl) {
                case '+':
                    resOperation = parseFloat(secondNum) + parseFloat(firstNum);
                    break;
                case '-':
                    resOperation = secondNum - firstNum;
                    break;
                case '*':
                    resOperation = secondNum * firstNum;
                    break;
                case '/':
                    if (firstNum == 0) {
                        throw Error;
                    }
                    resOperation = secondNum / firstNum;
                    break;
            }
            res.push(resOperation);
        } else {
            res.push(newEl);
        }
        console.log(res);
    }
    if (res.length == 1) {
        return res[0];
    } else {
        throw Error;
    }

}

// const expr = " 84 + 62 / 33 * 10 + 15 ";
// const result = 117.7879;

// console.log(expressionCalculator('1 / 0')); // ?
// console.log(expressionCalculator("((1 + 2 * 3"))
console.log('ИТОГ: ' + expressionCalculator(' 84 + 62 / 33 * 10 + 15 ')); // верный
// console.log('ИТОГ: ' + expressionCalculator('(8+2*5)/(1+3*2-4)')); // верный
// console.log(expressionCalculator(' 100 - 60 / 38 + (  19 / 88 * 97 / 82 / 94  ) * 92 '));
// console.log(expressionCalculator(' 12 * 3 - 18 + 34 - 84 ')); // верный
// console.log(expressionCalculator(' 20 - 57 * 12 - (  58 + 84 * 32 / 27  )'));
// console.log(expressionCalculator('20 - 57 * 12 - 157 ')); // -821
// console.log('Итог: ' + expressionCalculator('5*2+10'));
// console.log('Итог: ' + expressionCalculator('(6+10-4)/(1+1*2)+1'));
