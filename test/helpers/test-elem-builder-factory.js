import processAnimFrame from './process-anim-frame';

/**
 * factorizes element refresh/creation boilerplate for usage
 * in Jest tests; helps to add coverage in template on
 * initial construction
 *
 * @returns {{
 *  createElemFromTemplate: function(string):HTMLElement,
 *  clearElement: function():void,
 *  element?: HTMLElement
 * }} factory instance that manages a shared HTML element
 */
export default function templateElemBuilderFactory() {
  let elem;

  const clearElement = async () => {
    elem?.remove?.();
    await processAnimFrame();
  };

  return {
    clearElement,
    createElemFromTemplate: async (innerHTML, parentEl) => {
      clearElement();
      const template = document.createElement('template');
      template.innerHTML = innerHTML;
      elem = template.content.childNodes[0];

      const container = parentEl || document.body;
      container.appendChild(elem);

      return elem;
    },
    get element() {
      return elem;
    }
  };
}
