import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class OccasionsService {

  constructor(private afs: AngularFirestore) { }

  // Get List
  getOccasionsList() { 
    return this.afs.collection("occasions").snapshotChanges();
  }

  // Get Single by Id
  getOccasionsDetail(id) { 
    return this.afs.collection("occasions").doc(id);
  }

  // Add new occasions
  addOccasions(occasions: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("occasions").doc(Date.now().toString()).set(occasions)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }

  // Delete occasions
  deleteOccasions(id):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.afs.collection("occasions").doc(id).delete()
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    })
  }

  // update occasions
  updateOccasions(id, occasions: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("occasions").doc(id).update(occasions)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }

}
