import IdsTag from '../../../src/components/ids-tag/ids-tag';

describe('IdsTag functional tests', () => {
  const url = 'http://localhost:4444/ids-tag/example.html';
  let tag: IdsTag;

  beforeEach(() => {
    tag = new IdsTag();
    document.body.appendChild(tag);
    cy.visit(url);
  });

  // TODO? Is this an e2e test?
  describe('general component tests', () => {
    it('renders with no errors', () => {
      cy.document().then((doc: Document) => {
        const elem: any = new IdsTag();
        doc.body.appendChild(elem);
        elem.setAttribute('id', 'test');
      });

      cy.get('#test')
        .invoke('attr', 'color')
        .should('eq', undefined);
    });
  });

  describe('settings/attribute tests', () => {
    it('renders success color from an attribute', () => {
      tag.setAttribute('color', 'success');
      expect(tag.getAttribute('color')).to.equal('success');
      expect(tag.color).to.equal('success');
    });

    it('renders success color from an attribute', () => {
      tag.setAttribute('color', 'success');
      expect(tag.getAttribute('color')).to.equal('success');
      expect(tag.color).to.equal('success');
    });

    it('renders success color from the api', () => {
      tag.color = 'success';
      expect(tag.getAttribute('color')).to.equal('success');
      expect(tag.color).to.equal('success');
    });

    it('renders error from the api', () => {
      tag.color = 'error';
      expect(tag.getAttribute('color')).to.equal('error');
      expect(tag.color).to.equal('error');
    });

    it('removes attribute when setting color', () => {
      tag.color = 'red';
      tag.color = null;
      tag.color = '';
      expect(tag.getAttribute('color')).to.equal(null);
      expect(tag.color).to.equal(null);
    });

    it('can get clickable', () => {
      expect(tag.clickable).to.equal(false);
    });
  });

  describe('method tests', () => {
    it('should cancel dismiss when not dismissible', () => {
      tag.dismiss();
      expect(document.body.contains(tag)).to.equal(true);
    });
  });
});
