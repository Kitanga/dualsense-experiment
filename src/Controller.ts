import { ConnectionType } from "./constants";
import { normalizeButton, normalizeThumbStickAxis, normalizeTriggerAxis } from "./controller_utils";
import { OutputStruct } from "./OutputStruct";
import { parseInputReport } from "./parseUSBInputReport.util";

type tStateChangeCallback = (currentState: any, prevState: any) => void;

export class Controller {
    state = {
        lsx: 0,
        lsy: 0,
        rsx: 0,
        rsy: 0,
        l2axis: 0,
        r2axis: 0,
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        square: 0,
        cross: 0,
        circle: 0,
        triangle: 0,
        l1: 0,
        r1: 0,
        l2: 0,
        r2: 0,
        create: 0,
        options: 0,
        l3: 0,
        r3: 0,
        ps: 0,
        touchpad: 0,
        mute: 0,
        timestamp0: 0,
        timestamp1: 0,
        timestamp2: 0,
        timestamp3: 0,
        touch0active: false,
        touch0id: 0,
        touch0x: 0,
        touch0y: 0,
        touch1active: false,
        touch1id: 0,
        touch1x: 0,
        touch1y: 0,
        sensorTimestamp0: 0,
        sensorTimestamp1: 0,
        sensorTimestamp2: 0,
        sensorTimestamp3: 0,
        sensorTemperature: 0,
        gyrox: 0,
        gyroy: 0,
        gyroz: 0,
        accelx: 0,
        accely: 0,
        accelz: 0,
        r2feedback: 0,
        l2feedback: 0,
        batteryLevelPercent: 0,
        batteryFull: false,
        batteryCharging: false,
    }

    lastState!: Controller["state"];

    events: Map<keyof typeof this.state, tStateChangeCallback> = new Map();

    outputStruct = new OutputStruct();

    constructor(public connectionType: ConnectionType, public device: HIDDevice) { }

    parseInputReport(report: HIDInputReportEvent["data"]) {
        // const {datapoints} = this.connectionType ? parseInputReport
        const data = parseInputReport(report, this.connectionType);

        if (data) {
            const {
                axes0,
                axes1,
                axes2,
                axes3,
                axes4,
                axes5,
                // seqNum,
                buttons0,
                buttons1,
                buttons2,
                // buttons3,
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
            } = data;

            const state = this.state;

            const lastState = this.lastState = Object.assign({}, state);

            state.lsx = normalizeThumbStickAxis(axes0);
            state.lsy = normalizeThumbStickAxis(axes1);
            state.rsx = normalizeThumbStickAxis(axes2);
            state.rsy = normalizeThumbStickAxis(axes3);
            state.l2axis = normalizeTriggerAxis(axes4);
            state.r2axis = normalizeTriggerAxis(axes5);

            let dpad = buttons0 & 0x0f;
            state.up = normalizeButton(dpad == 0 || dpad == 1 || dpad == 7);
            state.down = normalizeButton(dpad == 3 || dpad == 4 || dpad == 5);
            state.left = normalizeButton(dpad == 5 || dpad == 6 || dpad == 7);
            state.right = normalizeButton(dpad == 1 || dpad == 2 || dpad == 3);
            state.square = normalizeButton(buttons0 & 0x10);
            state.cross = normalizeButton(buttons0 & 0x20);
            state.circle = normalizeButton(buttons0 & 0x40);
            state.triangle = normalizeButton(buttons0 & 0x80);
            state.l1 = normalizeButton(buttons1 & 0x01);
            state.r1 = normalizeButton(buttons1 & 0x02);
            state.l2 = normalizeButton(buttons1 & 0x04);
            state.r2 = normalizeButton(buttons1 & 0x08);
            state.create = normalizeButton(buttons1 & 0x10);
            state.options = normalizeButton(buttons1 & 0x20);
            state.l3 = normalizeButton(buttons1 & 0x40);
            state.r3 = normalizeButton(buttons1 & 0x80);
            state.ps = normalizeButton(buttons2 & 0x01);
            state.touchpad = normalizeButton(buttons2 & 0x02);
            state.mute = normalizeButton(buttons2 & 0x04);

            state.timestamp0 = timestamp0;
            state.timestamp1 = timestamp1;
            state.timestamp2 = timestamp2;
            state.timestamp3 = timestamp3;

            state.touch0active = !(touch00 & 0x80);
            state.touch0id = (touch00 & 0x7F);
            state.touch0x = ((touch02 & 0x0F) << 8) | touch01;
            state.touch0y = (touch03 << 4) | ((touch02 & 0xF0) >> 4);
            state.touch1active = !(touch10 & 0x80);
            state.touch1id = (touch10 & 0x7F);
            state.touch1x = ((touch12 & 0x0F) << 8) | touch11;
            state.touch1y = (touch13 << 4) | ((touch12 & 0xF0) >> 4);

            state.sensorTimestamp0 = sensorTimestamp0;
            state.sensorTimestamp1 = sensorTimestamp1;
            state.sensorTimestamp2 = sensorTimestamp2;
            state.sensorTimestamp3 = sensorTimestamp3;
            state.sensorTemperature = sensorTemperature;

            let gyrox = state.gyrox = (gyroX1 << 8) | gyroX0;
            if (gyrox > 0x7FFF) gyrox -= 0x10000;
            let gyroy = state.gyroy = (gyroY1 << 8) | gyroY0;
            if (gyroy > 0x7FFF) gyroy -= 0x10000;
            let gyroz = state.gyroz = (gyroZ1 << 8) | gyroZ0;
            if (gyroz > 0x7FFF) gyroz -= 0x10000;
            let accelx = state.accelx = (accelX1 << 8) | accelX0;
            if (accelx > 0x7FFF) accelx -= 0x10000;
            let accely = state.accely = (accelY1 << 8) | accelY0;
            if (accely > 0x7FFF) accely -= 0x10000;
            let accelz = state.accelz = (accelZ1 << 8) | accelZ0;
            if (accelz > 0x7FFF) accelz -= 0x10000;

            state.r2feedback = r2feedback;
            state.l2feedback = l2feedback;

            state.batteryLevelPercent = (battery0 & 0x0f) * 100 / 8;
            state.batteryFull = !!(battery0 & 0x20);
            state.batteryCharging = !!(battery1 & 0x08);

            const events = this.events;

            for (let key in state) {
                const currentState = state[key as keyof typeof state];
                const previousState = lastState[key as keyof typeof state];

                if (currentState != previousState) {
                    events.get(key as keyof typeof state)?.(currentState, previousState);
                }
            }
        }
    }

    setStateChangeEvent<T>(key: keyof typeof this.state, callBack: (currentState: T, prevState: T) => void) {
        this.events.set(key, callBack);
    }

    async updateDevice() {
        // This is for USB
        const report = this.outputStruct.reportData;
        const reportID = 0x02;

        // console.log('report:', report);

        try {
            await this.device.sendReport(reportID, report);
        } catch(err) {
            console.error('DualSense Error', err)
        }
    }
}