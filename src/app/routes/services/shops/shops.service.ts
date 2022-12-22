import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class ShopsService {
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
  getVendersListByIds(byAllIds){

    return new Promise((resolve, reject) => {
      let products = [];
  
      // Extract unique IDs
      const uniqueItemIds = [...new Set(byAllIds)].filter(val => val != "")

      // Make chunks of array.
      const chunkIds = this.getChunkedArray(uniqueItemIds, 10)
      // console.log("chunkIds", chunkIds);

      chunkIds.forEach((chunk, chunkIdx) => { 
        this.afs.collection("vendors", ref => ref.where(firebase.firestore.FieldPath.documentId(), 'in', chunk)).get().toPromise().then(snapshots => {
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

  // Get List
  getShopsList() { 
    return this.afs.collection("shops", ref => ref.where("deleted_at", '==', null).orderBy('updated_at','desc')).snapshotChanges();
  }


  // Get Single by Id
  getShopDetail(id) { 
    return this.afs.collection("shops").doc(id);
  }

  // Add new Shop
  addShop(shop: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("shops").doc(Date.now().toString()).set(shop)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }

  // Delete Shop
  deleteShop(id):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.afs.collection("shops").doc(id).delete()
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    })
  }

  // update Shop
  updateShop(id, shop: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("shops").doc(id).update(shop)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }


}
