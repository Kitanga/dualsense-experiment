import { ConnectionType, FPS, PS5DualSenseAdaptiveTriggerModes, PS5DualSenseAdaptiveTriggerStates, PS5_OPTIONS, USAGE_ID_GD_GAME_PAD, USAGE_PAGE_GENERIC_DESKTOP } from './constants';
import { Controller } from './Controller';
import './style.css';

console.log('Ready to do this');

const addDeviceBtn = document.getElementById('add-device')!;
const stateTextBox = document.getElementById('state') as HTMLDivElement;
const l2Trigger = document.getElementById('l2-trigger') as HTMLSelectElement;
const r2Trigger = document.getElementById('r2-trigger') as HTMLSelectElement;

const hid = navigator.hid;

const alreadyPairedDevices = await hid.getDevices();

let devices: HIDDevice[] = alreadyPairedDevices.length ? alreadyPairedDevices : [];

let dv: HIDDevice;

if (devices.length) {
  dv = devices[0];
  connectToDevice();
} else {
  addDeviceBtn.onclick = async () => {
    devices = await navigator.hid.requestDevice({
      filters: [
        PS5_OPTIONS
      ]
    });

    if (devices.length) {
      connectToDevice();
    }
  }
}

async function connectToDevice() {
  dv = devices[0];

  await dv.open();

  console.log('Device Opened:', dv.opened);
  console.table(dv);

  // Get the type
  let connectionType = ConnectionType.USB;
  for (const c of dv.collections) {
    if (c.usagePage != USAGE_PAGE_GENERIC_DESKTOP || c.usage != USAGE_ID_GD_GAME_PAD)
      continue;

    // Compute the maximum input report byte length and compare against known values.
    let maxInputReportBytes = c.inputReports?.reduce((max, report) => {
      return Math.max(max, report.items!.reduce((sum, item) => { return sum + item.reportSize! * item.reportCount!; }, 0));
    }, 0);
    if (maxInputReportBytes == 504)
      connectionType = ConnectionType.USB;
    else if (maxInputReportBytes == 616)
      connectionType = ConnectionType.BLUETOOTH;
  }

  console.log('Connection Type:', connectionType);

  addDeviceBtn.setAttribute('disabled', 'true');

  const controller = (window as any).ctlr = new Controller(connectionType, dv);

  dv.addEventListener('inputreport', ({ reportId, data }) => {
    // Parse Input report
    controller.parseInputReport(data);
  });

  // Set the trigger changes
  l2Trigger.onchange = r2Trigger.onchange = (ev) => {
    // console.log('select:', ev);

    const struct = controller.outputStruct;

    const value = (ev.target as HTMLSelectElement).value;

    console.log('new state:', value);

    // This allows us to augment the information wherever we need it
    const offset = value.includes('l-') ? 21 : 10;

    const keyList = struct.sort;

    let mode = 0x00;
    let params: number[] = [];

    switch (value) {
      case 'l-resistance':
      case 'r-resistance':
        mode = PS5DualSenseAdaptiveTriggerModes.RESISTANCE;
        params = PS5DualSenseAdaptiveTriggerStates[PS5DualSenseAdaptiveTriggerModes.RESISTANCE];
        break;
      case 'l-trigger':
      case 'r-trigger':
        mode = PS5DualSenseAdaptiveTriggerModes.TRIGGER;
        params = PS5DualSenseAdaptiveTriggerStates[PS5DualSenseAdaptiveTriggerModes.TRIGGER];
        break;
      case 'l-auto-trigger':
      case 'r-auto-trigger':
        mode = PS5DualSenseAdaptiveTriggerModes.AUTO_TRIGGER;
        params = PS5DualSenseAdaptiveTriggerStates[PS5DualSenseAdaptiveTriggerModes.AUTO_TRIGGER];
        break;
    }

    console.log('mode:params:', mode, params);

    struct[keyList[offset]] = mode;

    // Apply the values to the parameters after the mode
    params.forEach((val, ix) => {
      struct[keyList[offset + ix + 1]] = val;
    });

    controller.updateDevice();
  }

  // Set the player to player1

  // Send an output report with base info
  controller.updateDevice();
}

// 60 FPS updates
let nextUpdate = 0;
let diffUpdate = 1000 / FPS;

function update() {
  requestAnimationFrame(update);

  const now = performance.now();

  if (now > nextUpdate) {
    nextUpdate = now + diffUpdate;

    const controller = (window as any).ctlr;

    if (controller) {
      // Update textarea with controller state
      let stateStr = '';

      const state = controller.state;

      for (let key in state) {
        stateStr += `<div>${key}: ${state[key as keyof typeof state]}</div>`;
      }

      stateTextBox.innerHTML = stateStr;
    }
  }
}

update();
