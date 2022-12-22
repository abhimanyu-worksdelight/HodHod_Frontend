import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  constructor(private afs: AngularFirestore) { }

  getSettingDetail(id) { 
    return this.afs.collection("settings").doc(id);
  }

  updateSetting(id, filters: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("settings").doc(id).update(filters)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }
}
