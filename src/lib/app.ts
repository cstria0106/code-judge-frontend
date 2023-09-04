import { base } from '$app/paths';

export function reloadApp() {
  location.assign(`${base}/`);
}
