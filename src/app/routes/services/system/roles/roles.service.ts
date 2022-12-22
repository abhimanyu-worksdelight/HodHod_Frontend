import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private afs: AngularFirestore) { }

  // Get Roles
  getRolesList() { 
    return this.afs.collection("roles", ref => ref.orderBy('updated_at','desc')).snapshotChanges();
  }

  // Get Roles by Id
  getRolesDetail(id) { 
    return this.afs.collection("roles").doc(id);
  }

  // Add new Roles
  addRoles(roles: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("roles").add(roles)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }

  // Delete Roles
  deleteRoles(id):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.afs.collection("roles").doc(id).delete()
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    })
  }

  // update Roles
  updateRoles(id, roles: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("roles").doc(id).update(roles)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }

}
