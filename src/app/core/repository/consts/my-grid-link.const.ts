export enum enumMyGridLink {
  identityTokenServer = '/api/identity-server',
  managment = '/api/concentrator-management',
  dataProcessing = '/api/on-demand-data-processing',
  templating = '/api/templating'
}

export const identityToken = '/token';
export const lastStatus = '/last-status';
export const onDemandDisconnect = '/on-demand/trigger-device-disconnect';
export const onDemandConnect = '/on-demand/trigger-device-connect';
export const onDemandDisconnectorState = '/on-demand/trigger-get-disconnector-state';
export const triggerSetTimeOfUse = '/trigger-set-time-of-use';
export const onDemandData = '/data';
export const importTemplates = '/import-templates';
export const triggerDeviceUpgrade = '/trigger-device-upgrade';
export const activateTriggerDeviceUpgrade = `${triggerDeviceUpgrade}/activate`;
export const onDemandSetMonitor = '/on-demand/trigger-set-device-monitor';
export const onDemandSetLimiter = '/on-demand/trigger-set-limiter';
export const onDemandSetBreakerMode = '/on-demand/trigger-set-breaker-mode';
export const getRegisters = '/get-registers';
