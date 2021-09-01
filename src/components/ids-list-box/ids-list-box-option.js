import {
  IdsElement,
  customElement,
  scss
} from '../../core';

import styles from './ids-list-box-option.scss';

/**
 * IDS List Box Option Component
 * @type {IdsListBoxOption}
 * @inherits IdsElement
 * @part option - the option element
 */
@customElement('ids-list-box-option')
@scss(styles)
class IdsListBoxOption extends IdsElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setAttribute('role', 'option');
    this.setAttribute('tabindex', '-1');
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<slot></slot>`;
  }
}

export default IdsListBoxOption;
