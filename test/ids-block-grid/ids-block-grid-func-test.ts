/**
 * @jest-environment jsdom
 */
import IdsBlockgrid from '../../src/components/ids-block-grid/ids-block-grid';
import IdsBlockgridItem from '../../src/components/ids-block-grid/ids-block-grid-item';
import '../../src/components/ids-checkbox/ids-checkbox';
import '../helpers/resize-observer-mock';
import type IdsCheckbox from '../../src/components/ids-checkbox/ids-checkbox';

describe('IdsBlockgrid Component', () => {
  let blockgridEl: any;

  beforeEach(async () => {
    const blockgrid: any = new IdsBlockgrid();
    const blockgridItem: any = new IdsBlockgridItem();

    document.body.appendChild(blockgrid);
    blockgrid.appendChild(blockgridItem);
    blockgridEl = document.querySelector('ids-block-grid');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    let elem: any = new IdsBlockgrid();
    document.body.appendChild(elem);
    elem.remove();

    elem = new IdsBlockgridItem();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-block-grid').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    blockgridEl.align = 'left';
    expect(blockgridEl.outerHTML).toMatchSnapshot();
    blockgridEl.align = 'center';
    expect(blockgridEl.outerHTML).toMatchSnapshot();
    blockgridEl.align = 'right';
    expect(blockgridEl.outerHTML).toMatchSnapshot();
  });

  it('renders align setting', () => {
    blockgridEl.align = 'center';
    expect(blockgridEl.align).toEqual('center');
    expect(blockgridEl.getAttribute('align')).toEqual('center');
  });

  it('renders blockgrid left correctly then removes it', () => {
    const elem: any = new IdsBlockgrid();
    document.body.appendChild(elem);
    elem.align = 'center';
    expect(elem.align).toEqual('center');
    expect(elem.getAttribute('align')).toEqual('center');
    expect(elem.style.textAlign).toEqual('center');

    elem.removeAttribute('align');
    expect(elem.getAttribute('align')).toEqual(null);
    expect(elem.style.textAlign).toEqual('');
  });
});

