import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {provideToastr} from 'ngx-toastr';
import {provideAnimations} from '@angular/platform-browser/animations';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {SkipXsrfInterceptor} from './Config/SkipXsrfInterceptor';
import {DemoModeInterceptor} from './Config/DemoModeInterceptor';
import {AuthInterceptor} from './Config/AuthInterceptor';
import {LocationStrategy, PathLocationStrategy} from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    provideAnimations(), provideClientHydration(withEventReplay()),
    { provide: HTTP_INTERCEPTORS, useClass: SkipXsrfInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DemoModeInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ]
};
