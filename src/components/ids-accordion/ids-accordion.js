import {
  IdsElement,
  customElement,
  scss,
  mix,
  attributes
} from '../../core';

import styles from './ids-accordion.scss';
import IdsAccordionHeader from './ids-accordion-header';
import IdsAccordionPanel from './ids-accordion-panel';
import {
  IdsAttributeProviderMixin,
  IdsColorVariantMixin,
  IdsEventsMixin,
  IdsThemeMixin
} from '../../mixins';

/**
 * IDS Accordion Component
 * @type {IdsAccordion}
 * @inherits IdsElement
 * @mixes IdsAttributeProviderMixin
 * @mixes IdsColorVariantMixin
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part accordion - the accordion root element
 */
@customElement('ids-accordion')
@scss(styles)
class IdsAccordion extends mix(IdsElement).with(
    IdsAttributeProviderMixin,
    IdsColorVariantMixin,
    IdsEventsMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.MODE,
      attributes.VERSION
    ];
  }

  /**
   * @returns {Array<string>} List of available color variants for this component
   */
  availableColorVariants = ['app-menu'];

  /**
   * @returns {Array} List of attributes provided to child components
   */
  providedAttributes = {
    [attributes.COLOR_VARIANT]: [IdsAccordionHeader, IdsAccordionPanel],
  };

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
      <div class="ids-accordion" part="accordion">
        <slot></slot>
      </div>
    `;
  }
}

export default IdsAccordion;
