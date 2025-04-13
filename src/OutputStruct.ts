import { PlayerLedControl } from "./constants";

export class OutputStruct {
    constructor() { }
    public sort = [
        'validFlag0',
        'validFlag1',
        'bcVibrationRight',
        'bcVibrationLeft',
        'headphoneVolume',
        'speakerVolume',
        'micVolume',
        'audioControl',
        'muteLedControl',
        'powerSaveMuteControl',
        'adaptiveTriggerRightMode',
        'adaptiveTriggerRightParam0',
        'adaptiveTriggerRightParam1',
        'adaptiveTriggerRightParam2',
        'adaptiveTriggerRightParam3',
        'adaptiveTriggerRightParam4',
        'adaptiveTriggerRightParam5',
        'adaptiveTriggerRightParam6',
        'adaptiveTriggerRightParam7',
        'adaptiveTriggerRightParam8',
        'adaptiveTriggerRightParam9',
        'adaptiveTriggerLeftMode',
        'adaptiveTriggerLeftParam0',
        'adaptiveTriggerLeftParam1',
        'adaptiveTriggerLeftParam2',
        'adaptiveTriggerLeftParam3',
        'adaptiveTriggerLeftParam4',
        'adaptiveTriggerLeftParam5',
        'adaptiveTriggerLeftParam6',
        'adaptiveTriggerLeftParam7',
        'adaptiveTriggerLeftParam8',
        'adaptiveTriggerLeftParam9',
        'Reserved0',
        'Reserved1',
        'Reserved2',
        'Reserved3',
        'hapticVolume',
        'audioControl2',
        'validFlag2',
        'Reserved7',
        'Reserved8',
        'lightbarSetup',
        'ledBrightness',
        'playerIndicator',
        'ledCRed',
        'ledCGreen',
        'ledCBlue',
    ] as const

    // 0
    validFlag0 = 0xFF;
    // 1
    validFlag1 = 0xF7;
    // 2
    bcVibrationRight = 0;
    // 3
    bcVibrationLeft = 0;
    // 4
    headphoneVolume = 0;
    // 5
    speakerVolume = 0;
    // 6
    micVolume = 0;
    // 7
    audioControl = 0;
    // 8
    muteLedControl = 0;
    // 9
    powerSaveMuteControl = 0;
    // 10
    adaptiveTriggerRightMode = 0;
    // 11
    adaptiveTriggerRightParam0 = 0;
    // 12
    adaptiveTriggerRightParam1 = 0;
    // 13
    adaptiveTriggerRightParam2 = 0;
    // 14
    adaptiveTriggerRightParam3 = 0;
    // 15
    adaptiveTriggerRightParam4 = 0;
    // 16
    adaptiveTriggerRightParam5 = 0;
    // 17
    adaptiveTriggerRightParam6 = 0;
    // 18
    adaptiveTriggerRightParam7 = 0;
    // 19
    adaptiveTriggerRightParam8 = 0;
    // 20
    adaptiveTriggerRightParam9 = 0;
    // 21
    adaptiveTriggerLeftMode = 0;
    // 22
    adaptiveTriggerLeftParam0 = 0;
    // 23
    adaptiveTriggerLeftParam1 = 0;
    // 24
    adaptiveTriggerLeftParam2 = 0;
    // 25
    adaptiveTriggerLeftParam3 = 0;
    // 26
    adaptiveTriggerLeftParam4 = 0;
    // 27
    adaptiveTriggerLeftParam5 = 0;
    // 28
    adaptiveTriggerLeftParam6 = 0;
    // 29
    adaptiveTriggerLeftParam7 = 0;
    // 30
    adaptiveTriggerLeftParam8 = 0;
    // 31
    adaptiveTriggerLeftParam9 = 0;
    // 32
    Reserved0 = 0;
    // 33
    Reserved1 = 0;
    // 34
    Reserved2 = 0;
    // 35
    Reserved3 = 0;
    // 36
    hapticVolume = 0;
    // 37
    audioControl2 = 0;
    // 38
    validFlag2 = 0;
    // 39
    Reserved7 = 0;
    // 40
    Reserved8 = 0;
    // 41
    lightbarSetup = 0;
    // 42
    ledBrightness = 0;
    // 43
    playerIndicator = PlayerLedControl.PLAYER_1;
    // 44
    ledCRed = 98;
    // 45
    ledCGreen = 195;
    // 46
    ledCBlue = 26;

    get reportData() {
        const length = this.sort.length
        const data = new Uint8Array(length)
        for (let i = 0; i < length; i++) {
            data[i] = this[this.sort[i]];
        }
        return data
    }
}