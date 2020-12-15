import {
  IdsElement,
  customElement,
  mixin,
  scss
} from '../ids-base/ids-element';
import { props } from '../ids-base/ids-constants';
import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';
import IdsMenuGroup from './ids-menu-group';
import IdsMenuItem from './ids-menu-item';

import styles from './ids-menu.scss';

/**
 * @private
 * @param {string} groupName the group to search for
 * @param {HTMLElement} idsMenu the parent menu element
 * @returns {boolean} true if the provided `groupName` exists on a group within the menu
 */
function isValidGroup(groupName, idsMenu) {
  let hasGroup = false;
  idsMenu.groups.forEach((group) => {
    if (group?.id === groupName) {
      hasGroup = true;
    }
  });
  return hasGroup;
}

/**
 * @private
 * @param {IdsMenuItem} item the element to be checked
 * @param {HTMLElement} idsMenu the parent menu element
 * @param {boolean} [checkDisabled] true if "usable" should also mean "not disabled" while checking
 * @returns {boolean} true if the provided element is a "currently-usable" IdsMenuItem type.
 */
function isUsableItem(item, idsMenu, checkDisabled = false) {
  const isItem = item instanceof IdsMenuItem;
  const menuHasItem = idsMenu.contains(item);
  let notDisabled = true;
  if (isItem && checkDisabled) {
    notDisabled = !item.disabled;
  }
  return (isItem && menuHasItem && notDisabled);
}

/**
 * IDS Menu Component
 */
@customElement('ids-menu')
@scss(styles)
@mixin(IdsEventsMixin)
class IdsMenu extends IdsElement {
  constructor() {
    super();
    this.state = {};
  }

  /**
   * Sets up event handlers used in this menu.
   * @private
   * @returns {void}
   */
  handleEvents() {
    // Highlight handler -- Menu Items Only, don't change if the target is disabled
    const highlightItem = (e) => {
      const thisItem = e.target.closest('ids-menu-item');
      if (isUsableItem(thisItem, this, true)) {
        this.highlightItem(thisItem);
      }
    };

    // Unhighlight handler - Menu Items Only
    const unhighlightItem = (e) => {
      const thisItem = e.target.closest('ids-menu-item');
      if (isUsableItem(thisItem, this)) {
        thisItem.unhighlight();
      }
    };

    // Highlight the item on click
    // If the item doesn't contain a submenu, select it.
    // If the item does have a submenu, activate it.
    this.eventHandlers.addEventListener('click', this, (e) => {
      const thisItem = e.target.closest('ids-menu-item');
      if (isUsableItem(thisItem, this, true)) {
        this.highlightItem(thisItem);
        if (thisItem.hasSubmenu) {
          thisItem.showSubmenu();
        } else {
          this.selectItem(thisItem);
        }
      }
    });

    // Focus in/out causes highlight to change
    this.eventHandlers.addEventListener('focusin', this, highlightItem);
    this.eventHandlers.addEventListener('focusout', this, unhighlightItem);
  }

  /**
   * Sets up the connection to the global keyboard handler
   * @returns {void}
   */
  handleKeys() {
    this.keyboard = new IdsKeyboardMixin();

    // Arrow Up/Left navigates focus backward
    this.keyboard.listen(['ArrowUp', 'ArrowLeft'], this, (e) => {
      if (this.parentMenu) {
        e.stopPropagation();
      }
      this.navigate(-1, true);
    });

    // Arrow Right/Down navigates focus forward
    this.keyboard.listen(['ArrowDown', 'ArrowRight'], this, (e) => {
      if (this.parentMenu) {
        e.stopPropagation();
      }
      this.navigate(1, true);
    });

    // Enter/Spacebar select the menu item
    this.keyboard.listen(['Enter', 'Spacebar', ' '], this, (e) => {
      if (this.parentMenu) {
        e.stopPropagation();
      }
      const thisItem = e.target.closest('ids-menu-item');
      if (isUsableItem(thisItem, this, true)) {
        this.selectItem(thisItem);
      }
    });
  }

  /**
   * Runs when the menu element is connected to the DOM.
   * @returns {void}
   */
  connectedCallBack() {
    this.detectIcons();
    this.handleEvents();
    this.handleKeys();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const hasIconsClass = this.itemIcons.length ? ' has-icons' : '';
    return `<nav class="ids-menu${hasIconsClass}" role="menu">
      <slot></slot>
    </nav>`;
  }

  /**
   * @readonly
   * @returns {Array<IdsMenuGroup>} all available groups
   */
  get groups() {
    return [...this.children].filter((e) => e.matches('ids-menu-group'));
  }

  /**
   * @readonly
   * @returns {Array<IdsMenuItem>} all available menu items
   */
  get items() {
    let i = [];
    this.groups.forEach((group) => {
      i = i.concat([...group.children].filter((e) => e.matches('ids-menu-item')));
    });
    return i;
  }

  /**
   * References all icons that describe menu item contents (ignores dropdown/check icons)
   * @readonly
   * @returns {Array<HTMLElement>} list of items
   */
  get itemIcons() {
    const icons = [];
    this.items.forEach((item) => {
      if (item.iconEl) {
        icons.push(item.iconEl);
      }
    });
    return icons;
  }

