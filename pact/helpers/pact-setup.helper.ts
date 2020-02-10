import { PactWeb } from '@pact-foundation/pact-web';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { defaultPactSettings, defaultPactTimeout } from './default-pact-setting.helper';
import { defaultAuthProvider } from './default-auth-provider.helper';

export const setupPactProvider = (done: () => void) => {
  const provider = new PactWeb(defaultPactSettings);
  setTimeout(() => {
    done();
  }, defaultPactTimeout);
  return provider;
};

export const pactFinalize = (provider: PactWeb, done: () => void) => {
  provider.finalize().then(() => done());
};

export const pactVerify = (provider: PactWeb, done: () => void) => {
  provider.verify().then(() => done());
};

export const pactSetAngular = () => {
  TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [...defaultAuthProvider]
  });
};
