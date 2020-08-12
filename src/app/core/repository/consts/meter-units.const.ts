// codelist
export const basePath = '/api/device-inventory-ui';
export const meterUnitStatuses = `${basePath}/meter-unit-status-codes`;
export const meterUnitTags = `/api/codelists/meter-unit-tags`;
export const meterUnitTypes = `${basePath}/meter-unit-types`;
export const meterUnitVendors = `${basePath}/meter-unit-vendor-codes`;
export const meterUnitFirmwares = `/api/codelists/meter-unit-firmwares`;
export const meterUnitBreakerStates = `/api/codelists/meter-unit-breaker-states`;

// meter units by type
export const meterUnits = `${basePath}/meter-units`;
export const meterUnitsBreakerState = `${basePath}/meter-units-breaker-state`;
export const meterUnitsLayout = `layouts`;
export const meterUnitsScheduler = `/api/meter-units-scheduler`;
export const deleteJob = `delete-job`;
export const fwUploadFile = `/api/file-storage/save-file`;
export const fwRemoveFile = `fw-remove-file`;
export const fwUpgrade = `fw-upgrade`;
export const touConfigImport = `/api/time-of-use/import-time-of-use`;
export const meterUnitsForJob = `${basePath}/meter-units-for-job`;

export const registers = `${basePath}/registers`;
export const importDeviceKeys = `${basePath}/crypto/import`;
