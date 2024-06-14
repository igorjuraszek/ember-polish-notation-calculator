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
  addStep(
    steps,
    expression,
    stack,
    result,
    type,
    value,
    precedence,
    reverseResult = false
  ) {
    steps.push({
      Expression: expression,
      Stack: stack.slice(),
      Result: reverseResult ? result.slice().reverse() : result.slice(),
      Type: type,
      Value: value || '', // Ustawienie na pustą wartość jeśli brak tokenu
      Precedence: precedence,
    });
  }

  // Przetwarzanie tokena w zależności od jego typu
  processToken(
    token,
    stack,
    output,
    steps,
    type,
    remainingExpression,
    reverseResult = false
  ) {
    if (/\d/.test(token) || /[a-zA-Z]/.test(token)) {
      output.push(token);
      this.addStep(
        steps,
        remainingExpression,
        stack,
        output,
        type,
        token,
        0,
        reverseResult
      );
    } else if (token === '(') {
      stack.push(token);
      this.addStep(
        steps,
        remainingExpression,
        stack,
        output,
        'Left Parenthesis',
        token,
        0,
        reverseResult
      );
    } else if (token === ')') {
      this.processRightParenthesis(
        stack,
        output,
        steps,
        remainingExpression,
        reverseResult
      );
    } else if (this.isOperator(token)) {
      this.processOperator(
        token,
        stack,
        output,
        steps,
        remainingExpression,
        reverseResult
      );
    }
  }

  // Przetwarzanie prawego nawiasu
  processRightParenthesis(
    stack,
    output,
    steps,
    remainingExpression,
    reverseResult = false
  ) {
    while (stack.length && stack[stack.length - 1] !== '(') {
      output.push(stack.pop());
    }
    stack.pop(); // Usunięcie lewego nawiasu ze stosu
    this.addStep(
      steps,
      remainingExpression,
      stack,
      output,
      'Right Parenthesis',
      ')',
      0,
      reverseResult
    );
  }

  // Przetwarzanie operatora
  processOperator(
    token,
    stack,
    output,
    steps,
    remainingExpression,
    reverseResult = false
  ) {
    while (
      stack.length &&
      this.precedence(stack[stack.length - 1]) >= this.precedence(token)
    ) {
      output.push(stack.pop());
    }
    stack.push(token);
    this.addStep(
      steps,
      remainingExpression,
      stack,
      output,
      'Operator',
      token,
      this.precedence(token),
      reverseResult
    );
  }

  // Funkcja do konwersji wyrażenia infiksowego na postfiksowe
  toPostfix() {
    let steps = [];
    let output = [];
    let stack = [];
    let tokens = this.expression.match(/\S+/g); // Rozdzielanie wyrażenia na tokeny
    let remainingExpression = this.expression;

    tokens.forEach((token) => {
      this.processToken(
        token,
        stack,
        output,
        steps,
        'Operand',
        remainingExpression
      );
      remainingExpression = remainingExpression.replace(token, '').trim();
    });

    // Opróżnienie stosu
    while (stack.length) {
      output.push(stack.pop());
      this.addStep(steps, remainingExpression, stack, output, 'End', '', 0);
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
    let tokens = this.expression.split('').reverse().join('').match(/\S+/g); // Rozdzielanie wyrażenia na tokeny i odwrócenie ich kolejności
    let remainingExpression = this.expression.split('').reverse().join('');

    tokens.forEach((token) => {
      if (token === ')') token = '(';
      else if (token === '(') token = ')';
      this.processToken(
        token,
        stack,
        output,
        steps,
        'Operand',
        remainingExpression.split('').reverse().join(''),
        true // Ustawienie reverseResult na true dla prefiksu
      );
      remainingExpression = remainingExpression
        .replace(token.split('').reverse().join(''), '')
        .trim();
    });

    // Opróżnienie stosu
    while (stack.length) {
      output.push(stack.pop());
      this.addStep(
        steps,
        remainingExpression.split('').reverse().join(''),
        stack,
        output,
        'End',
        '',
        0,
        true // Ustawienie reverseResult na true dla prefiksu
      );
    }

    return {
      expression: output.reverse().join(' '), // Odwrócenie wynikowego wyrażenia
      steps: steps,
    };
  }
}
