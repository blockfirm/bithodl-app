const FAKE_USERNAME = 'privateKey';
const FAKE_PRIVATE_KEY = 'during bulb nominee acquire paddle next course stable govern eagle title wing';

export const getGenericPassword = jest.fn(() => {
  return Promise.resolve({
    username: FAKE_USERNAME,
    password: FAKE_PRIVATE_KEY
  });
});

export const setGenericPassword = jest.fn(() => {
  return Promise.resolve();
});

export const resetGenericPassword = jest.fn(() => {
  return Promise.resolve();
});
