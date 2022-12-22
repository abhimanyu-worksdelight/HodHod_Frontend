import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class HomeSectionsService {

  constructor(private afs: AngularFirestore) { }

  // Get List
  getHomeSectionsList() { 
    return this.afs.collection("homeSections").snapshotChanges();
  }

  // Get Single by Id
  getHomeSectionsDetail(id) { 
    return this.afs.collection("homeSections").doc(id);
  }

  // Add new homeSections
  addHomeSections(homeSections: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("homeSections").doc(Date.now().toString()).set(homeSections)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }

  // Delete homeSections
  deleteHomeSections(id):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.afs.collection("homeSections").doc(id).delete()
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    })
  }

  // update homeSections
  updateHomeSections(id, homeSections: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("homeSections").doc(id).update(homeSections)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }
  
}
