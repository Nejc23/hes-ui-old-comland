export const basePathConcentratorInventory = '/api/concentrator-inventory';
export const basePath = '/api/concentrator-inventory-ui';
export const dataConcentratorUnits = `${basePath}/concentrators`;
export const addConcentrator = `${basePathConcentratorInventory}/add-concentrator`;
export const updateConcentrator = `${basePathConcentratorInventory}/update-concentrator`;
export const dcuSync = `${basePath}/sync`;
export const dcuLayout = '/api/dcu-layout';
export const bulkDelete = '/api/dcu-bulk-delete';
export const touConfigurations = '/api/time-of-use/get-time-of-use';
export const schedulerJobs = '/api/scheduler-jobs';
export const activeJobs = '/api/active-jobs';
export const stopJob = 'stop-job';
export const cancelJob = 'cancel-job';

// codelist DCU
export const dcuStatuses = `${basePath}/concentrator-status-codes`;
export const dcuTags = `${basePath}/dcu-tags`;
export const dcuTypes = `${basePath}/concentrator-types`;
export const dcuVendors = `${basePath}/concentrator-vendor-codes`;

// DCU select
export const dcuSelect = `${basePath}/select-concentrators`;
export const dcuForJob = `${basePath}/concentrators-for-job`;

export const removeDcuFromJob = `${basePath}/remove-concentrators-from-job`;
