// решение реализовано на основе метода обратной польской нотации
// https://habr.com/ru/post/100869/

let opStack = []; // стек операций (Техас)
let resStack = []; // результирующий стек (Калифорния)

function expressionCalculator(expr) {
    console.log(expr);
    let openBr = (expr.match(/\(/) || []).length;
    let closeBr = (expr.match(/\)/) || []).length;
    if (openBr != closeBr){
        throw Error('ExpressionError: Brackets must be paired');
    }

    let exprArr = parseStrToArr(expr);

    exprArr.forEach(processEl);

    pushLeastOpsToRes();

    console.log('ResStack после пуша остатка: ' + resStack);

    let final = getResult();
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
                        throw Error("TypeError: Division by zero.");
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
        console.log('End')
        throw Error('ExpressionError: Brackets must be paired');
    }

}

// const expr = " 84 + 62 / 33 * 10 + 15 ";
// const result = 117.7879;

// console.log(expressionCalculator('1 / 0')); // ?
console.log(expressionCalculator('((1 + 2) * 3'))
// console.log('ИТОГ: ' + expressionCalculator(' 84 + 62 / 33 * 10 + 15 ')); // верный
// console.log('ИТОГ: ' + expressionCalculator('(8+2*5)/(1+3*2-4)')); // верный
// console.log(expressionCalculator(' 100 - 60 / 38 + (  19 / 88 * 97 / 82 / 94  ) * 92 '));
// console.log(expressionCalculator(' 12 * 3 - 18 + 34 - 84 ')); // верный
// console.log(expressionCalculator(' 20 - 57 * 12 - (  58 + 84 * 32 / 27  )'));
// console.log(expressionCalculator('20 - 57 * 12 - 157 ')); // -821
// console.log('Итог: ' + expressionCalculator('5*2+10'));
// console.log('Итог: ' + expressionCalculator('(6+10-4)/(1+1*2)+1'));
// console.log(expressionCalculator(' (  96 / 83 - 53 - (  59 - 91 / 91 - 54  )  ) / (  75 + 4 / (  50 - 80 * 45 + 93 + 18  ) - 76 / 54  ) * 14 + 59 '))