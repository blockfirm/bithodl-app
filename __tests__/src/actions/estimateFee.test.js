import api from '../../../src/api';
import { estimateFee, ESTIMATE_FEE_REQUEST, ESTIMATE_FEE_SUCCESS, ESTIMATE_FEE_FAILURE } from '../../../src/actions/estimateFee';

const dispatchMock = jest.fn();

const getStateMock = jest.fn(() => ({
  settings: {
    bitcoin: {
      fee: {
        level: 'Normal',
        satoshisPerByte: 100
      }
    },
    api: {
      baseUrl: 'a5d31859-9daa-47e1-84cb-2f45da488102'
    }
  }
}));

jest.mock('../../../src/api', () => ({
  estimateFee: jest.fn(() => Promise.resolve(123))
}));

describe('ESTIMATE_FEE_REQUEST', () => {
  it('equals "ESTIMATE_FEE_REQUEST"', () => {
    expect(ESTIMATE_FEE_REQUEST).toBe('ESTIMATE_FEE_REQUEST');
  });
});

describe('ESTIMATE_FEE_SUCCESS', () => {
  it('equals "ESTIMATE_FEE_SUCCESS"', () => {
    expect(ESTIMATE_FEE_SUCCESS).toBe('ESTIMATE_FEE_SUCCESS');
  });
});

describe('ESTIMATE_FEE_FAILURE', () => {
  it('equals "ESTIMATE_FEE_FAILURE"', () => {
    expect(ESTIMATE_FEE_FAILURE).toBe('ESTIMATE_FEE_FAILURE');
  });
});

