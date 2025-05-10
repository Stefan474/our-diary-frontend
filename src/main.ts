import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { AuthGuard } from './app/guards/auth.guard';
import { importProvidersFrom } from '@angular/core';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(FormsModule, NgIf, NgFor),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
});
