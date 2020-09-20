import Loader, { URLConstants } from './load';

test('init image loader', async () => {
  const loader = new Loader();

  expect(loader).toBeTruthy();
  expect(await loader.checkExists('../data/collections')).toBeTruthy();
});

test('checkExists', async () => {
  const loader = new Loader();
  const resTruthy = await loader.checkExists('../src');
  expect(resTruthy).toBeTruthy();

  const resFalsey = await loader.checkExists('./test');
  expect(resFalsey).toBeFalsy();
});

test('safeRemove', async () => {
  const loader = new Loader();

  await loader.ensureExists('../data/safeRemoveTest/inner');

  await loader.safeRemove('../data/safeRemoveTest/inner');
  const resInner = await loader.checkExists('../data/safeRemoveTest/inner');

  expect(resInner).toBeFalsy();

  await loader.ensureExists('../data/safeRemoveTest/inner/deep');
  await loader.safeRemove('../data/safeRemoveTest');
  const resSafeRemoveTest = await loader.checkExists('../data/safeRemoveTest');

  expect(resSafeRemoveTest).toBeFalsy();
});

test('ensureExists', async () => {
  const loader = new Loader();

  await loader.ensureExists('../data/ensureTest/inner/deep');
  const res = await loader.checkExists('../data/ensureTest/inner/deep');

  expect(res).toBeTruthy();

  const cleanup = async () => {
    const loader = new Loader();
    await loader.safeRemove('../data/ensureTest');
    const resEnsuretest = await loader.checkExists('../data/ensureTest');
    expect(resEnsuretest).toBeFalsy();
  };
  await cleanup();
});

test('setupCollection', () => {
  const loader = new Loader();

  loader.setupCollection('testCol-1', '');
  const details = loader.getDetails('testCol-1');

  expect(details).toBeTruthy();
});

test('loadCollection', async () => {
  const loader = new Loader();

  loader.setupCollection('testCol-2', '');
  await loader.loadCollection('testCol-2');

  loader.getDetails('testCol-2');
});
