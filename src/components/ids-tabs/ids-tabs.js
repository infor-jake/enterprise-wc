import {
  IdsElement,
  customElement,
  attributes,
  scss,
  mix,
} from '../../core/ids-element';

import {
  IdsKeyboardMixin,
  IdsEventsMixin,
  IdsThemeMixin,
  IdsColorVariantMixin,
  IdsOrientationMixin,
  IdsAttributeProviderMixin
} from '../../mixins';

import IdsHeader from '../ids-header';
import IdsTab from './ids-tab';
import styles from './ids-tabs.scss';

/**
 * list of entries for attributes provided by
 * the ids-tabs-context and how they map,
 * as well as which are listened on for updates
 * in the children
 */
const attributeProviderDefs = {
  attributesProvided: [{
    attribute: attributes.COLOR_VARIANT,
    component: IdsTab
  },
  {
    attribute: attributes.ORIENTATION,
    component: IdsTab
  }]
};

/**
 * IDS Tabs Component
 * @type {IdsTabs}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 */
@customElement('ids-tabs')
@scss(styles)
class IdsTabs extends mix(IdsElement).with(
    IdsAttributeProviderMixin(attributeProviderDefs),
    IdsColorVariantMixin,
    IdsEventsMixin,
    IdsKeyboardMixin,
    IdsOrientationMixin,
    IdsThemeMixin
  ) {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.VALUE
    ];
  }

  /**
   * Inherited from `IdsColorVariantMixin`
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = ['alternate'];

  template() {
    return '<slot></slot>';
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.setAttribute('role', 'tablist');

    if (!this.hasAttribute(attributes.COLOR_VARIANT)) {
      this.#adjustColorVariant();
    }

    this.onEvent('tabselect', this, (e) => {
      if (e.target.value !== this.value) {
        this.setAttribute(attributes.VALUE, e.target.value);
      }
    });

    // set initial selection state
    this.#updateSelectionState();
  }

  /**
   * Binds associated callbacks and cleans
   * old handlers when template refreshes
   */
  rendered() {
    this.#updateCallbacks();
  }

  /**
   * @param {string} value A value which represents a currently selected tab
   */
  set value(value) {
    const currentValue = this.value;
    if (currentValue !== value) {
      this.setAttribute(attributes.VALUE, value);
      this.#updateSelectionState();
      this.triggerEvent('change', this, {
        bubbles: false,
        detail: { elem: this, value }
      });
    }
  }

  /**
   * @returns {string} The value representing a currently selected tab
   */
  get value() {
    return this.getAttribute(attributes.VALUE);
  }

  /**
   * Traverses parent nodes and scans for parent IdsHeader components.
   * If an IdsHeader is found, adjusts this component's ColorVariant accordingly.
   */
  #adjustColorVariant() {
    let isHeaderDescendent = false;
    let currentElement = this.host || this.parentNode;

    while (!isHeaderDescendent && currentElement) {
      if (currentElement instanceof IdsHeader) {
        isHeaderDescendent = true;
        break;
      }

      // consider the body the ceiling of where to reach here
      if (currentElement.tagName === 'BODY') {
        break;
      }

      currentElement = currentElement.host || currentElement.parentNode;
    }

    if (isHeaderDescendent) {
      this.colorVariant = 'alternate';
    }
  }

  /**
   * When a child value or this component value changes,
   * called to rebind onclick callbacks to each child
   */
  #updateCallbacks() {
    // Reusable handlers
    const nextTabHandler = (e) => {
      this.nextTab(e.target.closest('ids-tab')).focus();
    };
    const prevTabHandler = (e) => {
      this.prevTab(e.target.closest('ids-tab')).focus();
    };
    const selectTabHandler = (e) => {
      const tab = e.target.closest('ids-tab');
      if (tab) {
        this.value = tab.value;
      }
    };

    // Add key listeners and consider orientation for assignments
    if (this.orientation !== 'vertical') {
      this.listen('ArrowLeft', this, prevTabHandler);
      this.listen('ArrowRight', this, nextTabHandler);
    } else {
      this.listen('ArrowUp', this, prevTabHandler);
      this.listen('ArrowDown', this, nextTabHandler);
    }

    // Home/End keys should navigate to beginning/end of Tab list respectively
    this.listen('Home', this, () => {
      this.children[0].focus();
    });
    this.listen('End', this, () => {
      this.children[this.children.length - 1].focus();
    });

    // Add Events/Key listeners for Tab Selection via click/keyboard
    this.onEvent('click.tabs', this, selectTabHandler);
    this.listen('Enter', this, selectTabHandler);
  }

  /**
   * Navigates from a specified Tab to the next-available Tab in the list
   * @param {HTMLElement} currentTab an contained element (usually an IdsTab) to check for siblings
   * @returns {IdsTab} the next tab in this Tab list's order
   */
  nextTab(currentTab) {
    let nextTab = currentTab.nextElementSibling;

    // If next sibling isn't a tab or is disabled, try this method again on the found sibling
    if (nextTab && (nextTab.tagName !== 'IDS-TAB' || nextTab.disabled)) {
      return nextTab(nextTab);
    }

    // If null, reset back to the first tab (cycling behavior)
    if (!nextTab) {
      nextTab = this.children[0];
    }

    return nextTab;
  }

  /**
   * Navigates from a specified Tab to the previously-available Tab in the list
   * @param {HTMLElement} currentTab an contained element (usually an IdsTab) to check for siblings
   * @returns {IdsTab} the previous tab in this Tab list's order
   */
  prevTab(currentTab) {
    let prevTab = currentTab.previousElementSibling;

    // If previous sibling isn't a tab or is disabled, try this method again on the found sibling
    if (prevTab && (prevTab.tagName !== 'IDS-TAB' || prevTab.disabled)) {
      return prevTab(prevTab);
    }

    // If null, reset back to the last tab (cycling behavior)
    if (!prevTab) {
      prevTab = this.children[this.children.length - 1];
    }

    return prevTab;
  }

  /**
   * Sets the ids-tab selection states based on the current value
   */
  #updateSelectionState() {
    if (!this.children.length) {
      return;
    }

    // determine which child tab value was set, then highlight the item
    let hadTabSelection = false;

    for (let i = 0; i < this.children.length; i++) {
      const tabValue = this.children[i].getAttribute(attributes.VALUE);
      const isTabSelected = Boolean(this.value === tabValue);

      if (this.children[i].selected !== isTabSelected) {
        this.children[i].selected = isTabSelected;
      }

      if (!hadTabSelection && Boolean(this.children[i].selected)) {
        hadTabSelection = true;
      }
    }

    // if no selection found, flag the first child;
    // this will possibly send a callback up to context for
    // other listeners and trigger a value change

    if (!hadTabSelection) {
      window.requestAnimationFrame(() => {
        this.children[0].selected = true;
        this.triggerEvent('tabselect', this.children[0], { bubbles: true });
      });
    }
  }
}

export default IdsTabs;
