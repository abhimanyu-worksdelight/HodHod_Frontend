import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  constructor(private afs: AngularFirestore) { }

  // Get List
  getCitiesList() {
    return this.afs.collection("cities").snapshotChanges();
  }
  getMyOrdersList() {
    return this.afs.collection(("orders")).snapshotChanges();
    // return this.afs.collection(("orders"), ref => ref.where('itemInfo.vendor_id', '==', "pXZ3231ajB6H483hVmyh").where('redeem_status.is_redeemed', '==', 'true')).snapshotChanges();
  }
  getVendorOrdersList(vId: String) {
    console.log("vidd" + vId)
    return this.afs.collection(("orders"), ref => ref.where('itemInfo.vendor_id', '==', vId)).snapshotChanges();

  }

  // Get Single by Id
  getCitiesDetail(id) {
    return this.afs.collection("cities").doc(id);
  }

  // Add new city
  addCities(city: any): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection("cities").doc(Date.now().toString()).set(city)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        });
    }))
  }

  // Delete city
  deleteCities(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection("cities").doc(id).delete()
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        });
    })
  }

  // update city
  updateCities(id, city: any): Promise<any> {
    return new Promise<any>(((resolve, reject) => {
      this.afs.collection("cities").doc(id).update(city)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        });
    }))
  }

}
