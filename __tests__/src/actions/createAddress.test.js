import createLockedAddress from '../../../src/bitcoin/createLockedAddress';
import { createAddress, CREATE_ADDRESS_REQUEST, CREATE_ADDRESS_SUCCESS, CREATE_ADDRESS_FAILURE } from '../../../src/actions/createAddress';

const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

const dispatchMock = jest.fn((action) => {
  if (typeof action === 'function') {
    return action(jest.fn());
  }

  return action;
});

const RealDate = Date;

const mockDate = (fakeDate) => {
  global.Date = class extends RealDate {
    constructor(specifiedDate) {
      super(...arguments);
      return new RealDate(specifiedDate || fakeDate);
    }
  };
};

const unmockDate = () => {
  global.Date = RealDate;
};

jest.mock('../../../src/actions/getWallet', () => ({
  getWallet: () => {
    return Promise.resolve({
      publicKey: '0160e457-f104-4bc4-b104-a321dd5091dc'
    });
  }
}));

jest.mock('../../../src/actions/writeAddresses', () => ({
  writeAddresses: () => {
    return Promise.resolve();
  }
}));

jest.mock('../../../src/bitcoin/createLockedAddress', () => {
  return jest.fn(() => ({
    hash: 'd7e7e60d-d9fb-479e-bd00-e3911314f11e',
    script: 'ed0c98ae-dd9a-4876-b091-0548dab7a0df'
  }));
});

describe('CREATE_ADDRESS_REQUEST', () => {
  it('equals "CREATE_ADDRESS_REQUEST"', () => {
    expect(CREATE_ADDRESS_REQUEST).toBe('CREATE_ADDRESS_REQUEST');
  });
});

describe('CREATE_ADDRESS_SUCCESS', () => {
  it('equals "CREATE_ADDRESS_SUCCESS"', () => {
    expect(CREATE_ADDRESS_SUCCESS).toBe('CREATE_ADDRESS_SUCCESS');
  });
});

describe('CREATE_ADDRESS_FAILURE', () => {
  it('equals "CREATE_ADDRESS_FAILURE"', () => {
    expect(CREATE_ADDRESS_FAILURE).toBe('CREATE_ADDRESS_FAILURE');
  });
});

describe('createAddress', () => {
  let fakeUnlockDate;

  beforeAll(() => {
    mockDate('29 November, 2017, 21:59 GMT+02:00');
  });

  beforeEach(() => {
    fakeUnlockDate = new Date('12 June, 2020, 00:00 GMT+02:00');
    createLockedAddress.mockClear();
  });

  afterAll(() => {
    unmockDate();
  });

  it('is a function', () => {
    expect(typeof createAddress).toBe('function');
  });

  it('accepts one argument', () => {
    expect(createAddress.length).toBe(1);
  });

  it('returns a function', () => {
    const returnValue = createAddress(fakeUnlockDate);
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = createAddress(fakeUnlockDate);
    });

    it('dispathes an action of type CREATE_ADDRESS_REQUEST', () => {
      returnedFunction(dispatchMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: CREATE_ADDRESS_REQUEST
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

      it('dispathes an action of type CREATE_ADDRESS_SUCCESS with the new address', () => {
        expect.hasAssertions();

        return promise.then((address) => {
          expect(address).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: CREATE_ADDRESS_SUCCESS,
            address
          });
        });
      });

      it('calls createLockedAddress() with the public key from getWallet() and unlockDate', () => {
        // The public key comes from the mocked getWallet() function above.
        const publicKey = '0160e457-f104-4bc4-b104-a321dd5091dc';
        const mockCall = createLockedAddress.mock.calls[0];
        const argument1 = mockCall[0];
        const argument2 = mockCall[1];

        expect(createLockedAddress).toHaveBeenCalledTimes(1);
        expect(argument1).toBe(publicKey);
        expect(argument2).toBe(fakeUnlockDate);
      });

      it('resolves to an object', () => {
        expect.hasAssertions();

        return promise.then((address) => {
          expect(typeof address).toBe('object');
        });
      });

      describe('the new address', () => {
        let newAddress;

        beforeEach(() => {
          return promise.then((address) => {
            newAddress = address;
          });
        });

        it('has "id" set to a uuid (v1)', () => {
          expect(newAddress.id).toMatch(uuidRegex);
        });

        it('has "hash" set to the hash returned from createLockedAddress()', () => {
          // See the mocked values for createLockedAddress() above.
          expect(newAddress.hash).toBe('d7e7e60d-d9fb-479e-bd00-e3911314f11e');
        });

        it('has "script" set to the script returned from createLockedAddress()', () => {
          // See the mocked values for createLockedAddress() above.
          expect(newAddress.script).toBe('ed0c98ae-dd9a-4876-b091-0548dab7a0df');
        });

        it('has "amount" set to 0', () => {
          expect(newAddress.amount).toBe(0);
        });

        it('has "createdAt" set to the unix timestamp of now', () => {
          const expectedTimestamp = Math.floor(new Date().getTime() / 1000);
          expect(newAddress.createdAt).toBe(expectedTimestamp);
        });

        it('has "unlockAt" set to the unix timestamp of the specified unlock date', () => {
          const expectedTimestamp = Math.floor(fakeUnlockDate.getTime() / 1000);
          expect(newAddress.unlockAt).toBe(expectedTimestamp);
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by sending in null as unlockDate.
        const unlockDate = null;
        promise = createAddress(unlockDate)(dispatchMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('Cannot read property \'getTime\' of null');
        });
      });

      it('dispathes an action of type CREATE_ADDRESS_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: CREATE_ADDRESS_FAILURE,
            error
          });
        });
      });
    });
  });
});
