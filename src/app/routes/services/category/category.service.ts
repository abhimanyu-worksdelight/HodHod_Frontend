import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  CategoryArr: any[];

  constructor(private afs: AngularFirestore) { }

  // Get List
  getCategoryList() { 
    return this.afs.collection("categories", ref => ref.orderBy('created_at', 'desc')).snapshotChanges();
  }

  // Get Categories by IDs
  getCategoryArrayListById(catArrayId){
    const categoryArrayListById = this.afs.collection("categories",ref => ref.where('id', 'in', catArrayId)).snapshotChanges();
    return categoryArrayListById;
  }

  // Get Single by Id
  getCategoryDetail(id) { 
    return this.afs.collection("categories").doc(id);
  }

  // Add new Category
  addCategory(category: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("categories").doc(Date.now().toString()).set(category)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }

  // Delete Category
  deleteCategory(id):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      this.afs.collection("categories").doc(id).delete()
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    })
  }

  // update Category
  updateCategory(id, category: any):Promise<any> {
    return new Promise<any>(((resolve,reject)=>{
      this.afs.collection("categories").doc(id).update(category)
      .then((res) => {
        resolve(res)
      })
      .catch((error) => {
        reject(error)
      });
    }))
  }

}
