export interface IAppConfig {
  apiServer: {
    url: string;
    fileStorageUrl?: string;
    translationsDebug: boolean;
  };
  identityServer: {
    stsAuthority: string;
    stsAuthorityWeb: string;
    clientId: string;
    clientRoot: string;
    clientScope: string;
    clientAutoSilentRenew: boolean;
  };
}
