import React from 'react';
import { Clipboard } from 'react-native';
import renderer from 'react-test-renderer';
import AddressLabel from '../../../src/components/AddressLabel';

describe('AddressLabel', () => {
  let fakeAddress;

  beforeEach(() => {
    fakeAddress = '2N6oSTcdmjmTPEQ1sLTBye8HCvbM2fyL2HM';
  });

  it('renders correctly', () => {
    const tree = renderer.create(
      <AddressLabel address={fakeAddress} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('#_copyToClipboard()', () => {
    let addressLabel;

    beforeEach(() => {
      Clipboard.setString.mockClear();

      // Mock setState(). Should probably use some utility to handle this.
      // E.g. <https://github.com/airbnb/enzyme>
      AddressLabel.prototype.setState = jest.fn();

      addressLabel = new AddressLabel({
        address: fakeAddress
      });
    });

    it('accepts no arguments', () => {
      const length = addressLabel._copyToClipboard.length;
      expect(length).toBe(0);
    });

    it('copies the address to the clipboard', () => {
      addressLabel._copyToClipboard();

      expect(Clipboard.setString).toHaveBeenCalledTimes(1);
      expect(Clipboard.setString).toHaveBeenCalledWith(fakeAddress);
    });
  });
});
