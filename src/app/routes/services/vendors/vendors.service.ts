import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import "firebase/functions";
@Injectable({
  providedIn: 'root'
})

export class VendorsService {

  constructor(private afs: AngularFirestore) { }

  // Get List
  getVendorsList() {
    return this.afs.collection("vendors", ref => ref.where("deleted_at", '==', null).orderBy('updated_at', 'desc')).snapshotChanges();
  }

  getVendorStores(vendorId: String) {
    return this.afs.collection("shops", ref => ref.where("vendor_id", '==', vendorId).where("is_enabled", '==', true)).snapshotChanges();
  }
  getVendorProducts(vendorId: String) {
    return this.afs.collection("products", ref => ref.where("vendor_id", '==', vendorId).where("is_enabled", '==', true)).snapshotChanges();
  }

  // Get Single by Id
  getVendorDetail(id) {
    return this.afs.collection("vendors").doc(id);
  }

  // Add new Vendor
  addVendor(vendor: any): Promise<any> {
    // return new Promise<any>(((resolve, reject) => {
    //   this.afs.collection("vendors").add(vendor)
    //     .then((res) => {
    //       resolve(res)
    //     })
    //     .catch((error) => {
    //       reject(error)
    //     });
    // }))
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection("vendors").doc(Date.now().toString()).set(vendor)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        });
    }))
  }

  softDeleteSingleProduct(product_id, productData: any) {
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection("vendors").doc(product_id).update(productData)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        });
    }))
  }

  softDeleteMultipleProduct(productData: any) {
    return new Promise<any>(((resolve, reject) => {
      const productMultipleData = {
        deleted_at: firebase.firestore.FieldValue.serverTimestamp(), //date and time
        deleted_by: productData.deleted_by, // id
        disabled: true,
        deleted_by_user_type: productData.deleted_by_user_type // login by whome
      }
      this.afs.collection("vendors").doc(productData.id).update(productMultipleData)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        });
    }))
  }

  // update Vendor
  updateVendor(id, vendor: any): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection("vendors").doc(id).update(vendor)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        });
    }))
  }

}
