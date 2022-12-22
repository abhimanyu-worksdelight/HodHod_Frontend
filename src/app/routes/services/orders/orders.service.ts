import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private afs: AngularFirestore) { }

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

  // Get Single Manager by Id
  getItemListByIds(byAllIds) {

    return new Promise((resolve, reject) => {
      let products = [];

      // Extract unique IDs
      const uniqueItemIds = [...new Set(byAllIds)].filter(val => val != "")

      // Make chunks of array.
      const chunkIds = this.getChunkedArray(uniqueItemIds, 10)
      // console.log("chunkIds", chunkIds);

      chunkIds.forEach((chunk, chunkIdx) => {
        this.afs.collection("products", ref => ref.where(firebase.firestore.FieldPath.documentId(), 'in', chunk)).get().toPromise().then(snapshots => {
          snapshots.forEach(doc => {
            let postdata = {
              data: doc.data(),
              id: doc.id
            }
            products.push(postdata);
          }
          );

          // console.log("products", products);

          if (chunkIds.length == chunkIdx + 1) {
            resolve(products)
          }
        }, err => {
          reject(err)
        })
      })
    })
  }

  // Get Single user by Id
  getUserListByIds(byAllIds) {

    return new Promise((resolve, reject) => {
      let users = [];

      // Extract unique IDs
      const uniqueItemIds = [...new Set(byAllIds)].filter(val => val != "")

      // Make chunks of array.
      const chunkIds = this.getChunkedArray(uniqueItemIds, 10)
      // console.log("chunkIds", chunkIds);

      chunkIds.forEach((chunk, chunkIdx) => {
        this.afs.collection("users", ref => ref.where(firebase.firestore.FieldPath.documentId(), 'in', chunk)).get().toPromise().then(snapshots => {
          snapshots.forEach(doc => {
            let postdata = {
              data: doc.data(),
              id: doc.id
            }
            users.push(postdata);
          }
          );

          // console.log("users", users);

          if (chunkIds.length == chunkIdx + 1) {
            resolve(users)
          }
        }, err => {
          reject(err)
        })
      })
    })
  }

  getOnlyRedeemedOrders() {
    return this.afs.collection("orders", ref => ref.where('redeem_status.is_redeemed', '==', true)).snapshotChanges();
  }
  getPendingOrders() {
    return this.afs.collection("orders", ref => ref.where('redeem_status.is_redeemed', '!=', true)).snapshotChanges();
  }
  getOrdersListSuperAdmin() {
    return this.afs.collection("orders", ref => ref).snapshotChanges();
  }

}
