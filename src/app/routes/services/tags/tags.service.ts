import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private afs: AngularFirestore) { }

  // Get List
  getTagsList() { 
    return this.afs.collection("tags").snapshotChanges();
  }

  // Get Single by Id
  getTagsDetail(id) { 
    return this.afs.collection("tags").doc(id);
  }

  // Add new tags
  addTags(tags: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("tags").doc(Date.now().toString()).set(tags)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }

  // Delete tags
  deleteTags(id):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.afs.collection("tags").doc(id).delete()
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    })
  }

  // update tags
  updateTags(id, tags: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("tags").doc(id).update(tags)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }

}
