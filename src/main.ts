import { ConnectionType, FPS, PS5DualSenseAdaptiveTriggerModes, PS5DualSenseAdaptiveTriggerStates, PS5_OPTIONS, PlayerLedControl, USAGE_ID_GD_GAME_PAD, USAGE_PAGE_GENERIC_DESKTOP } from './constants';
import { Controller } from './Controller';
import './style.css';

console.log('Ready to do this');

const addDeviceBtn = document.getElementById('add-device')!;
const stateTextBox = document.getElementById('state') as HTMLDivElement;
const l2Trigger = document.getElementById('l2-trigger') as HTMLSelectElement;
const r2Trigger = document.getElementById('r2-trigger') as HTMLSelectElement;
const gyro = document.getElementById('gyro-z') as HTMLUListElement;

let gyroActive = false;

gyro.onclick = () => {
  gyroActive = !gyroActive;

  if (!gyroActive) {
    gyro.style.transform = "";
  }
};

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
  l2Trigger.onchange = r2Trigger.onchange = async (ev) => {
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

    controller.setStateChangeEvent('r2', (curVal, prevVal) => {
      // console.log('r2 changed:', curVal);
    });
  }

  // @ts-ignore
  l2Trigger.onchange({ target: l2Trigger });
  // @ts-ignore
  r2Trigger.onchange({ target: r2Trigger, });

  controller.setStateChangeEvent('l1', (val) => {
    if (val) {
      controller.outputStruct.bcVibrationLeft = 128;
    } else {
      controller.outputStruct.bcVibrationLeft = 0;
    }

    controller.updateDevice();
  });
  controller.setStateChangeEvent('r1', (val) => {
    if (val) {
      controller.outputStruct.bcVibrationRight = 128;
    } else {
      controller.outputStruct.bcVibrationRight = 0;
    }

    controller.updateDevice();
  });
  controller.setStateChangeEvent('cross', (val) => {
    if (val) {
      if (controller.state.r1) {
        r2Trigger.value = 'r-resistance';
        // @ts-ignore
        r2Trigger.onchange({ target: r2Trigger });
      } else if (controller.state.l1) {
        l2Trigger.value = 'l-resistance';
        // @ts-ignore
        l2Trigger.onchange({ target: l2Trigger });
      } else {
        // Green
        controller.outputStruct.ledCRed = 98;
        controller.outputStruct.ledCGreen = 195;
        controller.outputStruct.ledCBlue = 26;
      }
    }

    controller.updateDevice();
  });
  controller.setStateChangeEvent('square', (val) => {
    if (val) {
      if (controller.state.r1) {
        r2Trigger.value = 'r-trigger';
        // @ts-ignore
        r2Trigger.onchange({ target: r2Trigger });
      } else if (controller.state.l1) {
        l2Trigger.value = 'l-trigger';
        // @ts-ignore
        l2Trigger.onchange({ target: l2Trigger });
      } else {
        // Blue
        controller.outputStruct.ledCRed = 0;
        controller.outputStruct.ledCGreen = 0;
        controller.outputStruct.ledCBlue = 255;
      }
    }

    controller.updateDevice();
  });
  controller.setStateChangeEvent('circle', (val) => {
    if (val) {
      if (controller.state.r1) {
        r2Trigger.value = 'r-auto-trigger';
        // @ts-ignore
        r2Trigger.onchange({ target: r2Trigger });
      } else if (controller.state.l1) {
        l2Trigger.value = 'l-auto-trigger';
        // @ts-ignore
        l2Trigger.onchange({ target: l2Trigger });
      } else {
        // Red
        controller.outputStruct.ledCRed = 255;
        controller.outputStruct.ledCGreen = 0;
        controller.outputStruct.ledCBlue = 0;
      }
    }

    controller.updateDevice();
  });
  controller.setStateChangeEvent('triangle', (val) => {
    if (val) {
      if (controller.state.r1) {
        r2Trigger.value = 'r-off';
        // @ts-ignore
        r2Trigger.onchange({ target: r2Trigger });
      } else if (controller.state.l1) {
        l2Trigger.value = 'l-off';
        // @ts-ignore
        l2Trigger.onchange({ target: l2Trigger });
      } else {
        // Yellow
        controller.outputStruct.ledCRed = 255;
        controller.outputStruct.ledCGreen = 255;
        controller.outputStruct.ledCBlue = 0;
      }
    }

    controller.updateDevice();
  });
  controller.setStateChangeEvent('l3', (val) => {
    if (val) {
      // Black
      controller.outputStruct.ledCRed = 0;
      controller.outputStruct.ledCGreen = 0;
      controller.outputStruct.ledCBlue = 0;
    }

    controller.updateDevice();
  });
  controller.setStateChangeEvent('r3', (val) => {
    if (val) {
      // White
      controller.outputStruct.ledCRed = 255;
      controller.outputStruct.ledCGreen = 255;
      controller.outputStruct.ledCBlue = 255;
    }

    controller.updateDevice();
  });
  controller.setStateChangeEvent('down', (val) => {
    if (val) {
      controller.outputStruct.playerIndicator = PlayerLedControl.PLAYER_1;
    }

    controller.updateDevice();
  });
  controller.setStateChangeEvent('left', (val) => {
    if (val) {
      controller.outputStruct.playerIndicator = PlayerLedControl.PLAYER_2;
    }

    controller.updateDevice();
  });
  controller.setStateChangeEvent('right', (val) => {
    if (val) {
      controller.outputStruct.playerIndicator = PlayerLedControl.PLAYER_3;
    }

    controller.updateDevice();
  });
  controller.setStateChangeEvent('up', (val) => {
    if (val) {
      controller.outputStruct.playerIndicator = PlayerLedControl.PLAYER_4;
    }

    controller.updateDevice();
  });
  controller.setStateChangeEvent('create', (val) => {
    if (val) {
      controller.outputStruct.playerIndicator = PlayerLedControl.ALL;
    }

    controller.updateDevice();
  });
  controller.setStateChangeEvent('options', (val) => {
    if (val) {
      controller.outputStruct.playerIndicator = PlayerLedControl.OFF;
    }

    controller.updateDevice();
  });
  let ming = (window as any).ming = Infinity;
  let maxg = (window as any).maxg = -Infinity;


  let rotate = (window as any).rt = 0;

  controller.setStateChangeEvent<number>('gyroy', (val) => {
    // controller.outputStruct.playerIndicator = PlayerLedControl.OFF;
    // const newVal = ;
    // rotate = (window as any).rt = (((val / (0xffff)) * 0.1) + rotate);

    if (val > -100 && val < 100) return;

    // rotate = (window as any).rt += (((val - 0x7fff) / 0x7fff)) * 16;
    rotate = (window as any).rt = (new Int16Array([val])[0]) / 0x7fff;

    // if (gyroActive) {
    //   gyro.style.transform = `rotate(${-rotate * 360}deg)`;
    // }

    controller.updateDevice();
  });

  // Send an output report with base info
  controller.updateDevice();
}

// 60 FPS updates
let nextUpdate = performance.now();
let diffUpdate = 1000 / 30;
let rot = (window as any).rt2 = 0;

function update() {
  requestAnimationFrame(update);

  const now = performance.now();

  if (now > nextUpdate) {
    // const DT = now - lastUpdated;
    nextUpdate = now + diffUpdate;
    // lastUpdated = now;

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

    rot = (window as any).rt2 = ((window as any).rt + rot) || 0;
    
    if (gyroActive) {
      gyro.style.transform = `rotate(${-rot * 360}deg)`;
    }
  }
}

update();
