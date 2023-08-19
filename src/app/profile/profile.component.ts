import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AuthService, User, UserProfile } from '../core/auth.service';
import { Observable, finalize } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  isEditBtnEnable = false;
  private itemDoc: AngularFirestoreDocument<User>;
  item: Observable<User>;
  uid: string;
  userFormData: UserProfile;
  loading = false;
  profileImageUrl: Observable<string>;
  uploadProgress: Observable<number>;
  error: string;

  constructor(
    public auth: AuthService,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private afStorage: AngularFireStorage
  ) {
    this.uid = this.route.snapshot.paramMap.get('id');
    this.profileImageUrl = this.afStorage
      .ref(`users/${this.uid}/profile-image`)
      .getDownloadURL();
  }

  ngOnInit(): void {
    this.itemDoc = this.afs.doc<User>(`users/${this.uid}`);
    this.item = this.itemDoc.valueChanges();

    this.item.subscribe((user) => {
      const displayName = user?.displayName.split(' ');
      this.userFormData = {
        uid: user.uid,
        email: user.email,
        firstName: displayName[0],
        lastName: displayName[1],
        address: user.address,
        phone: user.phone,
      };
    });
  }
  async onSubmit() {
    this.loading = true;
    try {
      await this.auth.updateProfileData(this.userFormData);
      this.isEditBtnEnable = false;
      this.itemDoc = this.afs.doc<User>(`users/${this.uid}`);
      this.item = this.itemDoc.valueChanges();
    } catch (error) {
      this.error = error;
    }
    this.loading = false;
  }

  fileChange(event) {
    this.profileImageUrl = null;
    this.error = null;

    //get the file
    const file = event.target.files[0];
    // Validate file format
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedFormats.includes(file.type)) {
      this.error = 'Only JPEG, JPG, and PNG formats are allowed.';
      return;
    }

    // Validate file size
    const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxFileSize) {
      this.error = 'File size should not exceed 5MB.';
      return;
    }
    //create file refrence
    const filePath = `users/${this.uid}/profile-image`;
    const fileRef = this.afStorage.ref(filePath);

    //upload and store the task
    const task = this.afStorage.upload(filePath, file);
    task.catch((error) => (this.error = error?.message));
    // observe percentage changes
    this.uploadProgress = task.percentageChanges();
    //get notified when image url is available
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.profileImageUrl = fileRef.getDownloadURL();
        })
      )
      .subscribe();
  }
}
