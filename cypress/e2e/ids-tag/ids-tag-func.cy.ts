import IdsTag from '../../../src/components/ids-tag/ids-tag';

describe('IdsTag functional tests', () => {
  const url = 'http://localhost:4444/ids-tag/example.html';
  let tag: IdsTag;

  beforeEach(() => {
    cy.visit(url);
    cy.get('ids-tag').first().then((el) => {
      tag = el.get(0) as IdsTag;
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

    it('works with null success color', () => {
      tag.color = null;
      expect(tag.getAttribute('color')).to.equal(null);
      expect(tag.color).to.equal(null);
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

    it('can set clickable to false', () => {
      tag.clickable = true;
      expect(tag.getAttribute('clickable')).to.equal('true');
      tag.clickable = false;
      expect(tag.getAttribute('clickable')).to.equal(null);
    });
  });

  describe('method tests', () => {
    it('should remove on dismiss', () => {
      tag.dismiss();
      expect(document.body.contains(tag)).to.equal(false);
    });
  });
});
