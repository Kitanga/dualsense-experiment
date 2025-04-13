// Generate CRC32 lookup table.
export const makeCRCTable = () => {
    let c;
    const crcTable = [];
    for (let n = 0; n < 256; ++n) {
        c = n;
        for (let k = 0; k < 8; ++k)
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        crcTable[n] = (c >>> 0);
    }
    return crcTable;
};

// Compute CRC32 for `prefixBytes` concatenated with `dataView`.
const crc32 = (prefixBytes: [number, number], dataView: DataView) => {
    let crTable = (window as any).crcTable;
    
    if (crTable === undefined)
        (window as any).crcTable = crTable = makeCRCTable();
    let crc = (-1 >>> 0);
    for (const byte of prefixBytes)
        crc = (crc >>> 8) ^ crTable[(crc ^ byte) & 0xFF];
    for (let i = 0; i < dataView.byteLength; ++i)
        crc = (crc >>> 8) ^ crTable[(crc ^ dataView.getUint8(i)) & 0xFF];
    return (crc ^ (-1)) >>> 0;
};

// Given a DualSense Bluetooth output report with `reportId` and `reportData`,
// compute the CRC32 checksum and write it to the last four bytes of `reportData`.
export const fillDualSenseChecksum = (reportId: number, reportData: Uint8Array) => {
    const crc = crc32([0xa2, reportId], new DataView(reportData.buffer, 0, reportData.byteLength - 4));
    reportData[reportData.byteLength - 4] = (crc >>> 0) & 0xff;
    reportData[reportData.byteLength - 3] = (crc >>> 8) & 0xff;
    reportData[reportData.byteLength - 2] = (crc >>> 16) & 0xff;
    reportData[reportData.byteLength - 1] = (crc >>> 24) & 0xff;
};

// Normalize an 8-bit thumbstick axis to the range [-1, +1].
export const normalizeThumbStickAxis = (value: number) => {
    return (2 * value / 255) - 1.0;
};

// Normalize an 8-bit trigger axis to the range [0, +1].
export const normalizeTriggerAxis = (value: number) => {
    return value / 255;
};

// Normalize a digital button value to the range [0, +1].
export const normalizeButton = (value: number | boolean) => {
    return value ? 1.0 : 0.0;
};