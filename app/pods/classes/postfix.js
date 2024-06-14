export default class Postfix {
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
      Value: value || '', // Ustawienie na pustą wartość jeśli brak tokenu
      Precedence: precedence,
    });
  }

  // Funkcja do konwersji wyrażenia postfiksowego na infiksowe
  toInfix() {
    let steps = [];
    let stack = [];
    let tokens = this.expression.match(/\S+/g); // Rozdzielanie wyrażenia na tokeny
    let remainingExpression = this.expression;

    tokens.forEach((token) => {
      if (this.isOperator(token)) {
        let operand2 = stack.pop();
        let operand1 = stack.pop();
        let newExpr = `(${operand1} ${token} ${operand2})`;
        stack.push(newExpr);
        this.addStep(
          steps,
          remainingExpression,
          stack,
          stack.slice(),
          'Operator',
          token,
          this.precedence(token)
        );
      } else {
        stack.push(token);
        this.addStep(
          steps,
          remainingExpression,
          stack,
          stack.slice(),
          'Operand',
          token,
          0
        );
      }
      remainingExpression = remainingExpression.replace(token, '').trim();
    });

    return {
      expression: stack[0],
      steps: steps,
    };
  }

  // Funkcja do konwersji wyrażenia postfiksowego na prefiksowe
  toPrefix() {
    let steps = [];
    let stack = [];
    let tokens = this.expression.match(/\S+/g); // Rozdzielanie wyrażenia na tokeny
    let remainingExpression = this.expression;

    tokens.forEach((token) => {
      if (this.isOperator(token)) {
        let operand2 = stack.pop();
        let operand1 = stack.pop();
        let newExpr = `${token} ${operand1} ${operand2}`;
        stack.push(newExpr);
        this.addStep(
          steps,
          remainingExpression,
          stack,
          stack.slice(),
          'Operator',
          token,
          this.precedence(token)
        );
      } else {
        stack.push(token);
        this.addStep(
          steps,
          remainingExpression,
          stack,
          stack.slice(),
          'Operand',
          token,
          0
        );
      }
      remainingExpression = remainingExpression.replace(token, '').trim();
    });

    return {
      expression: stack[0],
      steps: steps,
    };
  }
}
