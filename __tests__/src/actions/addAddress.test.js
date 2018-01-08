import { addAddress, ADD_ADDRESS_REQUEST, ADD_ADDRESS_SUCCESS } from '../../../src/actions/addAddress';

const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
const dispatchMock = jest.fn();

describe('ADD_ADDRESS_REQUEST', () => {
  it('equals "ADD_ADDRESS_REQUEST"', () => {
    expect(ADD_ADDRESS_REQUEST).toBe('ADD_ADDRESS_REQUEST');
  });
});

describe('ADD_ADDRESS_SUCCESS', () => {
  it('equals "ADD_ADDRESS_SUCCESS"', () => {
    expect(ADD_ADDRESS_SUCCESS).toBe('ADD_ADDRESS_SUCCESS');
  });
});

describe('addAddress', () => {
  let fakeAddress;

  beforeEach(() => {
    fakeAddress = {};
  });

  it('is a function', () => {
    expect(typeof addAddress).toBe('function');
  });

  it('accepts one argument', () => {
    expect(addAddress.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = addAddress(fakeAddress);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = addAddress(fakeAddress);
    });

    it('dispathes an action of type ADD_ADDRESS_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: ADD_ADDRESS_REQUEST
      });
    });

    it('dispathes an action of type ADD_ADDRESS_SUCCESS with the address', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: ADD_ADDRESS_SUCCESS,
        address: fakeAddress
      });
    });

    it('returns a Promise', () => {
      const returnValue = returnedFunction(dispatchMock);
      expect(returnValue).toBeInstanceOf(Promise);
    });

    describe('the promise', () => {
      let promise;

      beforeEach(() => {
        promise = returnedFunction(dispatchMock);
      });

      it('resolves to the passed address', () => {
        expect.hasAssertions();

        return promise.then((address) => {
          expect(address).toBe(fakeAddress);
        });
      });
    });

    describe('when address.id is undefined', () => {
      it('sets address.id to a uuid (v1)', () => {
        fakeAddress.id = undefined;
        returnedFunction(dispatchMock);
        expect(fakeAddress.id).toMatch(uuidRegex);
      });
    });

    describe('when address.id is not undefined', () => {
      it('does not change address.id', () => {
        const fakeId = 'f046249a-9c24-4fff-9597-4373469ab7e1';

        fakeAddress.id = fakeId;
        returnedFunction(dispatchMock);

        expect(fakeAddress.id).toMatch(fakeId);
      });
    });
  });
});
