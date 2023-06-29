/**
 * @jest-environment jsdom
 */
import IdsBadge from '../../src/components/ids-badge/ids-badge';
import '../../src/components/ids-icon/ids-icon';

describe('IdsBadge Component', () => {
  let badge: any;

  beforeEach(async () => {
    const elem: any = new IdsBadge();
    document.body.appendChild(elem);
    badge = document.querySelector('ids-badge');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem: any = new IdsBadge();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-badge').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(badge.outerHTML).toMatchSnapshot();
    badge.color = 'error';
    expect(badge.outerHTML).toMatchSnapshot();
    badge.color = 'alert';
    badge.shape = 'round';
    expect(badge.outerHTML).toMatchSnapshot();
  });

  it('renders alert color and round shape of badge', () => {
    badge.color = 'alert';
    expect(badge.getAttribute('color')).toEqual('alert');
    expect(badge.color).toEqual('alert');
    badge.shape = 'round';
    expect(badge.getAttribute('shape')).toEqual('round');
    expect(badge.shape).toEqual('round');
  });

  it('renders error color of badge', () => {
    badge.color = 'error';
    expect(badge.getAttribute('color')).toEqual('error');
    expect(badge.color).toEqual('error');
  });

  it('renders info color of badge', () => {
    badge.color = 'info';
    expect(badge.getAttribute('color')).toEqual('info');
    expect(badge.color).toEqual('info');
  });

  it('renders warning color and round shape of badge', () => {
    badge.color = 'warning';
    expect(badge.getAttribute('color')).toEqual('warning');
    expect(badge.color).toEqual('warning');
    badge.shape = 'round';
    expect(badge.getAttribute('shape')).toEqual('round');
    expect(badge.shape).toEqual('round');
  });

  it('renders success color of badge', () => {
    badge.color = 'success';
    expect(badge.getAttribute('color')).toEqual('success');
    expect(badge.color).toEqual('success');
  });

  it('renders badge with normal icon', () => {
    badge.color = 'alert';
    expect(badge.getAttribute('color')).toBe('alert');
    expect(badge.color).toBe('alert');
  });

  it('removes the color and attribute', () => {
    badge.color = 'alert';
    expect(badge.getAttribute('color')).toEqual('alert');
    expect(badge.color).toEqual('alert');

    badge.removeAttribute('color');
    expect(badge.getAttribute('color')).toEqual(null);
    expect(badge.color).toEqual(null);
  });

  it('removes the shape attribute', () => {
    badge.shape = 'round';
    expect(badge.getAttribute('shape')).toEqual('round');
    expect(badge.shape).toEqual('round');

    badge.removeAttribute('shape');
    expect(badge.getAttribute('shape')).toEqual(null);
    expect(badge.shape).toEqual('normal');
  });

  it('should be able to set attributes before append', async () => {
    const elem: any = new IdsBadge();
    elem.color = 'error';
    elem.shape = 'round';
    document.body.appendChild(elem);

    expect(elem.container.getAttribute('color')).toEqual('error');
    expect(elem.container.classList.contains('round')).toBeTruthy();
  });

  it('should be able to set attributes after append', async () => {
    const elem: any = new IdsBadge();
    document.body.appendChild(elem);
    elem.color = 'error';
    elem.shape = 'round';

    expect(elem.container.classList.contains('round')).toBeTruthy();
    expect(elem.container.getAttribute('color')).toEqual('error');
  });

  it('should be able to set disabled', async () => {
    expect(badge.getAttribute('disabled')).toEqual(null);
    expect(badge.disabled).toEqual(false);
    badge.disabled = true;
    expect(badge.getAttribute('disabled')).toEqual('');
    expect(badge.disabled).toEqual(true);
    badge.disabled = false;
    expect(badge.getAttribute('disabled')).toEqual(null);
    expect(badge.disabled).toEqual(false);
  });
});
