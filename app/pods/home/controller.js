import Controller from '@ember/controller';
import {
  Infix,
  Prefix,
  Postfix,
} from 'ember-polish-notation-calculator/pods/classes';
import { tracked } from '@glimmer/tracking';

export default class HomeController extends Controller {
  @tracked stepsPrefix;
  @tracked stepsPostfix;

  constructor() {
    super(...arguments);

    // const infixInstance = new Infix();
    // const prefixInstance = new Prefix();
    // const postfixInstance = new Postfix();

    // console.log(infixInstance);
    // console.log(prefixInstance);
    // console.log(postfixInstance);

    let expression = '( A + B * C - D - E - F + G ) ^ 2';
    let infixExpression = new Infix(expression);

    this.stepsPrefix = infixExpression.toPrefix();
    this.stepsPostfix = infixExpression.toPostfix();

    console.log(this.stepsPrefix);
    console.log(this.stepsPostfix);
  }
}
