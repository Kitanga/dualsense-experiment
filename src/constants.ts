export const VENDOR_ID_SONY = 0x054c;
export const PRODUCT_ID_DUAL_SENSE = 0x0ce6;
export const PS5_OPTIONS = {
    vendorId: VENDOR_ID_SONY,
    productId: PRODUCT_ID_DUAL_SENSE
};

export const USAGE_PAGE_GENERIC_DESKTOP = 0x0001;
export const USAGE_ID_GD_GAME_PAD = 0x0005;

// Expected report sizes, not including the report ID byte.
export const DUAL_SENSE_USB_INPUT_REPORT_0x01_SIZE = 63;
export const DUAL_SENSE_BT_INPUT_REPORT_0x01_SIZE = 9;
export const DUAL_SENSE_BT_INPUT_REPORT_0x31_SIZE = 77;

export enum ConnectionType {
    USB = 'usb',
    BLUETOOTH = 'bluetooth',
}

export const FPS = 60;

// Controller specific info

export enum PS5DualSenseAdaptiveTriggerModes {
    OFF = 0x00,
    RESISTANCE = 0x01,
    TRIGGER = 0x02,
    AUTO_TRIGGER = 0x06,
}

export const PS5DualSenseAdaptiveTriggerStates = {
    [PS5DualSenseAdaptiveTriggerModes.RESISTANCE]: [
        // Start pos 0 - 255
        34,
        // Force
        170,
    ],
    [PS5DualSenseAdaptiveTriggerModes.TRIGGER]: [
        // Start
        14,
        // End
        140,
        // Force
        255,
    ],
    [PS5DualSenseAdaptiveTriggerModes.AUTO_TRIGGER]: [
        // Frequency
        14,
        // Force
        255,
        // Start
        14
    ],
}

export enum PlayerLedControl {
    OFF = 0x00,
    PLAYER_1 = 0x04,
    PLAYER_2 = 0x0A,
    PLAYER_3 = 0x15,
    PLAYER_4 = 0x1B,
    ALL = 0x1F,
}
