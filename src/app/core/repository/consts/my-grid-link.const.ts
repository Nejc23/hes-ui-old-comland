export enum enumMyGridLink {
  identityTokenServer = '/api/identity-server',
  managment = '/api/concentrator-management',
  dataProcessing = '/api/on-demand-data-processing',
  templating = '/api/templating',
  scheduler = '/api/scheduler',
  inventory = '/api/concentrator-inventory'
}

export const identityToken = '/token';
export const lastStatus = '/last-status';
export const onDemandDisconnect = '/on-demand/trigger-device-disconnect';
export const onDemandConnect = '/on-demand/trigger-device-connect';
export const onDemandDisconnectorState = '/on-demand/trigger-get-disconnector-state';
export const onDemandCiiActivate = '/on-demand/cii/activate';
export const onDemandCiiDeactivate = '/on-demand/cii/deactivate';
export const onDemandCiiState = '/on-demand/cii/state';
export const triggerSetTimeOfUse = '/trigger-set-time-of-use';
export const onDemandData = '/data';
export const importTemplates = '/import-templates';
export const triggerDeviceUpgrade = '/trigger-device-upgrade';
export const triggerConcUpgrade = '/trigger-concentrator-upgrade';
export const activateTriggerDeviceUpgrade = `${triggerDeviceUpgrade}/activate`;
export const getCommonRegisterGroups = `/get-common-register-groups`;
export const onDemandSetMonitor = '/on-demand/trigger-set-device-monitor';
export const onDemandSetLimiter = '/on-demand/trigger-set-limiter';
export const onDemandSetBreakerMode = '/on-demand/trigger-set-breaker-mode';
export const onDemandClearFF = '/on-demand/trigger-clear-ff-register';

export const onDemandRelaysConnect = '/on-demand/relay/connect';
export const onDemandRelaysDisconnect = '/on-demand/relay/disconnect';
export const onDemandRelaysState = '/on-demand/relay/get-state';
export const onDemandRelaysMode = '/on-demand/relay/mode';

export const triggerDataExport = '/trigger-data-export';
export const getDataExportJobs = '/data-export-jobs';

export const linkDeviceTemplate = '/link-device-template';

export const upgrade = '/upgrade';

// security
export const securitySetup = `${enumMyGridLink.templating}/security-setup`;
export const securityEnableHls = `${enumMyGridLink.managment}/security/enable/hls`;
export const securityRekey = `${enumMyGridLink.managment}/security/meter/rekey`;
export const securityChangePassword = `${enumMyGridLink.managment}/security/meter/change-password`;
export const securityConcentratorRekey = `${enumMyGridLink.managment}/security/concentrators/rekey`;

// jobs
export const jobsAssignExisting = `${enumMyGridLink.scheduler}/jobs-meters`;

// synchronize time
export const onDemandTimeSyc = '/on-demand/trigger-clock-sync';

// Import devices
export const importDevices = '/devices/import';
export const activeImports = '/tasks/device-import';

export const updateMeterState = '/update-meters-state';

export const readShortNames = '/on-demand/trigger-read-short-names';

export const meterParamParse = `${enumMyGridLink.managment}/meter-parametrization/parse`;
export const meterParamExecute = `${enumMyGridLink.managment}/meter-parametrization/execute`;

export const importModuleConfigurationSpecific = '/import-module-configuration-channel-specific';
export const getModuleConfigurationCommon = '/get-module-configuration-common';
export const updateModuleConfigurationCommon = '/update-module-configuration-common';
export const getModuleConfigurationChannelSpecific = '/get-module-configuration-channel-specific';
export const deleteModuleConfigurationChannelSpecific = '/delete-module-configuration-channel-specific';
