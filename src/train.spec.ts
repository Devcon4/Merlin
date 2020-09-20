import Trainer from './train';

test('initialize trainer', () => {
  const trainer = new Trainer();

  expect(trainer).not.toBeNull();
});
