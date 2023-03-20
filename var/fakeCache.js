let fakeCache = {};

export default async function fakeDelay(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return {};
  }

  fakeCache[key] = true;
  return new Promise((res) => {
    setTimeout(res, 1_000);
  });
}
