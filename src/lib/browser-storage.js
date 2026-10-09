export function readBrowserStorage(storageName, key) {
  try {
    return window[storageName].getItem(key);
  } catch {
    return null;
  }
}

export function writeBrowserStorage(storageName, key, value) {
  try {
    window[storageName].setItem(key, value);
  } catch {
    // Storage is optional; keep the app usable when the browser blocks it.
  }
}
