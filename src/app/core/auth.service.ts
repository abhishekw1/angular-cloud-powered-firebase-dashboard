import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    public afs: AngularFirestore
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // login in with email/password
  login(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.routerOnLogin();
          }
        });
      })
      .catch((error) => {
        throw error;
      });
  }

  // Sign up with email/password
  signUp(email: string, password: string, firstName: string, lastName: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.routerOnLogin();
        return result.user
          ?.updateProfile({
            displayName: `${firstName} ${lastName}`,
          })
          .then((uresult) => {
            this.setUserData(result.user);
            return result;
          });
      })
      .catch((error) => {
        throw error;
      });
  }

  logout() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['']);
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null ? true : false;
  }
  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */

  setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      address: '',
      phone: 1234567809,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  updateProfileData(userProfile:UserProfile){
    const userData: User = {
      uid: userProfile.uid,
      email: userProfile.email,
      displayName: `${userProfile.firstName} ${userProfile.lastName}`,
      address: userProfile.address,
      phone: userProfile.phone,
    };
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${userProfile.uid}`
    );
    return userRef.update(userData);
  }

  async routerOnLogin(){
    const user = this.afAuth.currentUser;
    const token = (await user).getIdTokenResult();

    if((await token).claims.admin){
      this.router.navigate(['/users']);
    }else{
      this.router.navigate([`/profile/${(await user).uid}`]);
    }
  }
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  address: string;
  phone: number;
  // emailVerified: boolean;
}

export interface UserProfile{
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: number;
}