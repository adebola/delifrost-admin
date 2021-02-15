import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {RecaptchaFormsModule, RecaptchaModule} from 'ng-recaptcha';

import { AuthRoutes } from './auth.routing';

import { LoginComponent } from './login/login.component';
import {NotAuthorizedComponent} from './not-authorized/not-authorized.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthRoutes),
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  declarations: [
    LoginComponent,
    NotAuthorizedComponent
  ]
})

export class AuthModule {}
