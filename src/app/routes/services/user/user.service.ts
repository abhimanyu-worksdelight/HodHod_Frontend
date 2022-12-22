import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import "firebase/functions";
@Injectable({
  providedIn: 'root'
})
export class UserService {

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


  constructor(private afs: AngularFirestore) { }

  // Get Users List
  getUserList() {
    // return this.afs.collection("users", ref => ref.where("type", "!=", "u7GeGmO2luLmkOMKeZ0k").where("deleted_at", '==', null)).snapshotChanges();
    return this.afs.collection("users", ref => ref.where("deleted_at", '==', null)).snapshotChanges();
  }

  // Get Single Users by Id
  getUserListByIds(userIds) {

    return new Promise((resolve, reject) => {
      let users = []

      // Extract unique IDs
      const uniqueUserIds = [...new Set(userIds)].filter(val => val != "");

      // Make chunks of array.
      const chunkIds = this.getChunkedArray(uniqueUserIds, 10)

      chunkIds.forEach((chunk, chunkIdx) => {

        this.afs.collection('Users', ref => ref.where('userId', 'in', chunk))
          .get()
          .toPromise()
          .then(snapshots => {
            let list = snapshots.docs.map(doc => doc.data())

            users = [...users, ...list]

            if (chunkIds.length == chunkIdx + 1) {
              resolve(users)
            }
          }, err => {
            reject(err)
          })
      })
    })
  }

  // Get Single User by Id
  getUserDetail(id) {
    return this.afs.collection("users").doc(id);
  }

  // Add new User
  addUser(user: any): Promise<any> {
    // return new Promise<any>(((resolve, reject) => {

    //   this.afs.collection("users").doc(user.id).set(user)
    //   .then((res) => {
    //     resolve(res)
    //   })
    //   .catch((error) => {
    //     reject(error)
    //   });
    // }))
    return new Promise<any>(((resolve, reject) => {

      this.afs.collection("users").doc(Date.now().toString()).set(user)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        });
    }))
  }

  // soft delete single User
  softDeleteSingleUser(user_id, productData: any) {
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection("users").doc(user_id).update(productData)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        });
    }))
  }

  // soft delete multiple User
  softDeleteMultipleUser(productData: any) {
    return new Promise<any>(((resolve, reject) => {
      const productMultipleData = {
        deleted_at: firebase.firestore.FieldValue.serverTimestamp(), //date and time
        deleted_by: productData.deleted_by, // id
        disabled: true,
        deleted_by_user_type: productData.deleted_by_user_type // login by whome
      }
      this.afs.collection("users").doc(productData.id).update(productMultipleData)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        });
    }))
  }

  // Delete User
  // deleteUser(id):Promise<any>{
  //   return new Promise<any>((resolve, reject) => {
  //     this.afs.collection("users").doc(id).delete()
  //     .then((res) => {
  //       resolve(res)
  //     })
  //     .catch((error) => {
  //       reject(error)
  //     });
  //   })
  // }

  // update User
  updateUser(id, user: any): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection("users").doc(id).update(user)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        });
    }))
  }
}
