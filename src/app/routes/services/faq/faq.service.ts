import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(private afs: AngularFirestore) { }

  // Get List
  getFaqList() { 
    return this.afs.collection("faq", ref => ref.orderBy('updated_at','desc')).snapshotChanges();
  }

  // Get Single by Id
  getFaqDetail(id) { 
    return this.afs.collection("faq").doc(id);
  }

  // Add new FAQ
  addFAQ(faq: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("faq").doc(Date.now().toString()).set(faq)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }

  // Delete FAQ
  deleteFAQ(id):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.afs.collection("faq").doc(id).delete()
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    })
  }

  // update FAQ
  updateFAQ(id, faq: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("faq").doc(id).update(faq)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }

}
