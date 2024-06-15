import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ExampleAsEmberTableComponent extends Component {
  @tracked containerWidth = window.innerWidth; // Initial width

  constructor() {
    super(...arguments);
    this.updateContainerWidth = this.updateContainerWidth.bind(this);
    window.addEventListener('resize', this.updateContainerWidth);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    window.removeEventListener('resize', this.updateContainerWidth);
  }

  updateContainerWidth() {
    this.containerWidth = window.innerWidth;
  }

  get columns() {
    const { containerWidth } = this;

    return [
      {
        name: `Expression`,
        valuePath: `Expression`,
        width: (3 / 12) * containerWidth,
        minWidth: 130,
        isReorderable: true,
      },
      {
        name: `Stack`,
        valuePath: `Stack`,
        width: (1 / 6) * containerWidth,
        minWidth: 130,
        isReorderable: true,
      },
      {
        name: `Result`,
        valuePath: `Result`,
        width: (3 / 12) * containerWidth,
        minWidth: 130,
        isReorderable: true,
      },
      {
        name: `Type`,
        valuePath: `Type`,
        width: (1 / 6) * containerWidth,
        minWidth: 130,
        isReorderable: true,
      },
      {
        name: `Value`,
        valuePath: `Value`,
        width: (1 / 12) * containerWidth,
        minWidth: 130,
        isReorderable: true,
      },
      {
        name: `Precedence`,
        valuePath: `Precedence`,
        width: (1 / 12) * containerWidth,
        minWidth: 130,
        isReorderable: true,
      },
    ];
  }
}
