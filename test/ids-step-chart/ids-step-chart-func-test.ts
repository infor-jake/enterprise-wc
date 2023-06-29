/**
 * @jest-environment jsdom
 */
import IdsStepChart from '../../src/components/ids-step-chart/ids-step-chart';
import '../../src/components/ids-text/ids-text';

describe('Ids Step Chart Tests', () => {
  let elem: any;

  const createElemViaTemplate = async (innerHTML: string) => {
    elem?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    elem = template.content.childNodes[0];
    document.body.appendChild(elem);

    return elem;
  };

  beforeEach(async () => {
    elem = await createElemViaTemplate(
      `<ids-step-chart label="2 of 7 steps completed" color="azure08" step-number="7" value="3" completed-label="5 days overdue" progress-color="ruby03"></ids-step-chart>`
    );
    elem.stepsInProgress = ['3'];
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    elem = new IdsStepChart();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-step-chart').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    elem.shadowRoot.querySelector('style').remove();
    expect(elem.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('generates the correct number of steps', () => {
    expect(elem.shadowRoot.querySelectorAll('.step').length).toEqual(7);
  });

  it('generates the correct number of completed steps', () => {
    expect(elem.shadowRoot.querySelectorAll('.complete').length).toEqual(2);
    elem.value = '5';
    expect(elem.getAttribute('value')).toBe('5');
    expect(elem.shadowRoot.querySelectorAll('.complete').length).toEqual(4);
  });

  it('correctly marks steps as in progress', () => {
    expect(elem.shadowRoot.querySelectorAll('.in-progress').length).toEqual(1);
    expect(elem.shadowRoot.querySelector('.step.in-progress:nth-child(3)')).toBeTruthy();
  });

  it('color is set correctly', () => {
    expect(elem.shadowRoot.querySelector('.in-progress').getAttribute('color')).toBe('ruby03');
    elem.progressColor = 'turquoise06';
    expect(elem.shadowRoot.querySelector('.in-progress').getAttribute('color')).toBe('turquoise06');

    expect(elem.shadowRoot.querySelector('.complete').getAttribute('color')).toBe('azure08');
    elem.color = 'amethyst05';
    expect(elem.shadowRoot.querySelector('.complete').getAttribute('color')).toBe('amethyst05');
  });

  it('can steps in progress be updated', () => {
    elem.stepsInProgress = ['3', '5', '7'];
    expect(elem.shadowRoot.querySelectorAll('.in-progress').length).toBe(3);
    expect(elem.stepsInProgress).toEqual([3, 5, 7]);
  });

  it('completed label can be updated', () => {
    expect(elem.shadowRoot.querySelector('.completed-label').innerHTML).toBe('5 days overdue');
    elem.completedLabel = 'Test change';
    expect(elem.getAttribute('completed-label')).toBe('Test change');
    expect(elem.shadowRoot.querySelector('.completed-label').innerHTML).toBe('Test change');
  });

  it('label can be updated', () => {
    expect(elem.shadowRoot.querySelector('.label').innerHTML).toBe('2 of 7 steps completed');
    elem.label = 'Test Label';
    expect(elem.getAttribute('label')).toBe('Test Label');
    expect(elem.shadowRoot.querySelector('.label').innerHTML).toBe('Test Label');
  });

  it('update the steps', () => {
    expect(elem.shadowRoot.querySelectorAll('.step').length).toBe(7);
    elem.stepNumber = '10';
    expect(elem.getAttribute('step-number')).toBe('10');
    expect(elem.shadowRoot.querySelectorAll('.step').length).toBe(10);
  });

  it('should be able to set disabled', async () => {
    expect(elem.getAttribute('disabled')).toEqual(null);
    expect(elem.disabled).toEqual(false);
    elem.disabled = true;
    expect(elem.getAttribute('disabled')).toEqual('');
    expect(elem.disabled).toEqual(true);
    elem.disabled = false;
    expect(elem.getAttribute('disabled')).toEqual(null);
    expect(elem.disabled).toEqual(false);
  });
});
