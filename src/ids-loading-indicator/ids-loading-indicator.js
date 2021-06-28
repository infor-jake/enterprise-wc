import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes,
  stringUtils
} from '../ids-base';

// Import Mixins
import {
  IdsEventsMixin,
  IdsThemeMixin
} from '../ids-mixins';

import styles from './ids-loading-indicator.scss';

const getIndicatorHtml = ({ progress, type }) => {
  const isDeterminate = !Number.isNaN(parseInt(progress));

  switch (type) {
  case attributes.LINEAR: {
    return '<div />';
  }
  case attributes.AFFIXED: {
    return '<div />';
  }
  // circular
  default: {
    return (
      `<svg viewbox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="circular-indicator">
        <circle cx="50" cy="50" r="45" stroke-width="3" class="overall" />
        <circle cx="50" cy="50" r="45" stroke-width="6" class="progress" />
      </svg>`
    );
  }
  }
};

/**
 * IDS Loading Indicator Component
 * @type {IdsLoadingIndicator}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part container - the loader container element
 */
@customElement('ids-loading-indicator')
@scss(styles)
export default class IdsLoadingIndicator extends mix(IdsElement).with(
    IdsEventsMixin,
    IdsThemeMixin
  ) {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.AFFIXED,
      attributes.LINEAR,
      attributes.MODE,
      attributes.PROGRESS,
      attributes.TYPE,
      attributes.VERSION
    ];
  }

  /**
   * Return the Template for the contents
   * @returns {string} The template
   */
  template() {
    let type = 'circular';

    if (this.hasAttribute(attributes.AFFIXED)) {
      type = 'affixed';
    }

    if (this.hasAttribute(attributes.LINEAR)) {
      type = 'linear';
    }

    return getIndicatorHtml({ progress: this.progress, type });
  }

  /**
   * @returns {number|undefined} the percentage completed for the indicator;
   * if not specified, the indicator is set into indeterminate mode (e.g. no specific
   * progress with an animation)
   */
  get progress() {
    const value = this.getAttribute(attributes.PROGRESS);

    return value !== null ? parseInt(value) : undefined;
  }

  /**
   * @param {number|undefined} value Represents the percentage completed for the indicator;
   * if not specified, the indicator is set into indeterminate mode (e.g. no specific
   * progress with an animation)
   */
  set progress(value) {
    const isTruthy = stringUtils.stringToBool(value);
    if (isTruthy) {
      this.setAttribute(attributes.LINEAR, '');
    } else {
      this.removeAttribute(attributes.LINEAR);
    }
  }

  /**
   * @param {boolean|string} value Flags the indicator as being an affixed indicator
   * type; causes the indicator to stick to the top of the innermost IdsElement parent
   * and span it horizontally. If set, will unflag this indicator with any other
   * flag types set.
   */
  set affixed(value) {
    this.#onUpdateTypeFlag(attributes.AFFIXED, stringUtils.stringToBool(value));
  }

  /**
   * @returns {boolean|string} value Flags the indicator as being an affixed indicator
   * type; causes the indicator to stick to the top of the innermost IdsElement parent
   * and span it horizontally. If set, will unflag this indicator with any other
   * flag types set.
   */
  get affixed() {
    return this.hasAttribute(attributes.AFFIXED);
  }

  /**
   * @param {boolean} value Flags the indicator as a linear indicator type;
   * causes the indicator to span its parent component horizontally and
   * be represented as a horizontal/linear bar. If set, removes current
   * flag types that may be set.
   */
  set linear(value) {
    this.#onUpdateTypeFlag(attributes.LINEAR, stringUtils.stringToBool(value));
  }

  /**
   * @returns {boolean} value Flags the indicator as a linear indicator type;
   * causes the indicator to span its parent component horizontally and
   * be represented as a horizontal/linear bar. If set, removes current
   * flag types that may be set.
   */
  get linear() {
    return this.hasAttribute(attributes.LINEAR);
  }

  /**
   * @returns {'circular'|'linear'|'affixed'} type The type of loading indicator
   */
  get type() {
    return this.#type || 'circular';
  }

  /**
   * type-flag set based on attributes
   * @type {'circular'|'linear'|'affixed'}
   */
  #type;

  /**
   * updates type based on attribute setter passed
   * @param {*} attribute attribute of flag set
   * @param {*} value value of attribute passed to flag
   */
  #onUpdateTypeFlag(attribute, value) {
    const isTruthy = stringUtils.stringToBool(value);

    if (isTruthy) {
      if (this.#type !== attribute) {
        if (this.#type && this.hasAttribute(this.#type)) {
          this.removeAttribute(this.#type);
        }

        this.#type = attribute;
      }

      if (!this.hasAttribute(attribute)) {
        this.setAttribute(attribute, '');
      }
    }

    if (!isTruthy) {
      if (this.hasAttribute(attribute)) {
        this.removeAttribute(attribute);
      }

      if (this.#type === attribute) {
        this.#type = undefined;
      }
    }
  }
}
