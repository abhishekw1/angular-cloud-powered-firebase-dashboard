import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { UserProfile } from '../core/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  private userCollection: AngularFirestoreCollection<UserProfile>;
  users: Observable<UserProfile[]>;
  constructor(private afs: AngularFirestore) {
    this.userCollection= afs.collection<UserProfile>('users');
    this.users = this.userCollection.valueChanges();
  }
  ngOnInit(): void {}
}
