/**
 * @jest-environment jsdom
 */
import wait from '../helpers/wait';
import IdsContainer from '../../src/components/ids-container/ids-container';
import IdsToast from '../../src/components/ids-toast/ids-toast';
import IdsToastMessage from '../../src/components/ids-toast/ids-toast-message';
import {
  DEFAULTS,
  id,
  EVENTS
} from '../../src/components/ids-toast/ids-toast-shared';
import { messages as arMessages } from '../../src/components/ids-locale/data/ar-messages';
import IdsGlobal from '../../src/components/ids-global/ids-global';

describe('IdsToast Component', () => {
  const origInnerWidth = window.innerWidth;
  const origInnerHeight = window.innerHeight;
  let toast: IdsToast;
  let container: IdsContainer;
  let options: any;

  beforeEach(async () => {
    container = new IdsContainer();
    IdsGlobal.getLocale().loadedLanguages.set('ar', arMessages);

    toast = new IdsToast();
    container.appendChild(toast);
    document.body.appendChild(container);
    options = {
      title: 'Test',
      message: 'Some test text',
      timeout: 10
    };
  });

  afterEach(async () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: origInnerWidth, writable: true });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: origInnerHeight, writable: true });

    document.body.innerHTML = '';
    options = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem: any = new IdsToast();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-toast').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders using document.createElement with no errors (append late)', () => {
    const errors = jest.spyOn(global.console, 'error');
    const toastElem: any = document.createElement('ids-toast');

    toastElem.position = 'bottom-end';
    toastElem.allowLink = true;
    toastElem.audible = true;
    toastElem.draggable = true;
    toastElem.timeout = 2000;

    document.body.appendChild(toastElem);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(toast.outerHTML).toMatchSnapshot();
    options.messageId = 'test-message-id';
    toast.show(options);
    const messageElem = toast.messageElem(options.messageId);
    expect(messageElem?.outerHTML).toMatchSnapshot();
  });

  it('should set to put links in the toast message', () => {
    expect(toast.getAttribute('allow-link')).toEqual(null);
    expect(toast.allowLink).toEqual(DEFAULTS.allowLink);
    toast.allowLink = true;
    expect(toast.getAttribute('allow-link')).toEqual('');
    expect(toast.allowLink).toEqual(true);
    toast.allowLink = false;
    expect(toast.getAttribute('allow-link')).toEqual(null);
    expect(toast.allowLink).toEqual(false);
    toast.allowLink = null;
    expect(toast.getAttribute('allow-link')).toEqual(null);
    expect(toast.allowLink).toEqual(DEFAULTS.allowLink);
  });

  it('should set audible to toast message', () => {
    expect(toast.getAttribute('audible')).toEqual(null);
    expect(toast.audible).toEqual(DEFAULTS.audible);
    toast.audible = true;
    expect(toast.getAttribute('audible')).toEqual('');
    expect(toast.audible).toEqual(true);
    toast.audible = false;
    expect(toast.getAttribute('audible')).toEqual(null);
    expect(toast.audible).toEqual(false);
    toast.audible = null;
    expect(toast.getAttribute('audible')).toEqual(null);
    expect(toast.audible).toEqual(DEFAULTS.audible);
  });

  it('should set to allows drag/drop the toast', () => {
    expect(toast.getAttribute('draggable')).toEqual(null);
    expect(toast.draggable).toEqual(DEFAULTS.draggable);
    toast.draggable = true;
    expect(toast.getAttribute('draggable')).toEqual('');
    expect(toast.draggable).toEqual(true);
    toast.draggable = false;
    expect(toast.getAttribute('draggable')).toEqual(null);
    expect(toast.draggable).toEqual(false);
    toast.draggable = null;
    expect(toast.getAttribute('draggable')).toEqual(null);
    expect(toast.draggable).toEqual(DEFAULTS.draggable);
  });

  it('should set position of the toast container in specific place', () => {
    let toastContainer = toast.toastContainer();

    expect(toast.getAttribute('position')).toEqual(null);
    expect(toast.position).toEqual(DEFAULTS.position);
    expect(toastContainer.classList.contains(DEFAULTS.position)).toEqual(true);

    const values = ['bottom-end', 'bottom-start', 'top-end', 'top-start'];
    values.forEach((v) => {
      toast.position = v;
      toastContainer = toast.toastContainer();

      expect(toast.getAttribute('position')).toEqual(v);
      expect(toast.position).toEqual(v);
      expect(toastContainer.classList.contains(v)).toEqual(true);
    });

    toast.position = 'xyz';
    toastContainer = toast.toastContainer();

    expect(toast.getAttribute('position')).toEqual(null);
    expect(toast.position).toEqual(DEFAULTS.position);
    expect(toastContainer.classList.contains(DEFAULTS.position)).toEqual(true);
  });

  it('should set toast to progress bar', () => {
    expect(toast.getAttribute('progress-bar')).toEqual(null);
    expect(toast.progressBar).toEqual(DEFAULTS.progressBar);
    toast.progressBar = true;
    expect(toast.getAttribute('progress-bar')).toEqual('true');
    expect(toast.progressBar).toEqual(true);
    toast.progressBar = false;
    expect(toast.getAttribute('progress-bar')).toEqual('false');
    expect(toast.progressBar).toEqual(false);
    toast.progressBar = null;
    expect(toast.getAttribute('progress-bar')).toEqual(null);
    expect(toast.progressBar).toEqual(DEFAULTS.progressBar);
  });

  it('should set toast container to save position', () => {
    expect(toast.getAttribute('save-position')).toEqual(null);
    expect(toast.savePosition).toEqual(DEFAULTS.savePosition);
    toast.savePosition = true;
    expect(toast.getAttribute('save-position')).toEqual('true');
    expect(toast.savePosition).toEqual(true);
    toast.savePosition = false;
    expect(toast.getAttribute('save-position')).toEqual('false');
    expect(toast.savePosition).toEqual(false);
    toast.savePosition = null;
    expect(toast.getAttribute('save-position')).toEqual(null);
    expect(toast.savePosition).toEqual(DEFAULTS.savePosition);
  });

  it('should set toast timeout', () => {
    expect(toast.getAttribute('timeout')).toEqual(null);
    expect(toast.timeout).toEqual(DEFAULTS.timeout);
    toast.timeout = 2000;
    expect(toast.getAttribute('timeout')).toEqual('2000');
    expect(toast.timeout).toEqual('2000');
    toast.timeout = false;
    expect(toast.getAttribute('timeout')).toEqual(null);
    expect(toast.timeout).toEqual(DEFAULTS.timeout);
  });

  it('should set toast uniqueId', () => {
    const uniqueId = 'some-uniqueid';
    expect(toast.getAttribute('unique-id')).toEqual(null);
    expect(toast.uniqueId).toEqual(DEFAULTS.uniqueId);
    toast.uniqueId = uniqueId;
    expect(toast.getAttribute('unique-id')).toEqual(uniqueId);
    expect(toast.uniqueId).toEqual(uniqueId);
    toast.uniqueId = '';
    expect(toast.getAttribute('unique-id')).toEqual(null);
    expect(toast.uniqueId).toEqual(DEFAULTS.uniqueId);
  });

  it('should set to destroy after complete all the toasts', () => {
    expect(toast.getAttribute('destroy-on-complete')).toEqual(null);
    expect(toast.destroyOnComplete).toEqual(DEFAULTS.destroyOnComplete);
    toast.destroyOnComplete = true;
    expect(toast.getAttribute('destroy-on-complete')).toEqual('true');
    expect(toast.destroyOnComplete).toEqual(true);
    toast.destroyOnComplete = false;
    expect(toast.getAttribute('destroy-on-complete')).toEqual('false');
    expect(toast.destroyOnComplete).toEqual(false);
    toast.destroyOnComplete = null;
    expect(toast.getAttribute('destroy-on-complete')).toEqual(null);
    expect(toast.destroyOnComplete).toEqual(DEFAULTS.destroyOnComplete);
  });

  it('should set toast message', () => {
    options = {
      ...options,
      allowLink: true,
      closeButtonLabel: 'Test close text'
    };
    toast.show();
    toast.position = 'bottom-end';
    toast.show(options);
    toast.draggable = true;
    delete options.closeButtonLabel;
    delete options.allowLink;
    delete options.timeout;
    toast.show(options);
    toast.audible = true;
    toast.show(options);
    const toastContainer = toast.toastContainer();
    const messageEl = toastContainer.querySelector('ids-toast-message');

    expect(messageEl).toBeTruthy();
  });

  it('should check if can save position to local storage', async () => {
    const uniqueId = 'some-uniqueid';
    const transform = 'translate(100px, 250px)';

    toast.ls = {}; // set empty localStorage
    toast.uniqueId = uniqueId;
    toast.savePosition = true;
    toast.draggable = true;
    toast.show(options);
    let toastContainer = toast.toastContainer();
    let messageEl = toastContainer.querySelector<IdsToastMessage>('ids-toast-message');

    expect(messageEl).toBeTruthy();
    expect(toastContainer.style.transform).toEqual('');
    toastContainer.style.transform = transform;

    expect(toastContainer.style.transform).toEqual(transform);
    messageEl?.removeToastMessage();
    await wait(100);
    toastContainer = toast.toastContainer();
    messageEl = toastContainer.querySelector('ids-toast-message');

    expect(messageEl).toBeFalsy();
    expect(localStorage.getItem(id(uniqueId))).toEqual(null);
    toast.clearPosition();
    toast.clearPositionAll();

    expect(localStorage.getItem(id(uniqueId))).toEqual(null);
  });

  it('should saved position to local storage', async () => {
    const uniqueId = 'some-uniqueid';
    const transform = 'translate(100px, 250px)';

    toast.uniqueId = uniqueId;
    toast.savePosition = true;
    toast.draggable = true;
    toast.show(options);
    let toastContainer = toast.toastContainer();
    let messageEl = toastContainer.querySelector<IdsToastMessage>('ids-toast-message');

    expect(messageEl).toBeTruthy();
    expect(toastContainer.style.transform).toEqual('');
    toastContainer.style.transform = transform;

    expect(toastContainer.style.transform).toEqual(transform);
    messageEl?.removeToastMessage();
    await wait(100);
    toastContainer = toast.toastContainer();
    messageEl = toastContainer.querySelector('ids-toast-message');

    expect(messageEl).toBeFalsy();
    expect(localStorage.getItem(id(uniqueId))).toEqual(transform);
    toast.clearPosition(uniqueId);

    expect(localStorage.getItem(id(uniqueId))).toEqual(null);
  });

  it('should restore saved position', () => {
    const uniqueId = 'some-uniqueid';
    const transform = 'translate(100px, 250px)';
    localStorage.setItem(id(uniqueId), transform);

    toast.uniqueId = uniqueId;
    toast.savePosition = true;
    toast.draggable = true;
    toast.show(options);
    const toastContainer = toast.toastContainer();
    const messageEl = toastContainer.querySelector('ids-toast-message');

    expect(messageEl).toBeTruthy();
    expect(toastContainer.style.transform).toEqual(transform);
    toast.clearPosition(uniqueId);
  });

  it('should reset saved position', () => {
    const uniqueId = 'some-uniqueid';
    const transform = 'translate(-9999px, -9999px)';
    localStorage.setItem(id(uniqueId), transform);

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: null, writable: true });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: null, writable: true });

    toast.uniqueId = uniqueId;
    toast.savePosition = true;
    toast.draggable = true;
    toast.show(options);
    const toastContainer = toast.toastContainer();
    const messageEl = toastContainer.querySelector('ids-toast-message');

    expect(messageEl).toBeTruthy();
    expect(toastContainer.style.transform).toEqual(transform);
    toast.clearPosition(uniqueId);
  });

  it('should clear saved position', () => {
    const uniqueId = 'some-uniqueid';
    const transform = 'translate(100px, 250px)';
    localStorage.setItem(id(uniqueId), transform);
    toast.clearPosition('aaa');

    expect(localStorage.getItem(id(uniqueId))).toEqual(transform);
    toast.clearPosition(uniqueId);

    expect(localStorage.getItem(id(uniqueId))).toEqual(null);
    localStorage.setItem(id('test0'), 'test-0-value');

    expect(localStorage.getItem(id('test0'))).toEqual('test-0-value');
    toast.uniqueId = 'test0';
    toast.clearPosition();

    expect(localStorage.getItem(id('test0'))).toEqual(null);
    localStorage.setItem(id('test1'), 'test-1-value');
    localStorage.setItem(id('test2'), 'test-2-value');
    localStorage.setItem(id('test3'), 'test-3-value');
    localStorage.setItem('testaaa', 'test-aaa-value');

    expect(localStorage.getItem(id('test1'))).toEqual('test-1-value');
    expect(localStorage.getItem(id('test2'))).toEqual('test-2-value');
    expect(localStorage.getItem(id('test3'))).toEqual('test-3-value');
    toast.clearPositionAll();

    expect(localStorage.getItem(id('test1'))).toEqual(null);
    expect(localStorage.getItem(id('test2'))).toEqual(null);
    expect(localStorage.getItem(id('test3'))).toEqual(null);
    expect(localStorage.getItem('testaaa')).toEqual('test-aaa-value');
    localStorage.removeItem('testaaa');

    expect(localStorage.getItem('testaaa')).toEqual(null);
  });

  it('should fire toast events', async () => {
    const uniqueId = 'some-uniqueid';
    const transform = 'translate(100px, 250px)';

    const detail = {
      active: {
        addMessage: null,
        removeMessage: null,
        savePosition: null,
        clearPosition: null
      },
      before: {
        addMessage: null,
        removeMessage: null,
        savePosition: null,
        clearPosition: null
      },
      after: {
        addMessage: 'ids-toast-container-some-uniqueid-message-0',
        removeMessage: 'ids-toast-container-some-uniqueid-message-0',
        savePosition: 'some-uniqueid',
        clearPosition: 'some-uniqueid'
      }
    };

    toast.addEventListener(EVENTS.addMessage, (e: any) => {
      detail.active.addMessage = e.detail?.messageId;
    });
    toast.addEventListener(EVENTS.removeMessage, (e: any) => {
      detail.active.removeMessage = e.detail?.messageId;
    });
    toast.addEventListener(EVENTS.savePosition, (e: any) => {
      detail.active.savePosition = e.detail?.uniqueId;
    });
    toast.addEventListener(EVENTS.clearPosition, (e: any) => {
      detail.active.clearPosition = e.detail?.clearIds[0];
    });

    expect(detail.active.addMessage).toEqual(detail.before.addMessage);
    expect(detail.active.removeMessage).toEqual(detail.before.removeMessage);
    expect(detail.active.savePosition).toEqual(detail.before.savePosition);
    expect(detail.active.clearPosition).toEqual(detail.before.clearPosition);

    toast.uniqueId = uniqueId;
    toast.savePosition = true;
    toast.draggable = true;
    toast.show(options);
    let toastContainer = toast.toastContainer();
    let messageEl = toastContainer.querySelector<IdsToastMessage>('ids-toast-message');

    expect(messageEl).toBeTruthy();

    expect(detail.active.addMessage).toEqual(detail.after.addMessage);
    expect(detail.active.removeMessage).toEqual(detail.before.removeMessage);
    expect(detail.active.savePosition).toEqual(detail.before.savePosition);
    expect(detail.active.clearPosition).toEqual(detail.before.clearPosition);

    expect(toastContainer.style.transform).toEqual('');
    toastContainer.style.transform = transform;

    expect(toastContainer.style.transform).toEqual(transform);
    messageEl?.removeToastMessage();
    await wait(100);
    toastContainer = toast.toastContainer();
    messageEl = toastContainer.querySelector('ids-toast-message');

    await wait(100);
    expect(messageEl).toBeFalsy();

    expect(detail.active.addMessage).toEqual(detail.after.addMessage);
    expect(detail.active.removeMessage).toEqual(detail.after.removeMessage);
    expect(detail.active.savePosition).toEqual(detail.after.savePosition);
    expect(detail.active.clearPosition).toEqual(detail.before.clearPosition);

    expect(localStorage.getItem(id(uniqueId))).toEqual(transform);
    toast.clearPosition(uniqueId);

    expect(localStorage.getItem(id(uniqueId))).toEqual(null);

    expect(detail.active.addMessage).toEqual(detail.after.addMessage);
    expect(detail.active.removeMessage).toEqual(detail.after.removeMessage);
    expect(detail.active.savePosition).toEqual(detail.after.savePosition);
    expect(detail.active.clearPosition).toEqual(detail.after.clearPosition);
  });

  it('should update with container language change', async () => {
    await container.localeAPI.setLanguage('ar');
    expect(toast.getAttribute('dir')).toEqual('rtl');
  });

  it('should remove toast host element', async () => {
    toast.destroyOnComplete = false;
    toast.show(options);
    let toastContainer = toast.toastContainer();
    let messageEl = toastContainer.querySelector<IdsToastMessage>('ids-toast-message');

    expect(messageEl).toBeTruthy();
    messageEl?.removeToastMessage();
    await wait(100);
    toastContainer = toast.toastContainer();
    messageEl = toastContainer.querySelector('ids-toast-message');
    await wait(100);

    expect(messageEl).toBeFalsy();

    toast.position = 'top-start';
    toast.savePosition = true;
    toast.draggable = true;
    toast.destroyOnComplete = true;
    toast.show(options);
    toastContainer = toast.toastContainer();
    messageEl = toastContainer.querySelector('ids-toast-message');

    expect(messageEl).toBeTruthy();
    messageEl?.removeToastMessage();
    await wait(100);
    toastContainer = toast.toastContainer();
    messageEl = toastContainer.querySelector('ids-toast-message');

    expect(messageEl).toBeFalsy();
  });

  it('should not destroy on complete toast', async () => {
    toast.destroyOnComplete = false;
    toast.show(options);
    const toastContainer = toast.toastContainer();
    const messageEl = toastContainer.querySelector<IdsToastMessage>('ids-toast-message');

    expect(messageEl).toBeTruthy();
    messageEl?.removeToastMessage();
    await wait(100);

    expect(toast.shadowRoot?.querySelector('.toast-container')).toBeFalsy();
    expect(toast.shadowRoot?.querySelector('ids-toast-message')).toBeFalsy();
  });

  it('should close with click (x) button toast message', async () => {
    toast.show(options);
    let toastContainer = toast.toastContainer();
    let messageEl = toastContainer.querySelector('ids-toast-message');
    const closeButton = messageEl?.shadowRoot?.querySelector('.close-button');

    expect(messageEl).toBeTruthy();
    expect(closeButton).toBeTruthy();
    const event = new Event('click', { bubbles: true });
    closeButton?.dispatchEvent(event);
    await wait(100);
    toastContainer = toast.toastContainer();
    messageEl = toastContainer.querySelector('ids-toast-message');

    expect(messageEl).toBeFalsy();
  });

  it('should handle pause/play by key events toast message', async () => {
    toast.show(options);
    let toastContainer = toast.toastContainer();
    let messageEl = toastContainer.querySelector('ids-toast-message');

    expect(messageEl).toBeTruthy();
    let event = new KeyboardEvent('keydown', { keyCode: 80, ctrlKey: true, altKey: true });
    document.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { keyCode: 27 });
    document.dispatchEvent(event);
    await wait(100);
    toastContainer = toast.toastContainer();
    messageEl = toastContainer.querySelector('ids-toast-message');

    expect(messageEl).toBeFalsy();
  });

  it('should handle pause/play by mouse events toast message', async () => {
    toast.show(options);
    let toastContainer = toast.toastContainer();
    let messageEl = toastContainer.querySelector<IdsToastMessage>('ids-toast-message');

    expect(messageEl).toBeTruthy();
    let event = new Event('mousedown', { bubbles: true });
    messageEl?.container?.dispatchEvent(event);

    event = new Event('mouseup', { bubbles: true });
    messageEl?.container?.dispatchEvent(event);

    messageEl?.setAttribute('audible', 'true');
    messageEl?.removeToastMessage();
    await wait(100);
    toastContainer = toast.toastContainer();
    messageEl = toastContainer.querySelector('ids-toast-message');

    expect(messageEl).toBeFalsy();
  });

  it('should handle toast message progress bar', async () => {
    toast.destroyOnComplete = false;

    options.progressBar = true;
    toast.show(options);
    let toastContainer = toast.toastContainer();
    let messageEl = toastContainer.querySelector<IdsToastMessage>('ids-toast-message');

    expect(messageEl).toBeTruthy();
    messageEl?.removeToastMessage();
    await wait(100);
    toastContainer = toast.toastContainer();
    messageEl = toastContainer.querySelector('ids-toast-message');

    expect(messageEl).toBeFalsy();
    options.progressBar = false;
    toast.show(options);
    toastContainer = toast.toastContainer();
    messageEl = toastContainer.querySelector<IdsToastMessage>('ids-toast-message');

    expect(messageEl).toBeTruthy();
    messageEl?.removeToastMessage();
    await wait(100);
    toastContainer = toast.toastContainer();
    messageEl = toastContainer.querySelector('ids-toast-message');

    expect(messageEl).toBeFalsy();
    options.progressBar = true;
    toast.destroyOnComplete = true;
    toast.show(options);
    toastContainer = toast.toastContainer();
    messageEl = toastContainer.querySelector<IdsToastMessage>('ids-toast-message');

    expect(messageEl).toBeTruthy();
    await wait(5);
    const progressBar = messageEl?.shadowRoot?.querySelector('.progress-bar');
    expect(progressBar).toBeTruthy();
    messageEl?.setAttribute('progress-bar', 'false');
    messageEl?.removeToastMessage();
    await wait(100);
    toastContainer = toast.toastContainer();
    messageEl = toastContainer.querySelector('ids-toast-message');

    expect(messageEl).toBeFalsy();
  });

  it('renders toast-message with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem: any = new IdsToast();
    const messageEl1: any = new IdsToastMessage();
    const messageEl2: any = new IdsToastMessage();
    messageEl1.audible = null;
    messageEl1.draggable = null;
    messageEl1.progressBar = null;
    messageEl1.timeout = null;
    messageEl1.messageId = null;
    messageEl1.timer = { destroy: () => {} };

    messageEl2.audible = true;
    messageEl2.draggable = true;
    messageEl2.progressBar = true;
    messageEl2.timeout = 10;
    messageEl2.messageId = 'test-id';

    document.body.appendChild(elem);

    const toastContainer = elem.toastContainer();
    toastContainer.appendChild(messageEl1);
    toastContainer.appendChild(messageEl2);

    expect(messageEl2.draggable).toEqual(true);

    elem.remove();
    expect(document.querySelectorAll('ids-toast').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('should call toast-message template', () => {
    const messageEl = new IdsToastMessage();
    messageEl.progressBar = false;
    messageEl.audible = false;
    messageEl.template();
    expect(messageEl.progressBar).toEqual(false);
    expect(messageEl.audible).toEqual(false);
  });
});
