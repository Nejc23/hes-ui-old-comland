export interface IAppConfig {
  apiServer: {
    url: string;
  };
  identityServer: {
    stsAuthority: string;
    clientId: string;
    clientRoot: string;
    clientScope: string;
    clientAutoSilentRenew: boolean;
  };
}