describe('estimateFee', () => {
  beforeEach(() => {
    api.estimateFee.mockClear();
  });

  it('is a function', () => {
    expect(typeof estimateFee).toBe('function');
  });

  it('accepts no arguments', () => {
    expect(estimateFee.length).toBe(0);
  });

  it('returns a function', () => {
    const returnValue = estimateFee();
    expect(typeof returnValue).toBe('function');
  });

  describe('the returned function', () => {
    let returnedFunction;

    beforeEach(() => {
      returnedFunction = estimateFee();
    });

    it('dispatches an action of type ESTIMATE_FEE_REQUEST', () => {
      returnedFunction(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: ESTIMATE_FEE_REQUEST
      });
    });

    it('fetches the estimated fee using api.estimateFee() together with baseUrl from settings', () => {
      expect.hasAssertions();

      return returnedFunction(dispatchMock, getStateMock).then(() => {
        const expectedOptions = {
          baseUrl: 'a5d31859-9daa-47e1-84cb-2f45da488102'
        };

        expect(api.estimateFee).toHaveBeenCalledTimes(1);
        expect(api.estimateFee).toHaveBeenCalledWith(expectedOptions);
      });
    });

    it('returns a Promise', () => {
      const returnValue = returnedFunction(dispatchMock, getStateMock);
      expect(returnValue).toBeInstanceOf(Promise);
    });

    describe('the promise', () => {
      let promise;

      beforeEach(() => {
        promise = returnedFunction(dispatchMock, getStateMock);
      });

      it('dispatches an action of type ESTIMATE_FEE_SUCCESS with the estimated fee', () => {
        expect.hasAssertions();

        return promise.then(() => {
          expect(dispatchMock).toHaveBeenCalledWith({
            type: ESTIMATE_FEE_SUCCESS,
            satoshisPerByte: 123 // The fee is mocked at the top of this file.
          });
        });
      });
    });

    describe('when the fee level is set to "Custom"', () => {
      let promise;

      beforeEach(() => {
        getStateMock.mockImplementationOnce(() => ({
          settings: {
            bitcoin: {
              fee: {
                level: 'Custom',
                satoshisPerByte: 14
              }
            },
            api: {
              baseUrl: '00791957-59d1-440e-a5f3-b5f3b3e222a9'
            }
          }
        }))

        promise = estimateFee()(dispatchMock, getStateMock);
      });

      it('returns the custom fee', () => {
        expect.hasAssertions();

        return promise.then((satoshisPerByte) => {
          expect(satoshisPerByte).toBe(14);
        });
      });

      it('does not call the api', () => {
        expect(api.estimateFee).toHaveBeenCalledTimes(0);
      });
    });

    describe('when the fee level is set to "High"', () => {
      let promise;

      beforeEach(() => {
        getStateMock.mockImplementationOnce(() => ({
          settings: {
            bitcoin: {
              fee: {
                level: 'High',
                satoshisPerByte: 1
              }
            },
            api: {
              baseUrl: '1efb49e6-5c13-4fec-8166-854522e71379'
            }
          }
        }))

        promise = estimateFee()(dispatchMock, getStateMock);
      });

      it('returns a fee that is 150% of the estimated fee', () => {
        expect.hasAssertions();

        return promise.then((satoshisPerByte) => {
          const expectedFee = Math.round(123 * 1.5); // 123 comes from the mock at the top.
          expect(satoshisPerByte).toBe(expectedFee);
        });
      });
    });

    describe('when the fee level is set to "Normal"', () => {
      let promise;

      beforeEach(() => {
        getStateMock.mockImplementationOnce(() => ({
          settings: {
            bitcoin: {
              fee: {
                level: 'Normal',
                satoshisPerByte: 1
              }
            },
            api: {
              baseUrl: '5db4836e-c4d6-4456-a795-09e425ec1f13'
            }
          }
        }))

        promise = estimateFee()(dispatchMock, getStateMock);
      });

      it('returns a fee that is 100% of the estimated fee', () => {
        expect.hasAssertions();

        return promise.then((satoshisPerByte) => {
          const expectedFee = 123; // 123 comes from the mock at the top.
          expect(satoshisPerByte).toBe(expectedFee);
        });
      });
    });

    describe('when the fee level is set to "Low"', () => {
      let promise;

      beforeEach(() => {
        getStateMock.mockImplementationOnce(() => ({
          settings: {
            bitcoin: {
              fee: {
                level: 'Low',
                satoshisPerByte: 1
              }
            },
            api: {
              baseUrl: '56464faa-4e3b-46af-8a06-8dac7f2a24bf'
            }
          }
        }))

        promise = estimateFee()(dispatchMock, getStateMock);
      });

      it('returns a fee that is 50% of the estimated fee', () => {
        expect.hasAssertions();

        return promise.then((satoshisPerByte) => {
          const expectedFee = Math.round(123 * 0.5); // 123 comes from the mock at the top.
          expect(satoshisPerByte).toBe(expectedFee);
        });
      });
    });

    describe('when the fee level is set to "Very low"', () => {
      let promise;

      beforeEach(() => {
        getStateMock.mockImplementationOnce(() => ({
          settings: {
            bitcoin: {
              fee: {
                level: 'Very low',
                satoshisPerByte: 1
              }
            },
            api: {
              baseUrl: '376f9ff3-656c-4386-9356-4483fd34925d'
            }
          }
        }))

        promise = estimateFee()(dispatchMock, getStateMock);
      });

      it('returns a fee that is 25% of the estimated fee', () => {
        expect.hasAssertions();

        return promise.then((satoshisPerByte) => {
          const expectedFee = Math.round(123 * 0.25); // 123 comes from the mock at the top.
          expect(satoshisPerByte).toBe(expectedFee);
        });
      });
    });

    describe('when the function fails', () => {
      let promise;

      beforeEach(() => {
        // Make the function fail by returning a rejected promise from api.estimateFee().
        api.estimateFee.mockImplementationOnce(() => new Promise.reject(
          new Error('d13970f1-0fa5-4156-8470-643629859248')
        ));

        promise = estimateFee()(dispatchMock, getStateMock);
      });

      it('rejects the returned promise', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('d13970f1-0fa5-4156-8470-643629859248');
        });
      });

      it('dispatches an action of type ESTIMATE_FEE_FAILURE with the error', () => {
        expect.hasAssertions();

        return promise.catch((error) => {
          expect(error).toBeTruthy();

          expect(dispatchMock).toHaveBeenCalledWith({
            type: ESTIMATE_FEE_FAILURE,
            error
          });
        });
      });
    });
  });
});
