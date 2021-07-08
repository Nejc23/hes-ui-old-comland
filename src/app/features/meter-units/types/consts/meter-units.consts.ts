export const readStatusColor = {
  red: 'red',
  yellow: 'yellow',
  green: 'green'
};

export const jobStatus = {
  running: 'running',
  pending: 'pending',
  success: 'success',
  failed: 'failed'
};

export const InstantValues = {
  connected: '1',
  readyForConnection: '2',
  disconnected: '0'
};

export enum DisconnectorStateEnum {
  CONNECTED = 'Connected',
  READY = 'ReadyForReConnection',
  DISCONNECTED = 'Disconnected',
  UNDEFINED = 'UndefinedState'
}
