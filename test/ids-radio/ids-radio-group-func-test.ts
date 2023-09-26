/**
 * @jest-environment jsdom
 */
import IdsRadio from '../../src/components/ids-radio/ids-radio';
import IdsRadioGroup from '../../src/components/ids-radio/ids-radio-group';
import IdsContainer from '../../src/components/ids-container/ids-container';
import { messages as deMessages } from '../../src/components/ids-locale/data/de-messages';
import IdsGlobal from '../../src/components/ids-global/ids-global';

jest.useFakeTimers();

describe('IdsRadioGroup Component', () => {
  let rg: any;
  let container: any;

  beforeEach(async () => {
    container = new IdsContainer();
    IdsGlobal.getLocale().loadedLanguages.set('de', deMessages);

    const rb1 = new IdsRadio();
    const rb2 = new IdsRadio();
    const elem = new IdsRadioGroup();
    rb1.value = 'testRb1';
    rb2.value = 'testRb2';
    rb1.label = 'test Radio1';
    rb2.label = 'test Radio2';
    elem.label = 'testRg';
    elem.appendChild(rb1);
    elem.appendChild(rb2);
    container.appendChild(elem);
    document.body.appendChild(container);
    rg = document.querySelector('ids-radio-group');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem: any = new IdsRadioGroup();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-radio-group').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should handle dirty tracking', () => {
    expect(rg.getAttribute('dirty-tracker')).toEqual(null);
    expect(rg.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(rg.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    let radioArr = [].slice.call(rg.querySelectorAll('ids-radio'));
    rg.makeChecked(radioArr[0]);
    rg.dirtyTracker = true;
    expect(rg.getAttribute('dirty-tracker')).toEqual('true');
    expect(rg.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(rg.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    radioArr = [].slice.call(rg.querySelectorAll('ids-radio'));
    rg.makeChecked(radioArr[1]);
    let val = rg.valMethod(rg.input);
    rg.setDirtyTracker(val);
    expect(rg.getAttribute('dirty-tracker')).toEqual('true');
    expect(rg.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
    expect(rg.labelEl.querySelector('.msg-dirty')).toBeTruthy();
    radioArr = [].slice.call(rg.querySelectorAll('ids-radio'));
    rg.makeChecked(radioArr[0]);
    val = rg.valMethod(rg.input);
    rg.setDirtyTracker(val);
    expect(rg.getAttribute('dirty-tracker')).toEqual('true');
    expect(rg.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(rg.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    jest.advanceTimersByTime(1);
    rg.dirtyTracker = false;
    expect(rg.getAttribute('dirty-tracker')).toEqual(null);
    expect(rg.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(rg.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    radioArr = [].slice.call(rg.querySelectorAll('ids-radio'));
    radioArr.forEach((r: any) => r.remove());
    rg.dirtyTracker = true;
    radioArr = [].slice.call(rg.querySelectorAll('ids-radio'));
    expect(radioArr.length).toEqual(0);

    document.body.innerHTML = '';
    const rb1 = new IdsRadio();
    const rb2 = new IdsRadio();
    const elem: any = new IdsRadioGroup();
    rb1.value = 'testRb1';
    rb2.value = 'testRb2';
    rb1.label = 'test Radio1';
    rb2.label = 'test Radio2';
    elem.label = 'testRg';
    elem.appendChild(rb1);
    elem.appendChild(rb2);
    document.body.appendChild(elem);
    rg = document.querySelector('ids-radio-group');
    rg.dirtyTracker = true;
    rg.afterChildrenReady();
    expect(rg.getAttribute('dirty-tracker')).toEqual('true');
    expect(rg.shadowRoot.querySelector('.icon-dirty')).toBeFalsy();
    expect(rg.labelEl.querySelector('.msg-dirty')).toBeFalsy();
    radioArr = [].slice.call(rg.querySelectorAll('ids-radio'));
    rg.makeChecked(radioArr[0]);
    val = rg.valMethod(rg.input);
    rg.setDirtyTracker(val);
    jest.advanceTimersByTime(1);
    expect(rg.getAttribute('dirty-tracker')).toEqual('true');
    expect(rg.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
    expect(rg.labelEl.querySelector('.msg-dirty')).toBeTruthy();
    jest.advanceTimersByTime(1);
    expect(rg.getAttribute('dirty-tracker')).toEqual('true');
    expect(rg.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
    expect(rg.labelEl.querySelector('.msg-dirty')).toBeTruthy();
  });

  it('should renders as disabled', () => {
    expect(rg.getAttribute('disabled')).toEqual(null);
    let radioArr = [].slice.call(rg.querySelectorAll('ids-radio'));
    radioArr.forEach((r: any) => {
      expect(r.getAttribute('group-disabled')).toEqual(null);
    });
    let rootEl = rg.shadowRoot.querySelector('.ids-radio-group');
    expect(rootEl.classList).not.toContain('disabled');
    expect(rg.disabled).toEqual(false);
    rg.disabled = true;
    expect(rg.getAttribute('disabled')).toEqual('true');
    radioArr = [].slice.call(rg.querySelectorAll('ids-radio'));
    radioArr.forEach((r: any) => {
      expect(r.getAttribute('group-disabled')).toEqual('true');
    });
    rootEl = rg.shadowRoot.querySelector('.ids-radio-group');
    expect(rootEl.classList).toContain('disabled');
    expect(rg.disabled).toEqual(true);
    rg.disabled = false;
    expect(rg.getAttribute('disabled')).toEqual(null);
    radioArr = [].slice.call(rg.querySelectorAll('ids-radio'));
    radioArr.forEach((r: any) => {
      expect(r.getAttribute('group-disabled')).toEqual(null);
    });
    rootEl = rg.shadowRoot.querySelector('.ids-radio-group');
    expect(rootEl.classList).not.toContain('disabled');
    expect(rg.disabled).toEqual(false);
  });

  it('should add/remove required error', () => {
    rg.validate = 'required';
    expect(rg.getAttribute('validate')).toEqual('required');
    expect(rg.validate).toEqual('required');
    expect(rg.labelEl.classList).toContain('required');
    expect(rg.shadowRoot.querySelector('.validation-message')).toBeFalsy();
    rg.checkValidation();
    const msgEl = rg.shadowRoot.querySelector('.validation-message');
    expect(msgEl).toBeTruthy();
    expect(msgEl.getAttribute('validation-id')).toEqual('required');
    const rb1 = rg.querySelector('ids-radio');
    rg.makeChecked(rb1);
    rg.checkValidation();
    expect(rg.shadowRoot.querySelector('.validation-message')).toBeFalsy();
  });

  it('should set validation events', () => {
    expect(rg.getAttribute('validate')).toEqual(null);
    expect(rg.getAttribute('validation-events')).toEqual(null);
    rg.validate = 'required';
    rg.validationEvents = 'blur';
    expect(rg.getAttribute('validate')).toEqual('required');
    expect(rg.getAttribute('validation-events')).toEqual('blur');
    rg.validationEvents = null;
    expect(rg.getAttribute('validate')).toEqual('required');
    expect(rg.getAttribute('validation-events')).toEqual(null);
    rg.validate = null;
    expect(rg.getAttribute('validate')).toEqual(null);
    expect(rg.getAttribute('validation-events')).toEqual(null);
  });

  it('should set label required indicator', () => {
    const className = 'no-required-indicator';
    expect(rg.getAttribute('validate')).toEqual(null);
    expect(rg.getAttribute('label-required')).toEqual(null);
    expect(rg.labelEl.classList).not.toContain(className);
    rg.validate = 'required';
    expect(rg.getAttribute('validate')).toEqual('required');
    expect(rg.getAttribute('label-required')).toEqual(null);
    expect(rg.labelEl.classList).not.toContain(className);
    rg.labelRequired = false;
    expect(rg.getAttribute('validate')).toEqual('required');
    expect(rg.getAttribute('label-required')).toEqual(null);
    expect(rg.labelEl.classList).toContain(className);
    expect(rg.labelRequired).toEqual(null);
    rg.labelRequired = true;
    expect(rg.getAttribute('validate')).toEqual('required');
    expect(rg.getAttribute('label-required')).toEqual('true');
    expect(rg.labelEl.classList).not.toContain(className);
    expect(rg.labelRequired).toEqual('true');
  });

  it('should set label text', () => {
    document.body.innerHTML = '';
    const elem: any = new IdsRadioGroup();
    document.body.appendChild(elem);
    rg = document.querySelector('ids-radio-group');
    expect(rg.shadowRoot.querySelector('.group-label-text')).toBeFalsy();
    rg.label = 'test';
    let label = rg.shadowRoot.querySelector('.group-label-text');
    expect(label.textContent.trim()).toBe('test');
    rg.label = 'test2';
    label = rg.shadowRoot.querySelector('.group-label-text');
    expect(label.textContent.trim()).toBe('test2');
    rg.label = null;
    expect(rg.shadowRoot.querySelector('.group-label-text')).toBeFalsy();
  });

  it('should renders value', () => {
    const value = 'testRb1';
    let rb1: any = document.querySelector(`ids-radio[value="${value}"]`);
    expect(rb1.getAttribute('checked')).toEqual(null);
    expect(rg.getAttribute('value')).toEqual(null);
    rg.value = value;
    rb1 = document.querySelector(`ids-radio[value="${value}"]`);
    expect(rb1.getAttribute('checked')).toEqual('true');
    expect(rg.getAttribute('value')).toEqual(value);
    rg.value = null;
    rb1 = document.querySelector(`ids-radio[value="${value}"]`);
    expect(rb1.getAttribute('checked')).toEqual(null);
    expect(rg.getAttribute('value')).toEqual(null);
  });

  it('should not renders wrong value', () => {
    const value = 'testRb1';
    const wrongVal = 'some other value';
    let rb1: any = document.querySelector(`ids-radio[value="${value}"]`);
    expect(rb1.getAttribute('checked')).toEqual(null);
    expect(rg.getAttribute('value')).toEqual(null);
    rg.value = wrongVal;
    rb1 = document.querySelector(`ids-radio[value="${value}"]`);
    expect(rb1.getAttribute('checked')).toEqual(null);
    expect(rg.getAttribute('value')).toEqual(null);
    rg.value = null;
  });

  it('should set value', () => {
    document.body.innerHTML = '';
    let elem = document.createElement('ids-radio-group');
    let rb1 = document.createElement('ids-radio');
    let rb2 = document.createElement('ids-radio');
    rb1.setAttribute('value', 't1');
    rb1.setAttribute('checked', 'true');
    rb2.setAttribute('value', 't2');
    rb2.setAttribute('checked', 'true');
    elem.appendChild(rb1);
    elem.appendChild(rb2);
    rg = document.body.appendChild(elem);
    rg.template();
    rg.setValue();
    let radioArr: any[] = [].slice.call(rg.querySelectorAll('ids-radio'));
    expect(radioArr[0].getAttribute('checked')).toEqual(null);
    expect(radioArr[1].getAttribute('checked')).toEqual('true');
    expect(rg.getAttribute('value')).toEqual('t2');

    document.body.innerHTML = '';
    elem = document.createElement('ids-radio-group');
    rb1 = document.createElement('ids-radio');
    rb2 = document.createElement('ids-radio');
    rb1.setAttribute('checked', 'true');
    rb2.setAttribute('checked', 'true');
    elem.appendChild(rb1);
    elem.appendChild(rb2);
    rg = document.body.appendChild(elem);
    rg.setAttribute('label', 'test');
    rg.setAttribute('label-required', 'false');
    rg.template();
    rg.setValue();
    radioArr = [].slice.call(rg.querySelectorAll('ids-radio'));
    expect(radioArr[0].getAttribute('checked')).toEqual(null);
    expect(radioArr[1].getAttribute('checked')).toEqual('true');

    document.body.innerHTML = '';
    elem = document.createElement('ids-radio-group');
    rb1 = document.createElement('ids-radio');
    rb2 = document.createElement('ids-radio');
    rb1.setAttribute('checked', 'true');
    elem.appendChild(rb1);
    elem.appendChild(rb2);
    rg = document.body.appendChild(elem);
    rg.setAttribute('label', 'test');
    rg.template();
    rg.setValue();
    radioArr = [].slice.call(rg.querySelectorAll('ids-radio'));
    expect(radioArr[0].getAttribute('checked')).toEqual('true');
    expect(radioArr[1].getAttribute('checked')).toEqual(null);

    document.body.innerHTML = '';
    elem = document.createElement('ids-radio-group');
    rg = document.body.appendChild(elem);
    rg.template();
    radioArr = [].slice.call(rg.querySelectorAll('ids-radio'));
    expect(radioArr.length).toEqual(0);
  });

  it('should clear', () => {
    document.body.innerHTML = '';
    const elem = document.createElement('ids-radio-group');
    const rb1 = document.createElement('ids-radio');
    const rb2 = document.createElement('ids-radio');
    rb1.setAttribute('checked', 'true');
    rb2.setAttribute('checked', 'true');
    elem.appendChild(rb1);
    elem.appendChild(rb2);
    rg = document.body.appendChild(elem);
    rg.template();
    rg.setValue();
    let radioArr: any[] = [].slice.call(rg.querySelectorAll('ids-radio'));
    expect(radioArr[0].getAttribute('checked')).toEqual(null);
    expect(radioArr[1].getAttribute('checked')).toEqual('true');
    rg.clear();
    radioArr = [].slice.call(rg.querySelectorAll('ids-radio'));
    expect(radioArr[0].getAttribute('checked')).toEqual(null);
    expect(radioArr[1].getAttribute('checked')).toEqual(null);
  });

  it('should make checked', () => {
    let radioArr: any[] = [].slice.call(rg.querySelectorAll('ids-radio'));
    expect(radioArr[0].getAttribute('checked')).toEqual(null);
    expect(radioArr[1].getAttribute('checked')).toEqual(null);
    rg.makeChecked(radioArr[0], true);
    radioArr = [].slice.call(rg.querySelectorAll('ids-radio'));
    expect(radioArr[0].getAttribute('checked')).toEqual('true');
    expect(radioArr[1].getAttribute('checked')).toEqual(null);
    radioArr[0].value = null;
    radioArr[1].value = null;
    rg.makeChecked(radioArr[0]);
    expect(radioArr[0].getAttribute('checked')).toEqual('true');
    expect(radioArr[1].getAttribute('checked')).toEqual(null);
  });

  it('should rander display horizontal', () => {
    let rootEl = rg.shadowRoot.querySelector('.ids-radio-group');
    expect(rootEl.classList).not.toContain('horizontal');
    expect(rg.getAttribute('horizontal')).toEqual(null);
    rg.horizontal = true;
    rootEl = rg.shadowRoot.querySelector('.ids-radio-group');
    expect(rootEl.classList).toContain('horizontal');
    expect(rg.getAttribute('horizontal')).toEqual('true');
    rg.horizontal = false;
    rootEl = rg.shadowRoot.querySelector('.ids-radio-group');
    expect(rootEl.classList).not.toContain('horizontal');
    expect(rg.getAttribute('horizontal')).toEqual(null);
    expect(rg.horizontal).toEqual(false);
  });

  it('should trigger change event', () => {
    const radio = rg.querySelector('ids-radio');
    const evt = 'change';
    let response = null;
    rg.addEventListener(evt, () => {
      response = 'triggered';
    });
    const event = new Event(evt);
    radio.input.dispatchEvent(event);
    expect(response).toEqual('triggered');
  });

  it('should trigger key events', () => {
    const radioArr = [].slice.call(rg.querySelectorAll('ids-radio'));
    const allow = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Space'];
    const keys = [...allow, 'DummyKey'];
    let response = null;
    rg.addEventListener('change', () => {
      response = 'triggered';
    });
    radioArr.forEach((radio: any) => {
      keys.forEach((key: string) => {
        const result = allow.indexOf(key) > -1 ? 'triggered' : null;
        const event = new KeyboardEvent('keydown', { code: key });
        response = null;
        radio.dispatchEvent(event);
        expect(response).toEqual(result);
      });
    });
  });

  it('should render template', () => {
    document.body.innerHTML = '';
    const html = '<ids-radio-group label="test" value="test-val" disabled="true" horizontal="true"></ids-radio-group>';
    document.body.innerHTML = html;
    rg = document.querySelector('ids-radio-group');
    rg.template();
    expect(rg.getAttribute('disabled')).toEqual('true');
    const rootEl = rg.shadowRoot.querySelector('.ids-radio-group');
    expect(rootEl.classList).toContain('disabled');
    expect(rootEl.classList).toContain('horizontal');
    expect(rg.getAttribute('horizontal')).toEqual('true');
  });

  it('can change language from the container', async () => {
    await IdsGlobal.getLocale().setLanguage('de');
    expect(rg.getAttribute('language')).toEqual('de');
  });
});
