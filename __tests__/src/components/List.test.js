import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import List from '../../../src/components/List';

describe('List', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <List />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('#_renderRows()', () => {
    var onShowItem;
    var list;
    var items;
    var returnValue;

    beforeEach(() => {
      onShowItem = jest.fn();

      list = new List();
      list.props = { onShowItem };

      items = [
        { id: '40fd1773-2582-4587-b105-de91534dac5f' },
        { id: '25c69897-0f0c-460f-b640-fb74e8f5f1cd' },
        { id: 'ab5c2461-f04a-4f33-a643-4dd271deacb5' }
      ];

      returnValue = list._renderRows(items);
    });

    it('accepts one argument', () => {
      const length = list._renderRows.length;
      expect(length).toBe(1);
    });

    it('returns an array', () => {
      const returnValue = list._renderRows(items);
      expect(Array.isArray(returnValue)).toBe(true);
    });

    describe('the returned array', () => {
      it('has the length of "items"', () => {
        expect(returnValue.length).toBe(items.length);
      });

      describe('each item in the array', () => {
        it('is of type "Row"', () => {
          returnValue.forEach((row) => {
            expect(typeof row).toBe('object');
            expect(typeof row.type).toBe('function');
            expect(row.type.name).toBe('Row');
          });
        });

        it('has key assigned to the id of the item', () => {
          returnValue.forEach((row, index) => {
            expect(row.key).toBe(items[index].id);
          });
        });

        it('has property "item" assigned to the item', () => {
          returnValue.forEach((row, index) => {
            expect(row.props.item).toBe(items[index]);
          });
        });

        it('has property "onShowItem" assigned to props.onShowItem', () => {
          returnValue.forEach((row) => {
            expect(row.props.onShowItem).toBe(onShowItem);
          });
        });
      });
    });
  });
});
