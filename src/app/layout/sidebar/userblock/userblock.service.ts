import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class UserblockService {
    public userBlockVisible: boolean;
    constructor(private afs: AngularFirestore) {
        // initially visible
        this.userBlockVisible  = true;
    }

    getVisibility() {
        return this.userBlockVisible;
    }
    setVisibility(stat = true) {
        this.userBlockVisible = stat;
    }
    toggleVisibility() {
        this.userBlockVisible = !this.userBlockVisible;
    }

    // display user detail start--------
    getCurrentUserLoginDetail() { 
        return this.afs.collection("users").snapshotChanges();
    }
    // display user detail end--------

}
