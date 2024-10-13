export function getTransitionDuration(element: HTMLElement) {
  const srtValue = getComputedStyle(element)["transitionDuration"];

  if (srtValue.includes("ms")) {
    return parseFloat(srtValue);
  } else if (srtValue.includes("s")) {
    return parseFloat(srtValue) * 1000;
  }
}

export function afterTransition(element: HTMLElement, callback: () => void) {
  const time = getTransitionDuration(element);

  const timerId = setTimeout(callback, time);

  return timerId;
}
