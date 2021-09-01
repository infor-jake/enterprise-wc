import {
  IdsElement,
  customElement,
  scss
} from '../../core/ids-element';

import { mix } from '../../core';

import IdsModal from '../ids-modal';
import IdsHyperlink from '../ids-hyperlink';

import { attributes } from '../../core/ids-attributes';
import {
  IdsStringUtils,
  IdsDOMUtils,
  IdsEnvironmentUtil,
  IdsDeviceEnvUtils
} from '../../utils';

import { IdsLocaleMixin } from '../../mixins';

import styles from './ids-about.scss';

/**
 * IDS About Component
 * @type {IdsAbout}
 * @inherits IdsModal
 * @part popup - the popup outer element
 * @part overlay - the inner overlay element
 */
@customElement('ids-about')
@scss(styles)
class IdsAbout extends mix(IdsModal).with(IdsLocaleMixin) {
  constructor() {
    super();
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.PRODUCT_NAME,
      attributes.PRODUCT_VERSION,
      attributes.COPYRIGHT_YEAR,
      attributes.DEVICE_SPECS,
      attributes.USE_DEFAULT_COPYRIGHT,
    ];
  }

  /**
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
    this.#handleEvents();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<ids-popup part="modal" class="ids-modal ids-about" type="custom">
      <div class="ids-modal-container" slot="content">
        <div class="ids-modal-header">
          <slot name="icon"></slot>
          <slot name="appName"></slot>
        </div>
        <div class="ids-about-close">
          <ids-button icon="close" css-class="ids-about-close">
            <span class="audible">Close modal</span>
          </ids-button>
        </div>
        <div class="ids-modal-content-wrapper">
          <div class="ids-modal-content" tabindex="0">
            <slot name="product"></slot>
            <slot name="content"></slot>
            <slot name="copyright"></slot>
            <slot name="device"></slot>
          </div>
        </div>
      </div>
    </ids-popup>`;
  }

  /**
   * Establish internal event handlers
   * @private
   * @returns {object} The object for chaining
   */
  #handleEvents() {
    this.#refreshProduct();

    // Respond to parent changing language
    this.offEvent('languagechange.container');
    this.onEvent('languagechange.container', this.closest('ids-container'), async (e) => {
      await this.setLanguage(e.detail.language.name);
      this.#refreshDeviceSpecs();
      this.#refreshCopyright();
    });

    // Respond to element changing language
    this.offEvent('languagechange.this');
    this.onEvent('languagechange.this', this, async (e) => {
      await this.locale.setLanguage(e.detail.language.name);
      this.#refreshDeviceSpecs();
      this.#refreshCopyright();
    });

    return this;
  }

  /**
   * @returns {string} productName attribute value
   */
  get productName() {
    return this.getAttribute(attributes.PRODUCT_NAME);
  }

  /**
   * Set the product name property
   * @param {string} val productName attribute value
   */
  set productName(val) {
    const sanitizedVal = this.xssSanitize(val);
    this.setAttribute(attributes.PRODUCT_NAME, sanitizedVal);

    this.#refreshProduct();
  }

  /**
   * @returns {string} productVersion attribute value
   */
  get productVersion() {
    return this.getAttribute(attributes.PRODUCT_VERSION);
  }

  /**
   * Set the product version property
   * @param {string} val productVersion attribute value
   */
  set productVersion(val) {
    const sanitizedVal = this.xssSanitize(val);
    this.setAttribute(attributes.PRODUCT_VERSION, sanitizedVal);

    this.#refreshProduct();
  }

  /**
   * Refreshes the product info with product name / version attributes value
   * @returns {void}
   */
  #refreshProduct() {
    const slot = this.querySelectorAll('[slot="product"]');
    const element = `<ids-text slot="product" type="p">${this.productName ? `${this.productName} ` : ''}${this.productVersion || ''}</ids-text>`;

    // Clear slot before rerender
    slot.forEach((item) => item.remove());

    if (this.productName || this.productVersion) {
      this.insertAdjacentHTML('beforeend', element);
    }
  }

  /**
   * @returns {boolean} deviceSpecs attribute value
   */
  get deviceSpecs() {
    const attrVal = this.getAttribute(attributes.DEVICE_SPECS);

    return attrVal ? IdsStringUtils.stringToBool(attrVal) : true;
  }

  /**
   * Sets whether or not to display device information.
   * @param {string|boolean} val deviceSpecs attribute value
   */
  set deviceSpecs(val) {
    const trueVal = IdsStringUtils.stringToBool(val);
    this.setAttribute(attributes.DEVICE_SPECS, trueVal);

    this.#refreshDeviceSpecs();
  }

  /**
   * Refreshes the device specs content
   * @private
   * @returns {void}
   */
  #refreshDeviceSpecs() {
    const specs = IdsDeviceEnvUtils.getDeviceSpecs();
    const env = IdsDeviceEnvUtils.getEnvSpecs();
    const slot = this.querySelectorAll('[slot="device"]');
    const element = `<ids-text slot="device" type="p"><span>${this.locale.translate('OperatingSystem')} : ${env.os.replace(env.currentOSVersion, '')} ${env.currentOSVersion}</span><br>
      <span>${this.locale.translate('Platform')} : ${specs.os}</span><br>
      <span>${this.locale.translate('Mobile')} : ${env.isMobile}</span><br>
      <span>${this.locale.translate('Locale')} : ${this.locale.locale.name}</span><br>
      <span>${this.locale.translate('Language')} : ${this.locale.language.name}</span><br>
      <span>${this.locale.translate('Browser')} : ${` ${env.browserVersionName}`} ${env.currentBrowser} (${env.browserVersion})</span><br>
      <span>${this.locale.translate('BrowserLanguage')} : ${specs.locale}</span><br>
      <span>${this.locale.translate('CookiesEnabled')} : ${specs.cookiesEnabled}</span><br>
      <span>${this.locale.translate('Version')} : ${env.idsVersion}</span>
    </ids-text>`;

    // Clear slot before rerender
    slot.forEach((item) => item.remove());

    if (this.deviceSpecs) {
      this.insertAdjacentHTML('beforeend', element);
    }
  }

  /**
   * @returns {string} copyrightYear attribute value
   */
  get copyrightYear() {
    return this.getAttribute(attributes.COPYRIGHT_YEAR) || new Date().getFullYear();
  }

  /**
   * Set the copyright year property
   * @param {string} val copyrightYear attribute value
   */
  set copyrightYear(val) {
    const sanitizedVal = this.xssSanitize(val);
    this.setAttribute(attributes.COPYRIGHT_YEAR, sanitizedVal);

    this.#refreshCopyright();
  }

  /**
   * @returns {boolean} useDefaultCopyright attribute value
   */
  get useDefaultCopyright() {
    const attrVal = this.getAttribute(attributes.USE_DEFAULT_COPYRIGHT);

    return attrVal ? IdsStringUtils.stringToBool(attrVal) : true;
  }

  /**
   * Sets whether or not to display Legal Approved Infor Copyright Text
   * @param {string|boolean} val useDefaultCopyright attribute value
   */
  set useDefaultCopyright(val) {
    const trueVal = IdsStringUtils.stringToBool(val);
    this.setAttribute(attributes.USE_DEFAULT_COPYRIGHT, trueVal);

    this.#refreshCopyright();
  }

  /**
   * Refreshes the copyright content
   * @private
   * @returns {void}
   */
  #refreshCopyright() {
    const slot = this.querySelectorAll('[slot="copyright"]');
    const copyrightText = this.locale.translate('AboutText').replace('{0}', this.copyrightYear);
    const element = `<ids-text slot="copyright" type="p">${copyrightText} <ids-hyperlink target="_blank" text-decoration="underline" href="htts://www.infor.com">www.infor.com</ids-hyperlink></ids-text>`;

    // Clear slot before rerender
    slot.forEach((item) => item.remove());

    if (this.useDefaultCopyright) {
      this.insertAdjacentHTML('beforeend', element);
    }
  }
}

export default IdsAbout;
