export class MuAdvancedInformation {
  startWithRelease: boolean;
  ldnAsSystitle: boolean;
  authenticationType: AuthenticationTypeEnum;
}

export enum AuthenticationTypeEnum {
  NONE = 'none',
  LOW = 'low',
  HIGH = 'high',
  HIGH_GMAC = 'highgmac'
}
