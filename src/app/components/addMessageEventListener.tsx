export function addMessageEventListener(
  type: string,
  callback: (message: any) => void
) {
  let f = (event) => {
    const { type: t, message } = event.data.pluginMessage;
    if (type === t) {
      callback(message);
    }
  };
  window.addEventListener("message", f);
  return () => {
    window.removeEventListener("message", f);
  };
}
