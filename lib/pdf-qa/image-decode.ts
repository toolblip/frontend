import { PDFArray, PDFDict, PDFName, PDFNumber } from 'pdf-lib';

/** Accept explicit defaults only. Unsupported transforms must be counted as skipped,
 * rather than returning pixels that silently ignore the image dictionary. */
export function hasSupportedImageDecode(dict: PDFDict): boolean {
  const decode = dict.lookup(PDFName.of('Decode'));
  if (decode) {
    const color = dict.lookup(PDFName.of('ColorSpace'));
    const indexed = color instanceof PDFArray && color.lookup(0) === PDFName.of('Indexed');
    const channels = color === PDFName.of('DeviceRGB') ? 3 : color === PDFName.of('DeviceCMYK') ? 4
      : color === PDFName.of('DeviceGray') || indexed ? 1 : 0;
    const bits = dict.lookup(PDFName.of('BitsPerComponent'));
    const high = indexed && bits instanceof PDFNumber ? 2 ** bits.asNumber() - 1 : 1;
    if (!channels || !(decode instanceof PDFArray) || decode.size() !== channels * 2) return false;
    for (let i = 0; i < decode.size(); i++) {
      const value = decode.lookup(i);
      if (!(value instanceof PDFNumber) || value.asNumber() !== (i % 2 ? high : 0)) return false;
    }
  }
  let parms = dict.lookup(PDFName.of('DecodeParms'));
  if (parms instanceof PDFArray) {
    if (parms.size() !== 1) return false;
    parms = parms.lookup(0);
  }
  if (!parms) return true;
  if (!(parms instanceof PDFDict)) return false;
  const filter = dict.lookup(PDFName.of('Filter'));
  for (const [key, entry] of parms.entries()) {
    const name = key.decodeText();
    const value = parms.context.lookup(entry);
    if (!(value instanceof PDFNumber)) return false;
    if (name === 'Predictor' || name === 'EarlyChange') {
      if (value.asNumber() !== 1 || (name === 'EarlyChange' && filter !== PDFName.of('LZWDecode'))) return false;
    } else if (!['Colors', 'BitsPerComponent', 'Columns'].includes(name)) return false;
    // Colors/BitsPerComponent/Columns have no effect with Predictor 1 (the default).
  }
  return true;
}
