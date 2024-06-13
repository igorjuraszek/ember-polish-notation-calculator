export default class Infix {
  constructor(expression) {
    this.expression = expression;
  }

  // Funkcja pomocnicza do określania priorytetu operatorów
  precedence(operator) {
    switch (operator) {
      case '+':
      case '-':
        return 1;
      case '*':
      case '/':
        return 2;
      case '^':
        return 3;
      default:
        return 0;
    }
  }

  // Funkcja pomocnicza do sprawdzania, czy znak jest operatorem
  isOperator(char) {
    return ['+', '-', '*', '/', '^'].includes(char);
  }

  // Dodawanie kroku do listy kroków
  addStep(steps, expression, stack, result, type, value, precedence) {
    steps.push({
      Expression: expression,
      Stack: stack.slice(),
      Result: result.slice(),
      Type: type,
      Value: value,
      Precedence: precedence,
    });
  }

  // Funkcja do konwersji wyrażenia infiksowego na postfiksowe
  toPostfix() {
    let steps = [];
    let output = [];
    let stack = [];
    let tokens = this.expression.match(/\S+/g); // Rozdzielanie wyrażenia na tokeny

    for (let token of tokens) {
      if (/\d/.test(token) || /[a-zA-Z]/.test(token)) {
        // Jeśli token jest liczbą lub zmienną
        output.push(token);
        this.addStep(
          steps,
          this.expression,
          stack,
          output,
          'Operand',
          token,
          0
        );
      } else if (token === '(') {
        // Jeśli token jest lewym nawiasem
        stack.push(token);
        this.addStep(
          steps,
          this.expression,
          stack,
          output,
          'Left Parenthesis',
          token,
          0
        );
      } else if (token === ')') {
        // Jeśli token jest prawym nawiasem
        while (stack.length && stack[stack.length - 1] !== '(') {
          output.push(stack.pop());
          this.addStep(
            steps,
            this.expression,
            stack,
            output,
            'Operator',
            token,
            0
          );
        }
        stack.pop(); // Usunięcie lewego nawiasu ze stosu
        this.addStep(
          steps,
          this.expression,
          stack,
          output,
          'Right Parenthesis',
          token,
          0
        );
      } else if (this.isOperator(token)) {
        // Jeśli token jest operatorem
        while (
          stack.length &&
          this.precedence(stack[stack.length - 1]) >= this.precedence(token)
        ) {
          output.push(stack.pop());
          this.addStep(
            steps,
            this.expression,
            stack,
            output,
            'Operator',
            token,
            this.precedence(token)
          );
        }
        stack.push(token);
        this.addStep(
          steps,
          this.expression,
          stack,
          output,
          'Operator',
          token,
          this.precedence(token)
        );
      }
    }

    // Opróżnienie stosu
    while (stack.length) {
      output.push(stack.pop());
      this.addStep(steps, this.expression, stack, output, 'End', '', 0);
    }

    return {
      expression: output.join(' '),
      steps: steps,
    };
  }

  // Funkcja do konwersji wyrażenia infiksowego na prefiksowe
  toPrefix() {
    let steps = [];
    let output = [];
    let stack = [];
    let tokens = this.expression.match(/\S+/g).reverse(); // Rozdzielanie wyrażenia na tokeny i odwrócenie ich kolejności

    for (let token of tokens) {
      if (/\d/.test(token) || /[a-zA-Z]/.test(token)) {
        // Jeśli token jest liczbą lub zmienną
        output.push(token);
        this.addStep(
          steps,
          this.expression,
          stack,
          output,
          'Operand',
          token,
          0
        );
      } else if (token === ')') {
        // Jeśli token jest prawym nawiasem
        stack.push(token);
        this.addStep(
          steps,
          this.expression,
          stack,
          output,
          'Right Parenthesis',
          token,
          0
        );
      } else if (token === '(') {
        // Jeśli token jest lewym nawiasem
        while (stack.length && stack[stack.length - 1] !== ')') {
          output.push(stack.pop());
          this.addStep(
            steps,
            this.expression,
            stack,
            output,
            'Operator',
            token,
            0
          );
        }
        stack.pop(); // Usunięcie prawego nawiasu ze stosu
        this.addStep(
          steps,
          this.expression,
          stack,
          output,
          'Left Parenthesis',
          token,
          0
        );
      } else if (this.isOperator(token)) {
        // Jeśli token jest operatorem
        while (
          stack.length &&
          this.precedence(stack[stack.length - 1]) > this.precedence(token)
        ) {
          output.push(stack.pop());
          this.addStep(
            steps,
            this.expression,
            stack,
            output,
            'Operator',
            token,
            this.precedence(token)
          );
        }
        stack.push(token);
        this.addStep(
          steps,
          this.expression,
          stack,
          output,
          'Operator',
          token,
          this.precedence(token)
        );
      }
    }

    // Opróżnienie stosu
    while (stack.length) {
      output.push(stack.pop());
      this.addStep(steps, this.expression, stack, output, 'End', '', 0);
    }

    return {
      expression: output.reverse().join(' '), // Odwrócenie wynikowego wyrażenia
      steps: steps,
    };
  }
}

// Przykład użycia
// let expression = 'A + B * C';
// let infixExpression = new Infix(expression);
// let postfixResult = infixExpression.toPostfix();
// let prefixResult = infixExpression.toPrefix();

// console.log('Infix:', expression);
// console.log('Postfix:', postfixResult.expression);
// console.log('Postfix Steps:', JSON.stringify(postfixResult.steps, null, 2));
// console.log('Prefix:', prefixResult.expression);
// console.log('Prefix Steps:', JSON.stringify(prefixResult.steps, null, 2));
