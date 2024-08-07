# Ids Rating

## Description

Allows for the display or selection of an objects rating.

## Usage

The rating component displays a scale of selectable values in ascending order. A user can select a rating by clicking the star with the position that corresponds to the users rating out of the total. Best for showing a user's current selection relative to the lower and upper limits of a scale.

## Code Examples

The rating component can be used as an interactive or read only element. Users may select any whole value out of the total as a rating. When functioning as a read-only element, ratings may use .5 decimals to more accurately display the average rating of an object.

A basic rating with 5 stars by default and none checked.

```html
<ids-rating></ids-rating>
```

A rating rating with 4.5/5 which is also readonly. If using half stars the rating component should be readonly as you cannot click half stars in any way with the UI.

```html
<ids-rating stars="5" readonly="true" value="4.5" size="large"></ids-rating>
```

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>: If the rating item is enabled this will focus or unfocus the star.
- <kbd>Enter</kbd>: If this will follow the link url or action.

## Accessibility Guidelines

- `aubible` span are added for screen readers to hear the star information.

## Settings and Attributes

- `stars` {number} Sets the stars attribute to displayed the amount of items`stars="5"`
- `value` {number} Sets the rating value attribute. `value="0"`
- `readyonly` {boolean} Sets the readonly attribute. Valid values are 'true' | 'false'
- `size` {number} Sets the rating size attribute. `size="large"` Valid values are 'small' | 'medium' | 'large'
- `disabled` {boolean} Sets the disabled state

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Rating component was added in v4.0.0
- Can be invoked on an element with `$('#my-element').rating();`

**4.x to 5.x**

- Rating is now a custom element `<ids-rating></ids-rating>`

### Version - 4.x

```html
  <div class="rating">
  <input type="radio" class="is-filled" name="rating-name" id="one-star-id1"/>
  <label for="one-star-id1">
    <svg class="icon" focusable="false" aria-hidden="true">
      <use href="#icon-star-filled"/>
    </svg>
    <span class="audible">1 out of 5 Stars</span>
  </label>

  <input type="radio" class="is-filled" name="rating-name" id="two-star-id1"/>
  <label for="two-star-id1">
    <svg class="icon" focusable="false" aria-hidden="true">
      <use href="#icon-star-filled"/>
    </svg>
    <span class="audible">2 out of 5 Stars</span>
  </label>

  <input type="radio" class="is-filled" name="rating-name" id="three-star-id1"/>
  <label for="three-star-id1">
    <svg class="icon" focusable="false" aria-hidden="true">
      <use href="#icon-star-filled"/>
    </svg>
    <span class="audible">3 out of 5 Stars</span>
  </label>

  <input type="radio" class="is-half" checked name="rating-name" id="four-star-id1"/>
  <label for="four-star-id1">
    <svg class="icon" focusable="false" aria-hidden="true">
      <use href="#icon-star-half"/>
    </svg>
    <span class="audible">4 out of 5 Stars</span>
  </label>

  <input type="radio" name="rating-name" id="five-star-id1"/>
  <label for="five-star-id1">
    <svg class="icon" focusable="false" aria-hidden="true">
      <use href="#icon-star-filled"/>
    </svg>
    <span class="audible">5 out of 5 Stars</span>
  </label>
  </div>
```

### Version - 5.x

```html
  <ids-rating></ids-rating>
```
