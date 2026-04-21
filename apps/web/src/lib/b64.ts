export function uint8ToBase64(u8: Uint8Array): string {
  let binary = "";
  u8.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}
