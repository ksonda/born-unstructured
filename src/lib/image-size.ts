/**
 * Width and height of a JPEG or PNG, read from its header. Used at build time
 * so that photos in posts reserve their space before they load.
 */
export function imageSize(bytes: Uint8Array): { width: number; height: number } | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  // PNG: the IHDR chunk follows the 8-byte signature.
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes.length > 24) {
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }
  // JPEG: walk the segments until a start-of-frame marker.
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) return null;
    const marker = bytes[offset + 1];
    const length = view.getUint16(offset + 2);
    const isFrame = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isFrame) return { height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
    offset += 2 + length;
  }
  return null;
}
