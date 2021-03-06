// решение реализовано на основе метода обратной польской нотации
// https://habr.com/ru/post/100869/

let opStack = []; // стек операций (Техас)
let resStack = []; // результирующий стек (Калифорния)
let final = '';

function expressionCalculator(expr) {
    let openBr = (expr.match(/\(/g) || []).length;
    let closeBr = (expr.match(/\)/g) || []).length;
    
    if (openBr != closeBr) {
        throw Error('ExpressionError: Brackets must be paired');
    }

    let exprArr = parseStrToArr(expr);

    exprArr.forEach(processEl);

    pushLeastOpsToRes();

    final = getResult();
    return final;
}

function processEl(el) {
    if (isNumber(el)) { // обработать числа
        resStack.push(el);
        return;
    } else { // обработать операторы и скобки
        if (stackIsEmpty(opStack) && el != ')') {
            opStack.push(el);
            return;
        }
        let topStackEl = getStackTop(opStack);
        switch (topStackEl) {
            case '+':
                if (['*', '/', '('].includes(el)) {
                    opStack.push(el);
                } else {
                    resStack.push(opStack.pop());
                    processEl(el);
                }
                break;
            case '-':
                if (['*', '/', '('].includes(el)) {
                    opStack.push(el);
                } else {
                    resStack.push(opStack.pop());
                    processEl(el);
                }
                break;
            case '*':
                if (['('].includes(el)) {
                    opStack.push(el);
                } else {
                    resStack.push(opStack.pop());
                    processEl(el);
                }
                break;
            case '/':
                if (['('].includes(el)) {
                    opStack.push(el);
                } else {
                    resStack.push(opStack.pop());
                    processEl(el);
                }
                break;
            case '(':
                if ([')'].includes(el)) {
                    opStack.pop();
                } else {
                    opStack.push(el);
                }
                break;
        }
    }
}

function isNumber(value) { // проверить, что переданное значение - число
    return !isNaN(parseFloat(value)) && isFinite(value);
}

function parseStrToArr(expr) { // распарсить строку с выражением в массив с числами и операциями
    let resArr = [];
    expr = expr.replace(/\s/g, ''); // удалить все пробелы
    let regexp = /(\d+|\+|\-|\/|\*|\(|\))/g; // регулярное выражение для парсинга
    let matchAll = expr.matchAll(regexp);   // распарсить строку на символы/операции, возвращает итерируемый объект
    Array.from(matchAll).forEach(el => {
        resArr.push(el[0]);
    });

    return resArr;
}

function stackIsEmpty(stackArr) { // проверяет, что стек пустой
    return stackArr.length === 0;
}

function getStackTop(stackArr) { // получить верхний элемент стека
    return stackArr[stackArr.length - 1];
}

function pushLeastOpsToRes() { // вытолкнуть все оставшиеся операции из стека операций в результирующий стек 
    while (!stackIsEmpty(opStack)) {
        resStack.push(opStack.pop());
    }
}

function getResult() { // посчитать итоговый результат
    let res = [];
    resStack.reverse();
    while (!stackIsEmpty(resStack)) {
        let newEl = resStack.pop();

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
                        resStack = []; // обнулить результаты
                        throw Error("TypeError: Division by zero.");
                    }
                    resOperation = secondNum / firstNum;
                    break;
            }
            res.push(resOperation);
        } else {
            res.push(newEl);
        }
    }
    return res[0];
}

module.exports = {
    expressionCalculator
}