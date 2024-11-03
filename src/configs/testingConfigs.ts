export function setTestingConfigs(settingName: string, settingValue: string) {
    testingConfigs['audioSuppressionVolumeLevel'] = parseInt(settingValue);
    console.log("Settings Updated", testingConfigs);
}

interface TestingConfigs {
    audioSuppressionVolumeLevel: number;
}

export const testingConfigs: TestingConfigs = {
    audioSuppressionVolumeLevel: 20,
}