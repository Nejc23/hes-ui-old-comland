// codelist
export const basePath = '/api/device-inventory-ui';
export const meterUnitStatuses = `${basePath}/meter-unit-state-codes`;
export const meterUnitTags = `/api/codelists/meter-unit-tags`;
export const meterUnitTypes = `${basePath}/meter-unit-types`;
export const meterUnitVendors = `${basePath}/meter-unit-vendor-codes`;
export const meterUnitFirmwares = `${basePath}/meter-unit-firmwares`;
export const meterUnitDisconnectorStates = `${basePath}/meter-unit-disconnector-states`;
export const meterUnitCiiStates = `${basePath}/meter-unit-cii-states`;

// meter units by type
export const meterUnits = `${basePath}/meters`;
export const getMeters = `${meterUnits}/get`;
export const deleteMeters = `${meterUnits}/delete`;
export const meterUnitsBreakerState = `${basePath}/meter-units-breaker-state`;
export const meterUnitsLayout = `layouts`;
export const meterUnitsScheduler = `/api/meter-units-scheduler`;
export const deleteJob = `delete-job`;
export const fwUploadFile = `/api/file-storage/upload`;
export const fwRemoveFile = `fw-remove-file`;
export const fwUpgrade = `fw-upgrade`;
export const touConfigImport = `/api/time-of-use/import-time-of-use`;
export const meterUnitsForJob = `${basePath}/meter-units-for-job`;

export const removeMeterUnitsFromJob = `${basePath}/remove-meter-units-from-job`;
export const registers = `${basePath}/registers`;
export const device = `${basePath}/device`;
// export const updateMeterUnit = `${basePath}/device`;
// export const importDeviceKeys = `${basePath}/crypto/import`;

export const onDemandClearAlarms = '/on-demand/clear-alarms';

export const basePathDcOperations = '/api/concentrator-management';
export const triggerSetDisplaySettings = `${basePathDcOperations}/trigger-set-display-settings`;

export const meterUnitsDeviceMedium = `${basePath}/enums/device-medium`;
export const meterUnitsProtocolType = `${basePath}/enums/protocol-type`;
export const meterUnitsAlarmSeverityType = `${basePath}/enums/alarm-severity-type`;
export const meterUnitsAlarmSourceType = `${basePath}/enums/alarm-source-type`;

export const basePathMuConcentratorInventory = '/api/concentrator-inventory';
export const muCreate = `${basePathMuConcentratorInventory}/meter`;
export const muUpdate = `${basePathMuConcentratorInventory}/meter`;
export const getDevice = `${basePathMuConcentratorInventory}/meter`;

// registers
export const deviceRegisters = `${basePath}/registers/schedulable`;
export const getPropertyData = `${basePath}/get-property-data`;
export const onDemandRegistersType = '/on-demand/registers/type';

// on-demand/read-meter
export const onDemandReadMeter = `/on-demand/read-meter`;
export const templateGroups = `${basePath}/template-groups`;

// Validations
export const validateIpAddress = `${basePathMuConcentratorInventory}/validations/ipaddress`;
