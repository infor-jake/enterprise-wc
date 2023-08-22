/**
 * @jest-environment jsdom
 */
import IdsTag from '../../src/components/ids-tag/ids-tag';
import IdsIcon from '../../src/components/ids-icon/ids-icon';

describe('IdsTag Component', () => {
  let tag: IdsTag;

  beforeEach(() => {
    tag = new IdsTag();
    document.body.appendChild(tag);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });


  it('renders error color from the api', () => {
    tag.color = 'error';
    expect(tag.getAttribute('color')).toEqual('error');
    expect(tag.color).toEqual('error');
  });

  it('renders specific hex color', () => {
    tag.color = '#800000';
    expect(tag.getAttribute('color')).toEqual('#800000');
    expect(tag.color).toEqual('#800000');
  });

  it('renders an extra border on secondary tag', () => {
    tag.color = 'secondary';
    expect(tag.getAttribute('color')).toEqual('secondary');
    expect(tag.color).toEqual('secondary');
  });

  it('removes the color attribute when reset', () => {
    tag.color = 'secondary';
    expect(tag.getAttribute('color')).toEqual('secondary');
    expect(tag.color).toEqual('secondary');

    tag.removeAttribute('color');
    expect(tag.getAttribute('color')).toEqual(null);
    expect(tag.color).toEqual(null);
  });

  it('removes the dismissible attribute when reset', () => {
    tag.dismissible = true;
    expect(tag.getAttribute('dismissible')).toEqual('true');
    expect(tag.dismissible).toEqual(true);

    tag.dismissible = false;
    expect(tag.getAttribute('dismissible')).toEqual(null);
    expect(tag.dismissible).toEqual(false);
  });

  it('dismisses on click', () => {
    tag.dismissible = true;
    tag.querySelector<IdsIcon>('ids-icon[icon="close"]')?.click();
    expect(document.querySelectorAll('ids-tag').length).toEqual(0);
  });

  it('dismisses on backspace/delete', () => {
    tag.dismissible = true;

    const event = new KeyboardEvent('keydown', { key: 'Backspace' });
    tag.dispatchEvent(event);

    expect(document.querySelectorAll('ids-tag').length).toEqual(0);
  });

  it('fires click on enter', () => {
    tag.clickable = true;
    const mockCallback = jest.fn((x) => {
      expect(x).toBeTruthy();
    });
    tag.addEventListener('click', mockCallback);

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    tag.dispatchEvent(event);

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('fires beforetagremove on dismiss', () => {
    tag.dismissible = true;
    tag.addEventListener('beforetagremove', ((e: CustomEvent) => {
      e.detail.response(false);
    }) as EventListener);
    tag.dismiss();

    expect(document.body.contains(tag)).toEqual(true);
  });

  it('fires tagremove on dismiss', () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toBeTruthy();
    });

    tag.dismissible = true;
    tag.addEventListener('tagremove', mockCallback);
    tag.dismiss();

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(document.body.contains(tag)).toEqual(false);
  });

  it('fires aftertagremove on dismiss', () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toBeTruthy();
    });

    tag.dismissible = true;
    tag.addEventListener('aftertagremove', mockCallback);
    tag.dismiss();

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(document.body.contains(tag)).toEqual(false);
  });

  it('should cancel dismiss when not dismissible', () => {
    tag.dismiss();
    expect(document.body.contains(tag)).toEqual(true);
  });

  it('should handle slot change when dismissible', () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toBeTruthy();
    });

    tag.dismissible = true;
    const icon = tag.querySelector('ids-icon[icon="close"]') as IdsIcon;
    const span = document.createElement('span');
    span.innerHTML = 'test';
    tag.insertBefore(span, icon);
    tag.insertBefore(icon, span);

    tag.addEventListener('slotchange', mockCallback);
  });

  it('can be clickable', () => {
    tag.clickable = true;
    const mockHandler = jest.fn();
    tag.listen('Enter', tag, mockHandler);

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    tag.dispatchEvent(event);

    expect(tag.container?.classList.contains('focusable')).toEqual(true);
    expect(mockHandler.mock.calls.length).toBe(1);
  });

  it('removes the clickable attribute when reset', () => {
    tag.clickable = true;
    expect(tag.getAttribute('clickable')).toEqual('true');
    expect(tag.clickable).toBeTruthy();

    tag.clickable = false;
    expect(tag.getAttribute('clickable')).toEqual(null);
    expect(tag.clickable).toBeFalsy();
    expect(tag.container?.classList.contains('focusable')).toEqual(false);
  });

  it('should be able to set attributes before append', () => {
    const elem: any = new IdsTag();
    elem.color = 'red';
    elem.clickable = true;
    elem.dismissible = true;
    document.body.appendChild(elem);

    expect(elem.getAttribute('color')).toEqual('red');
    expect(elem.getAttribute('clickable')).toEqual('true');
    expect(elem.getAttribute('dismissible')).toEqual('true');
  });

  it('should be able to set attributes after append', () => {
    const elem: any = new IdsTag();
    document.body.appendChild(elem);
    elem.color = 'red';
    elem.clickable = true;
    elem.dismissible = true;

    expect(elem.getAttribute('color')).toEqual('red');
    expect(elem.getAttribute('clickable')).toEqual('true');
    expect(elem.getAttribute('dismissible')).toEqual('true');
  });
});