describe('IdsBlockgridItem Component', () => {
  let blockgridEl: any;
  let blockgridItemEl: any;

  beforeEach(async () => {
    const blockgrid: any = new IdsBlockgrid();
    const blockgridItem: any = new IdsBlockgridItem();

    document.body.appendChild(blockgrid);

    blockgridItem.innerHTML = `
  <img src="../assets/images/placeholder-200x200.png" alt="Placeholder 200x200" />
  <ids-text type="p">
    Sheena Taylor<br/>
    Infor, Developer
  </ids-text>
`;
    blockgrid.appendChild(blockgridItem);

    blockgridEl = document.querySelector('ids-block-grid');
    blockgridItemEl = document.querySelector('ids-block-grid-item');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem: any = new IdsBlockgridItem();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-block-grid-item').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(blockgridItemEl.outerHTML).toMatchSnapshot();
  });

  it('support block grid selection single', () => {
    const clickEvent = new MouseEvent('click');
    blockgridItemEl.selection = 'single';

    blockgridItemEl.dispatchEvent(clickEvent);
    expect(blockgridItemEl.selected).toBe(true);
  });

  it('supports block grid multiple selection', () => {
    const blockgridItemEl2 = new IdsBlockgridItem();
    blockgridEl.appendChild(blockgridItemEl2);
    blockgridItemEl2.selection = 'multiple';

    const clickEvent = new MouseEvent('click', { bubbles: true });
    blockgridItemEl.selection = 'multiple';

    const checkboxEl = blockgridItemEl.shadowRoot.querySelector('ids-checkbox');
    const checkboxEl2 = blockgridItemEl2.shadowRoot?.querySelector<IdsCheckbox>('ids-checkbox');

    blockgridItemEl.dispatchEvent(clickEvent);
    expect(checkboxEl.checked).toBeTruthy();
    expect(checkboxEl2?.checked).toBeFalsy();

    blockgridItemEl2.dispatchEvent(clickEvent);
    expect(checkboxEl.checked).toBeTruthy();
    expect(checkboxEl2?.checked).toBeTruthy();
  });

  it('support block grid selection multiple keyboard', () => {
    const blockgridItemEl2 = new IdsBlockgridItem();
    blockgridEl.appendChild(blockgridItemEl2);
    blockgridItemEl2.selection = 'multiple';

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    blockgridItemEl.selection = 'multiple';

    blockgridItemEl.container.focus();
    blockgridItemEl.dispatchEvent(tabEvent);
    expect(document.activeElement).toEqual(blockgridItemEl2);

    blockgridItemEl2.dispatchEvent(spaceEvent);
    expect(blockgridItemEl.selected).not.toBe('true');
    expect(blockgridItemEl2.selected).toBe(true);
  });

  it('support block grid selection mixed 1', async () => {
    const blockgridItemEl2 = new IdsBlockgridItem({ selection: 'mixed' });
    blockgridItemEl2.selection = 'mixed';
    blockgridEl.appendChild(blockgridItemEl2);

    const clickEvent = new MouseEvent('click', { bubbles: true });

    blockgridItemEl2.dispatchEvent(clickEvent);
    expect(blockgridItemEl2.preselected).toBe('true');
    expect(blockgridItemEl2.selected).not.toBe('true');
  });

  it('support block grid selection mixed 2', async () => {
    const blockgridItemEl2 = new IdsBlockgridItem({ selection: 'mixed' });
    blockgridItemEl2.selection = 'mixed';
    blockgridEl.appendChild(blockgridItemEl2);
    const checkboxEl2 = blockgridItemEl2.shadowRoot?.querySelector('ids-checkbox');

    const clickEvent = new MouseEvent('click', { bubbles: true });
    checkboxEl2?.dispatchEvent(clickEvent);
    expect(blockgridItemEl2.selected).toBe(true);
  });

  it('should fire selectionchanged event', async () => {
    const mockCallback = jest.fn((x) => {
      expect(x.detail.elem).toEqual(blockgridItemEl);
      expect(x.detail.selected).toEqual(true);
      expect(x.detail.selection).toEqual('multiple');
    });

    const clickEvent = new MouseEvent('click', { bubbles: true });
    blockgridItemEl.selection = 'multiple';

    blockgridItemEl.addEventListener('selectionchanged', mockCallback);
    blockgridItemEl.dispatchEvent(clickEvent);

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it.skip('should support paging', async () => {
    const data = [
      {
        id: 1,
        url: '/assets/placeholder-200x200.png',
        name: 'Sheena Taylor1',
        title: 'Infor, Developer'
      },
      {
        id: 2,
        url: '/assets/placeholder-200x200.png',
        name: 'Sheena Taylor2',
        title: 'Infor, Developer'
      },
      {
        id: 3,
        url: '/assets/placeholder-200x200.png',
        name: 'Sheena Taylor3',
        title: 'Infor, Developer'
      },
      {
        id: 4,
        url: '/assets/placeholder-200x200.png',
        name: 'Sheena Taylor4',
        title: 'Infor, Developer'
      },
      {
        id: 5,
        url: '/assets/placeholder-200x200.png',
        name: 'Sheena Taylor5',
        title: 'Infor, Developer'
      },
      {
        id: 6,
        url: '/assets/placeholder-200x200.png',
        name: 'Sheena Taylor6',
        title: 'Infor, Developer'
      },
      {
        id: 7,
        url: '/assets/placeholder-200x200.png',
        name: 'Sheena Taylor7',
        title: 'Infor, Developer'
      },
      {
        id: 8,
        url: '/assets/placeholder-200x200.png',
        name: 'Sheena Taylor8',
        title: 'Infor, Developer'
      },
      {
        id: 9,
        url: '/assets/placeholder-200x200.png',
        name: 'Sheena Taylor9',
        title: 'Infor, Developer'
      },
      {
        id: 10,
        url: '/assets/placeholder-200x200.png',
        name: 'Sheena Taylor10',
        title: 'Infor, Developer'
      },
      {
        id: 11,
        url: '/assets/placeholder-200x200.png',
        name: 'Sheena Taylor11',
        title: 'Infor, Developer'
      }
    ];

    blockgridEl.align = 'center';
    blockgridEl.selection = 'multiple';
    blockgridEl.pagination = 'client-side';
    blockgridEl.pageNumber = 1;
    blockgridEl.pageSize = 5;
    blockgridEl.data = data;

    const pager = blockgridEl.shadowRoot.querySelector('ids-pager');
    expect(pager.pageNumber).toEqual(1);
    expect(pager.pageSize).toEqual(5);
    expect(pager.total).toEqual(11);
  });

  it('should not error if no data', async () => {
    expect(blockgridEl.data).toEqual([]);
    blockgridEl.data = null;
    expect(blockgridEl.data).toEqual([]);

    const pager = blockgridEl.shadowRoot.querySelector('ids-pager');
    expect(pager).toBeFalsy();
    blockgridEl.redraw();
    expect(pager).toBeFalsy();
  });
});
