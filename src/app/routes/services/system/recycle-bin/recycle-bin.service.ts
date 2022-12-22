import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RecycleBinService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  // Used for chunking Array.
  getChunkedArray = (array, chunkSize) => {
    var index = 0;
    var arrayLength = array.length;
    var tempArray = [];
  
    for (index = 0; index < arrayLength; index += chunkSize) {
      const newChunk = array.slice(index, index + chunkSize)
      tempArray.push(newChunk)
    }
    return tempArray;
  }

  // Get Single app user by Id
  getUserListByIds(deletedByAllIds){

    return new Promise((resolve, reject) => {
      let users = []
  
      // Extract unique IDs
      const uniqueUserIds = [...new Set(deletedByAllIds)].filter(val => val != "")

      // Make chunks of array.
      const chunkIds = this.getChunkedArray(uniqueUserIds, 10)

      chunkIds.forEach((chunk, chunkIdx) => {
        
        this.afs.collection("users", ref => ref.where('uid', 'in', chunk)).get().toPromise().then(snapshots => {
          
          let list = snapshots.docs.map(doc => doc.data());

          users = [...users, ...list];

          if (chunkIds.length == chunkIdx + 1) {
            resolve(users)
          }
        }, err => {
          reject(err)
        })
      })
    })
  }

  // Get Single app user by Id
  getVendorListByIds(deletedByAllIds){

    return new Promise((resolve, reject) => {
      let appusers = []
  
      // Extract unique IDs
      const uniqueUserIds = [...new Set(deletedByAllIds)].filter(val => val != "");

      // Make chunks of array.
      const chunkIds = this.getChunkedArray(uniqueUserIds, 10);

      chunkIds.forEach((chunk, chunkIdx) => {
        
        this.afs.collection("vendors", ref => ref.where('uid', 'in', chunk)).get().toPromise().then(snapshots => {
          
          let list = snapshots.docs.map(doc => doc.data());

          appusers = [...appusers, ...list];

          if (chunkIds.length == chunkIdx + 1) {
            resolve(appusers)
          }
        }, err => {
          reject(err)
        })
      })
    })
  }

  // restore appuser data
  restoreAppuser(user_id, updateAppuserData){
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("users").doc(user_id).update(updateAppuserData)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }

  // restore appuser data
  restoreVendor(user_id, updateAppuserData){
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("vendors").doc(user_id).update(updateAppuserData)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }

  // delete appuser data
  deleteAppuser(user_id):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.afs.collection("users").doc(user_id).delete()
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    })
  }

  // delete vendor data
  deleteVendor(user_id):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.afs.collection("vendors").doc(user_id).delete()
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    })
  }

}