  /**
   * @readonly
   * @returns {IdsMenuItem} the currently focused menu item, if one exists
   */
  get focused() {
    return this.items.find((item) => document.activeElement.isEqualNode(item));
  }

  /**
   * @readonly
   * @returns {Array<IdsMenuItem>} all menu items that are currently highlighted
   */
  get highlighted() {
    return this.items.filter((item) => item.highlighted);
  }

  /**
   * @readonly
   * @returns {IdsMenu} parent menu component, if this menu is a submenu
   */
  get parentMenu() {
    return this.parentNode.closest('ids-menu, ids-popup-menu');
  }

  /**
   * @readonly
   * @returns {IdsMenuItem} parent menu item, if this menu is a submenu
   */
  get parentMenuItem() {
    return this.parentNode.closest('ids-menu-item');
  }

  /**
   * @readonly
   * @returns {Array<IdsMenu>} list of all available submenus
   */
  get submenus() {
    const submenus = [];
    this.items.forEach((item) => {
      const submenu = item.submenu;
      if (submenu) {
        submenus.push(submenu);
      }
    });
    return submenus;
  }

  /**
   * Unhighlights all menu items, then highlights a specified item.
   * @param {IdsMenuItem} menuItem reference to the menu item that will be highlighted
   * @returns {void}
   */
  highlightItem(menuItem) {
    if (!isUsableItem(menuItem, this, true)) {
      return;
    }

    this.items.forEach((item) => {
      if (!menuItem.isEqualNode(item)) {
        item.unhighlight();
      }
    });
    menuItem.highlight();
  }

  /**
   * Sets/Remove an alignment CSS class
   * @returns {void}
   */
  detectIcons() {
    const icons = this.itemIcons;
    const hasIcons = icons.length > 0;
    this.classList[hasIcons ? 'add' : 'remove']('has-icons');

    this.items.forEach((item) => {
      item.setDisplayType(hasIcons);
    });
  }

  /**
   * Uses a currently-highlighted menu item to "navigate" a specified number
   * of steps to another menu item, highlighting it.
   * @param {number} [amt] the amount of items to navigate
   * @param {boolean} [doFocus] if true, causes the new item to become focused.
   * @returns {IdsMenuItem} the item that will be highlighted
   */
  navigate(amt = 0, doFocus = false) {
    const items = this.items;
    let currentItem = this.focused || items[0];

    if (Number.isNaN(amt)) {
      return currentItem;
    }

    // Calculate steps/meta
    const negative = amt < 0;
    let steps = Math.abs(amt);
    let currentIndex = items.indexOf(currentItem);

    // Step through items to the target
    while (steps > 0) {
      currentItem = items[currentIndex + (negative ? -1 : 1)];
      currentIndex = items.indexOf(currentItem);

      // "-1" means we've crossed the boundary and need to loop back around
      if (currentIndex < 0) {
        currentIndex = (negative ? items.length - 1 : 0);
        currentItem = items[currentIndex];
      }

      // Don't count disabled items as "taking a step"
      if (!currentItem.disabled) {
        steps -= 1;
      }
    }

    if (!currentItem.disabled && doFocus) {
      currentItem.a.focus();
    }

    return currentItem;
  }

  /**
   * Retrieves a list of selected items in this menu.
   * @param {string} [groupName] optionally limits results to within the specified group id
   * @returns {Array<IdsMenuItem>} list of selected menu items
   */
  getSelectedItems(groupName = '') {
    const hasGroup = isValidGroup(groupName, this);
    return this.items.filter((item) => {
      if (hasGroup) {
        return item.selected && item.group?.id === groupName;
      }
      return item.selected;
    });
  }

  /**
   * Selects a menu item contained by this menu.
   * @param {IdsMenuItem} menuItem the item to be selected
   * @returns {void}
   */
  selectItem(menuItem) {
    if (!isUsableItem(menuItem, this, true)) {
      return;
    }

    const group = menuItem.parentNode;
    const items = group.items;
    let targetDeselection;

    items.forEach((item) => {
      // @TODO handle multiple selection / group-only selection
      if (!item.isEqualNode(menuItem) && item.selected) {
        targetDeselection = item;
      }
    });

    // Select the new item, and do a deselection if necessary.
    // @TODO This logic might need to be different for multiselection/group selection
    menuItem.select();
    if (menuItem.selected && targetDeselection) {
      targetDeselection.deselect();
    }
  }

  /**
   * Clears any selected items in the menu, or specified group
   * @param {string} [groupName] optionally limits results to within the specified group id
   * @returns {void}
   */
  clearSelectedItems(groupName) {
    const hasGroup = isValidGroup(groupName, this);
    this.items.forEach((item) => {
      let doDeselect = false;
      if (hasGroup) {
        doDeselect = item.selected && item.group?.id === groupName;
      } else {
        doDeselect = item.selected;
      }

      if (doDeselect) {
        item.deselect();
      }
    });
  }
}

export default IdsMenu;
