// codelist
export const basePath = '/api/device-inventory-ui';
export const meterUnitStatuses = `${basePath}/meter-unit-status-codes`;
export const meterUnitTags = `/api/codelists/meter-unit-tags`;
export const meterUnitTypes = `${basePath}/meter-unit-types`;
export const meterUnitVendors = `${basePath}/meter-unit-vendor-codes`;
export const meterUnitFirmwares = `${basePath}/meter-unit-firmwares`;
export const meterUnitDisconnectorStates = `${basePath}/meter-unit-disconnector-states`;
export const meterUnitCiiStates = `${basePath}/meter-unit-cii-states`;

// meter units by type
export const meterUnits = `${basePath}/meters`;
export const meterUnitsBreakerState = `${basePath}/meter-units-breaker-state`;
export const meterUnitsLayout = `layouts`;
export const meterUnitsScheduler = `/api/meter-units-scheduler`;
export const deleteJob = `delete-job`;
export const fwUploadFile = `/api/file-storage/save-file`;
export const fwRemoveFile = `fw-remove-file`;
export const fwUpgrade = `fw-upgrade`;
export const touConfigImport = `/api/time-of-use/import-time-of-use`;
export const meterUnitsForJob = `${basePath}/meter-units-for-job`;

export const removeMeterUnitsFromJob = `${basePath}/remove-meter-units-from-job`;
export const registers = `${basePath}/registers`;
export const device = `${basePath}/device`;
export const updateMeterUnit = `${basePath}/device`;
// export const importDeviceKeys = `${basePath}/crypto/import`;

export const onDemandClearAlarms = '/on-demand/clear-alarms';

export const basePathDcOperations = '/api/concentrator-management';
export const triggerSetDisplaySettings = `${basePathDcOperations}/trigger-set-display-settings`;
