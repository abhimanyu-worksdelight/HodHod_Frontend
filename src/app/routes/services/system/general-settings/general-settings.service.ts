import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GeneralSettingsService {

  constructor(
    private afs: AngularFirestore,
  ) { }
  
  // general setting query start here---------------
  getGeneralDetail(id) { 
    return this.afs.collection("settings").doc('general');
  }

  updateGeneral(id, generalSettings: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("settings").doc(id).update(generalSettings)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }
  // general setting query end here----------------

  // app pages query start here----------
  getAppPagesList() { 
    return this.afs.collection("settings").doc('app_pages').collection('pages').get();
  }

  updateAppPages(id, appPageData: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("settings").doc("app_pages").collection("pages").doc(id).update(appPageData)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }
  // app pages query end here------------

}
