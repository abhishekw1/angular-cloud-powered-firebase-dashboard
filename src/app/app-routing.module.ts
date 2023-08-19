import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import {
  AngularFireAuthGuard,
  customClaims,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';
import { map, pipe } from 'rxjs';
import { UsersComponent } from './users/users.component';

// const redirectUnauthorizedToToLogin = () => redirectUnauthorizedTo(['']);

// const redirectUnauthorizedToProfile = () =>
//   map((user) => (user ? ['profile', (user as any).uid] : true));

// const onlyAllowSelf = (next) =>
//   map((user) => (!!user && next.params.id == (user as any).uid) || ['']);

const adminOnly = () =>
  pipe(
    customClaims,
    map((claims) => claims.admin === true || [''])
  );

const redirectLoggedInToProfileOrUsers = () =>
  pipe(
    customClaims,
    map((claims) => {
      if (claims.length === 0) {
        return true;
      }

      if (claims.admin) {
        return ['users'];
      }

      return ['profile', claims.user_id];
    })
  );

const allowOnlySelfOrAdmin = (next) =>
  pipe(
    customClaims,
    map((claims) => {
      if ((claims.length = 0)) {
        return [''];
      }

      return next.params.id === claims.user_id || claims.admin;
    })
  );

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToProfileOrUsers },
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: allowOnlySelfOrAdmin },
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: adminOnly },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
