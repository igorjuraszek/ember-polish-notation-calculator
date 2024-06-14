import Controller from '@ember/controller';
import {
  Infix,
  Prefix,
  Postfix,
} from 'ember-polish-notation-calculator/pods/classes';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HomeController extends Controller {
  @tracked expression;
  @tracked expressionInstance;
  @tracked convertedExpression;
  @tracked convertFrom;
  @tracked convertTo;
  @tracked steps;

  @action
  onChangeExpression({ target: { value } }) {
    console.log(value);
    this.expression = value;
    this._initConversion();
  }

  @action
  setConvertFrom({ target: { value } }) {
    this.convertFrom = value;
    this._initConversion();
  }

  @action
  setConvertTo({ target: { value } }) {
    this.convertTo = value;
    this._initConversion();
  }

  _initConversion() {
    const { expression, convertFrom, convertTo } = this;

    if (!(expression && convertFrom && convertTo)) {
      this.convertedExpression = null;
      this.expressionInstance = null;
      this.steps = null;
      return;
    }

    if (convertFrom === 'prefix') {
      this.expressionInstance = new Prefix(expression);
    }
    if (convertFrom === 'infix') {
      this.expressionInstance = new Infix(expression);
    }
    if (convertFrom === 'postfix') {
      this.expressionInstance = new Postfix(expression);
    }

    if (convertTo === 'prefix') {
      const { expression: convertedExpression, steps } =
        this.expressionInstance.toPrefix();
      this.steps = steps;
      this.convertedExpression = convertedExpression;
    }
    if (convertTo === 'infix') {
      const { expression: convertedExpression, steps } =
        this.expressionInstance.toInfix();
      this.steps = steps;
      this.convertedExpression = convertedExpression;
    }
    if (convertTo === 'postfix') {
      const { expression: convertedExpression, steps } =
        this.expressionInstance.toPostfix();
      this.steps = steps;
      this.convertedExpression = convertedExpression;
    }
  }
}
