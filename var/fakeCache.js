let fakeCache = {};

export default async function fakeDelay(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return {};
  }

  fakeCache[key] = true;
  return new Promise((r) => {
    setTimeout(r, 1_000);
  });
}
