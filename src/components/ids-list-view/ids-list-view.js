import {
  IdsElement,
  customElement,
  scss,
  attributes,
  mix
} from '../../core';

// Import Utils
import { IdsStringUtils } from '../../utils';

import IdsDataSource from '../../core/ids-data-source';
import { IdsThemeMixin, IdsKeyboardMixin, IdsEventsMixin, IdsSortableMixin } from '../../mixins';

import IdsVirtualScroll from '../ids-virtual-scroll';
import styles from './ids-list-view.scss';

const DEFAULT_HEIGHT = '100%';

/**
 * IDS List View Component
 * @type {IdsListView}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsEventsMixin
 * @part list-item - the li list element
 */
@customElement('ids-list-view')
@scss(styles)
class IdsListView extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin, IdsThemeMixin, IdsSortableMixin) {
  constructor() {
    super();
  }

  // the currently focused list item
  #focusedLiIndex = 0;

  datasource = new IdsDataSource();

  connectedCallback() {
    this.defaultTemplate = `${this.querySelector('template')?.innerHTML || ''}`;
    super.connectedCallback();
    this.attachEventListeners();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.DRAGGABLE,
      attributes.HEIGHT,
      attributes.ITEM_HEIGHT,
      attributes.MODE,
      attributes.VERSION,
      attributes.VIRTUAL_SCROLL
    ];
  }

  getAllLi() {
    return this.container.querySelectorAll('div[part="list-item"]');
  }

  attachEventListeners() {
    this.attachKeyboardListeners();
    if (this.draggable) {
      this.attachDragEventListeners(); // for dragging list items
    } 
    else {
      this.attachClickListeners();
    }
  }

  attachClickListeners() {
    this.getAllLi().forEach((item) => {
      this.attachClickListenersForItems(item);
    });
  }

  // each click on an item - always set that to focus, toggle the selected feature
  attachClickListenersForItems(item) {
    this.onEvent('click', item, () => {
      this.onClick(item);
    });
  }

  attachKeyboardListeners() {
    this.getAllLi().forEach((item) => {
      this.attachKeyboardListenersForItems(item);
    });

    this.onEvent('keydown', document, (event) => {
      switch (event.key) {
      case 'Tab':
        this.virtualScrollContainer?.scrollToIndex(this.#focusedLiIndex);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.#focusedLiIndex >= 0 && !this.getFocusedLi()) {
          this.virtualScrollContainer?.scrollToIndex(this.#focusedLiIndex);
          this.focusLi(this.getPreviousLi(this.getFocusedLi()));
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (this.#focusedLiIndex >= 0 && !this.getFocusedLi()) {
          this.virtualScrollContainer?.scrollToIndex(this.#focusedLiIndex);
          this.focusLi(this.getNextLi(this.getFocusedLi()));
        }
        break;
      default:
        break;
      }
    });
  }

  attachKeyboardListenersForItems(item) {
    this.onEvent('keydown', item, (event) => {
      switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.focusLi(this.getPreviousLi(this.getFocusedLi()));
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.focusLi(this.getNextLi(this.getFocusedLi()));
        break;
      default:
        break;
      }
    });
  }

  onClick(item) {
    if (this.getFocusedLi() !== item) {
      this.focusLi(item);
    }
  }

  focusLi(li) {
    if (li) {
      const prevFocus = this.getFocusedLi();
      // remove tabindex from previous focus
      if (li !== prevFocus) {
        prevFocus?.setAttribute('tabindex', '-1');
        this.#focusedLiIndex = li.getAttribute('index');
      }
      // init new focus
      li.setAttribute('tabindex', '0'); // this clears after every render
      li.focus();
    }
  }

  getFocusedLi() {
    const savedFocusedLi = this.container.querySelector(`div[part="list-item"][index="${this.#focusedLiIndex}"]`);
    const val = savedFocusedLi ?? this.container.querySelector('div[part="list-item"][tabindex="0"]');
    return val;
  }

  getPreviousLi(li) {
    return this.draggable
      ? li.parentElement.previousElementSibling?.firstElementChild // needs to navigate outside to ids-draggable wrapper
      : li.previousElementSibling;
  }

  getNextLi(li) {
    return this.draggable
      ? li.parentElement.nextElementSibling?.firstElementChild
      : li.nextElementSibling;
  }

  listItemTemplateFunc() {
    const func = (item, index) => `
      ${this.draggable ? `<ids-draggable axis="y">` : '' }
        <div
          part="list-item"
          role="listitem"
          tabindex="-1"
          index="${index}"
        >
          ${this.draggable ? `<span></span>` : ``}
          ${this.itemTemplate(item)}
        </div>
      ${this.draggable ? `</ids-draggable>` : '' }
    `;

    return func;
  }

  /**
   * Helper method to render the static scrolling template
   * @returns {string} html
   */
  staticScrollTemplate() {
    return `
      <div class="ids-list-view">
        <div class="ids-list-view-body" role="list">
          ${this.data.length > 0 ? this.data?.map(this.listItemTemplateFunc()).join('') : ''}
        </div>
      </div>
    `;
  }

  /**
   * Helper method to render the virtual scrolling template
   * @returns {string} html
   */
  virtualScrollTemplate() {
    const html = `
      <div class="ids-list-view">
        <ids-virtual-scroll
          height="${this.height}"
          item-height="${this.itemHeight}"
        >
          <div class="ids-list-view-body" role="list" part="contents"></div>
        </ids-virtual-scroll>
      </div>
    `;

    return html;
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `
    ${this.virtualScroll ? this.virtualScrollTemplate() : this.staticScrollTemplate()}
  `;
  }

  /**
   * Return an item's html injecting any values from the dataset as needed.
   * @param  {object} item The item to generate
   * @returns {string} The html for this item
   */
  itemTemplate(item) {
    return IdsStringUtils.injectTemplate(this.defaultTemplate, item);
  }

  #refocus() {
    // focused item is in range
    if (this.getFocusedLi() && this.#focusedLiIndex >= 0) {
      this.focusLi(this.getFocusedLi());
    }
  }

  /**
   * Render the list by applying the template
   * @private
   */
  render() {
    super.render();

    if (!this.virtualScroll && this.data?.length > 0) {
      this.attachEventListeners();
    }

    if (this.virtualScroll && this.data?.length > 0) {
      // reattach event listeners and refocus any focused list item
      this.onEvent('ids-virtual-scroll-afterrender', this.virtualScrollContainer, () => {
        this.attachEventListeners();
        if (this.#focusedLiIndex >= 0) this.#refocus();
      });

      // set the virtual-scroll item-height attribute
      const itemHeight = this.itemHeight || this.checkTemplateHeight(`
        <div part="list-item" tabindex="-1" id="height-tester">
          ${this.itemTemplate(this.datasource.data[0])}
        </div>
      `);

      this.virtualScrollContainer.itemHeight = itemHeight; // calls renderItems()

      this.virtualScrollContainer.itemTemplate = this.listItemTemplateFunc();
      this.virtualScrollContainer.data = this.data; // calls renderItems()

      // give the first list-item a tabbable index on first render
      this.container.querySelector('div[part="list-item"]').setAttribute('tabindex', '0');
    }

    this.adjustHeight();
  }

  get virtualScrollContainer() {
    return this.container.querySelector('ids-virtual-scroll');
  }

  /**
   * Set the height of the list after loading the template
   * @private
   */
  adjustHeight() {
    const rootContainer = this.virtualScroll ? this.virtualScrollContainer : this.container;
    rootContainer.style.height = `${this.height}`;
  }

  /**
   * Calculate the height of a template element.
   * @private
   * @param  {string} itemTemplate The item template
   * @returns {number} The item height
   */
  checkTemplateHeight(itemTemplate) {
    this.container.insertAdjacentHTML('beforeEnd', itemTemplate);
    const tester = this.shadowRoot.querySelector('#height-tester');
    const height = tester.offsetHeight;
    tester.remove();

    return height;
  }

  /**
   * Set the data array of the listview
   * @param {Array | null} value The array to use
   */
  set data(value) {
    if (this.datasource) {
      this.datasource.data = value || [];
      this.render(true);
    }
  }

  get data() { return this?.datasource?.data || []; }

  /**
   * Set the list view to use virtual scrolling for a large amount of elements.
   * @param {boolean|string} value true to use virtual scrolling
   */
  set virtualScroll(value) {
    if (IdsStringUtils.stringToBool(value)) {
      this.setAttribute(attributes.VIRTUAL_SCROLL, value.toString());
    } else {
      this.removeAttribute(attributes.VIRTUAL_SCROLL);
    }
    this.render();
  }

  get virtualScroll() { return IdsStringUtils.stringToBool(this.getAttribute(attributes.VIRTUAL_SCROLL)); }

  /**
   * Set the expected height of the viewport for virtual scrolling
   * @param {string} value true to use virtual scrolling
   */
  set height(value) {
    if (value) {
      this.setAttribute(attributes.HEIGHT, value);
    } else {
      this.setAttribute(attributes.HEIGHT, DEFAULT_HEIGHT);
    }
  }

  get height() {
    return this.getAttribute(attributes.HEIGHT) || DEFAULT_HEIGHT;
  }

  /**
   * Set the expected height of each item
   * @param {string} value true to use virtual scrolling
   */
  set itemHeight(value) {
    if (value) {
      this.setAttribute(attributes.ITEM_HEIGHT, value);
    } else {
      this.removeAttribute(attributes.ITEM_HEIGHT);
    }
  }

  get itemHeight() {
    return this.getAttribute(attributes.ITEM_HEIGHT);
  }

  /**
   * Adds dragging functionality to all list items
   */
  attachDragEventListeners() {
    this.getAllDraggable().forEach((draggable) => {
      this.attachDragEventListenersForDraggable(draggable);
    });
  }

  /**
   * Helper function for attaching dragging functionality to a list item
   * @param {Element} el the list item to add draggable functionality
   */
  attachDragEventListenersForDraggable(el) {
    const li = el.querySelector('div[part="list-item"]');
    // Toggle selected attribute, create placeholder, edit the css at the beginning of the drag
    this.onEvent('ids-dragstart', el, () => {
      // TODO: change this to take draggable as parameter to make it more modular, can specify that its a div[part="list-item"] in the onClick() method for both list-builder/view 
      this.onClick(li);

      // create placeholder
      this.placeholder = this.createPlaceholderClone(el);
      // need this for draggable to move around
      el.style.position = `absolute`;
      el.style.opacity = `0.95`;
      el.style.zIndex = `100`;
      
      el.parentNode.insertBefore(
        this.placeholder,
        el.nextSibling
      );
    });

    // Calculate where the dragged list item is in relation to the other list items and move the placeholder accordingly
    this.onEvent('ids-drag', el, () => {
      let prevEle = this.placeholder?.previousElementSibling;
      let nextEle = this.placeholder?.nextElementSibling;

      // skip over checking the original selected node position
      if (prevEle === el) {
        prevEle = prevEle.previousElementSibling;
      }
      // skip over checking the original selected position
      if (nextEle === el) {
        nextEle = nextEle.nextElementSibling;
      }

      
      if (prevEle && this.isAbove(el, prevEle)) {
        this.swap(this.placeholder, prevEle);
        return;
      }
      
      if (nextEle && this.isAbove(nextEle, el)) {
        this.swap(nextEle, this.placeholder);
      }
    });

    // At the end of the drag, return the css properties back to normal and remove the placeholder
    this.onEvent('ids-dragend', el, () => {
      el.style.removeProperty('position');
      el.style.removeProperty('transform');
      el.style.removeProperty('opacity');
      el.style.removeProperty('z-index');

      this.swap(el, this.placeholder);
      if (this.placeholder) {
        this.placeholder.remove();
        this.placeholder = null;
      }

      li.focus();
    });
  }
}

export default IdsListView;
