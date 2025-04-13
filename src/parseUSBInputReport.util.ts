import { ConnectionType, DUAL_SENSE_USB_INPUT_REPORT_0x01_SIZE } from "./constants";

export function parseInputReport(report: DataView, connectionType: ConnectionType) {
    if (report.byteLength != DUAL_SENSE_USB_INPUT_REPORT_0x01_SIZE)
        return;

    const offset = connectionType == ConnectionType.USB ? 0 : 1;

    let axes0 = report.getUint8(0+ offset);
    let axes1 = report.getUint8(1+ offset);
    let axes2 = report.getUint8(2+ offset);
    let axes3 = report.getUint8(3+ offset);
    let axes4 = report.getUint8(4+ offset);
    let axes5 = report.getUint8(5+ offset);
    let seqNum = report.getUint8(6+ offset);
    let buttons0 = report.getUint8(7+ offset);
    let buttons1 = report.getUint8(8+ offset);
    let buttons2 = report.getUint8(9+ offset);
    let buttons3 = report.getUint8(10 + offset);
    let timestamp0 = report.getUint8(11 + offset);
    let timestamp1 = report.getUint8(12 + offset);
    let timestamp2 = report.getUint8(13 + offset);
    let timestamp3 = report.getUint8(14 + offset);
    let gyroX0 = report.getUint8(15 + offset);
    let gyroX1 = report.getUint8(16 + offset);
    let gyroY0 = report.getUint8(17 + offset);
    let gyroY1 = report.getUint8(18 + offset);
    let gyroZ0 = report.getUint8(19 + offset);
    let gyroZ1 = report.getUint8(20 + offset);
    let accelX0 = report.getUint8(21 + offset);
    let accelX1 = report.getUint8(22 + offset);
    let accelY0 = report.getUint8(23 + offset);
    let accelY1 = report.getUint8(24 + offset);
    let accelZ0 = report.getUint8(25 + offset);
    let accelZ1 = report.getUint8(26 + offset);
    let sensorTimestamp0 = report.getUint8(27 + offset);
    let sensorTimestamp1 = report.getUint8(28 + offset);
    let sensorTimestamp2 = report.getUint8(29 + offset);
    let sensorTimestamp3 = report.getUint8(30 + offset);
    let sensorTemperature = report.getUint8(31 + offset);
    let touch00 = report.getUint8(32 + offset);
    let touch01 = report.getUint8(33 + offset);
    let touch02 = report.getUint8(34 + offset);
    let touch03 = report.getUint8(35 + offset);
    let touch10 = report.getUint8(36 + offset);
    let touch11 = report.getUint8(37 + offset);
    let touch12 = report.getUint8(38 + offset);
    let touch13 = report.getUint8(39 + offset);
    // byte 40?
    let r2feedback = report.getUint8(41 + offset);
    let l2feedback = report.getUint8(42 + offset);
    // bytes 43-51?
    let battery0 = report.getUint8(52 + offset);
    let battery1 = report.getUint8(53 + offset);
    // bytes 54-58?
    // bytes 59-62 CRC32 checksum

    return {
        axes0,
        axes1,
        axes2,
        axes3,
        axes4,
        axes5,
        seqNum,
        buttons0,
        buttons1,
        buttons2,
        buttons3,
        timestamp0,
        timestamp1,
        timestamp2,
        timestamp3,
        gyroX0,
        gyroX1,
        gyroY0,
        gyroY1,
        gyroZ0,
        gyroZ1,
        accelX0,
        accelX1,
        accelY0,
        accelY1,
        accelZ0,
        accelZ1,
        sensorTimestamp0,
        sensorTimestamp1,
        sensorTimestamp2,
        sensorTimestamp3,
        sensorTemperature,
        touch00,
        touch01,
        touch02,
        touch03,
        touch10,
        touch11,
        touch12,
        touch13,
        r2feedback,
        l2feedback,
        battery0,
        battery1,
    }
}