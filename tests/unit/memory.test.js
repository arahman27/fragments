const { readFragment, writeFragment, readFragmentData, writeFragmentData } = require('../../src/model/data/memory/index');
const data = Buffer.from([1, 2, 3]);

const fragment = {ownerId:'a', id: 'b'};

describe('Read/write tests', () => {
  test('Returns promise Object', async () => {
    const result = await writeFragment(fragment);
    expect(result).toBe(undefined);
  });

  test('Returns promise Object', async () => {
    const result = await readFragment('a', 'b');
    expect(result).toBe(fragment);
  });

  test('Returns promise Object', async () => {
    const result = await writeFragmentData('a', 'b', data);
    expect(result).toBe(undefined);
  });

  test('Returns promise Object', async () => {
    const result = await readFragmentData('a', 'b');
    expect(result).toBe(data);
  });

  test('Returns promise Object', async () => {
    const result = await readFragmentData('a', 'c');
    expect(result).toBe(undefined);
  });
});
