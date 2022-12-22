import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

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

  // Get Single app shops by Id
  getShopsByIds(deletedByAllIds) {

    return new Promise((resolve, reject) => {
      let shops = []

      // Extract unique IDs
      const uniqueUserIds = [...new Set(deletedByAllIds)].filter(val => val != "")
      // Make chunks of array.
      const chunkIds = this.getChunkedArray(uniqueUserIds, 10);

      chunkIds.forEach((chunk, chunkIdx) => {
        this.afs.collection("shops", ref => ref.where(firebase.firestore.FieldPath.documentId(), 'in', chunk)).get().toPromise().then(snapshots => {

          snapshots.forEach(doc => {
            let postdata = {
              data: doc.data(),
              id: doc.id
            }
            shops.push(postdata);
          }
          );

          if (chunkIds.length == chunkIdx + 1) {
            resolve(shops)
          }

        }, err => {
          reject(err)
        })

      })
    })
  }

  // Get List
  getProductsList() {
    return this.afs.collection("products", ref => ref.where("deleted_at", '==', null).orderBy('updated_at', 'desc')).snapshotChanges();
  }

  // Get Single by Id
  getProductDetail(id) {
    return this.afs.collection("products").doc(id);
  }

  // Add new product
  addProdct(product: any): Promise<any> {
    // return new Promise<any>(((resolve,reject)=>{
    //   this.afs.collection("products").add(product)
    //   .then((res) => {
    //     resolve(res)
    //   })
    //   .catch((error) => {
    //     reject(error)
    //   });
    // }))

    return new Promise<any>(((resolve, reject) => {
      this.afs.collection("products").doc(Date.now().toString()).set(product)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        });
    }))
  }

  // Delete Product
  deleteProduct(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection("products").doc(id).delete()
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        });
    })
  }

  // update Product
  updateProduct(id, product: any): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection("products").doc(id).update(product)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        });
    }))
  }

}
