import { app } from './app';

test('App inits', () => {
  expect(app).not.toThrowError();
});
