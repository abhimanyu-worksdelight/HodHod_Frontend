"use strict";(self.webpackChunkng2angle=self.webpackChunkng2angle||[]).push([[592],{5195:(v,_,c)=>{c.d(_,{H:()=>u});var h=c(4650),f=c(8064);let u=(()=>{class i{constructor(s){this.afs=s}getCategoryList(){return this.afs.collection("categories",s=>s.orderBy("created_at","desc")).snapshotChanges()}getCategoryArrayListById(s){return this.afs.collection("categories",e=>e.where("id","in",s)).snapshotChanges()}getCategoryDetail(s){return this.afs.collection("categories").doc(s)}addCategory(s){return new Promise((o,e)=>{this.afs.collection("categories").add(s).then(t=>{o(t)}).catch(t=>{e(t)})})}deleteCategory(s){return new Promise((o,e)=>{this.afs.collection("categories").doc(s).delete().then(t=>{o(t)}).catch(t=>{e(t)})})}updateCategory(s,o){return new Promise((e,t)=>{this.afs.collection("categories").doc(s).update(o).then(r=>{e(r)}).catch(r=>{t(r)})})}}return i.\u0275fac=function(s){return new(s||i)(h.LFG(f.ST))},i.\u0275prov=h.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})()},2668:(v,_,c)=>{c.d(_,{e:()=>u});var h=c(4650),f=c(8064);let u=(()=>{class i{constructor(s){this.afs=s}getCitiesList(){return this.afs.collection("cities").snapshotChanges()}getMyOrdersList(){return this.afs.collection("orders").snapshotChanges()}getVendorOrdersList(s){return console.log("vidd"+s),this.afs.collection("orders",o=>o.where("itemInfo.vendor_id","==",s)).snapshotChanges()}getCitiesDetail(s){return this.afs.collection("cities").doc(s)}addCities(s){return new Promise((o,e)=>{this.afs.collection("cities").add(s).then(t=>{o(t)}).catch(t=>{e(t)})})}deleteCities(s){return new Promise((o,e)=>{this.afs.collection("cities").doc(s).delete().then(t=>{o(t)}).catch(t=>{e(t)})})}updateCities(s,o){return new Promise((e,t)=>{this.afs.collection("cities").doc(s).update(o).then(r=>{e(r)}).catch(r=>{t(r)})})}}return i.\u0275fac=function(s){return new(s||i)(h.LFG(f.ST))},i.\u0275prov=h.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})()},4632:(v,_,c)=>{c.d(_,{s:()=>i});var h=c(5867),f=c(4650),u=c(8064);let i=(()=>{class d{constructor(o){this.afs=o,this.getChunkedArray=(e,t)=>{var r=0,n=e.length,a=[];for(r=0;r<n;r+=t){const l=e.slice(r,r+t);a.push(l)}return a}}getShopsByIds(o){return new Promise((e,t)=>{let r=[];const n=[...new Set(o)].filter(l=>""!=l),a=this.getChunkedArray(n,10);a.forEach((l,P)=>{this.afs.collection("shops",g=>g.where(h.Z.firestore.FieldPath.documentId(),"in",l)).get().toPromise().then(g=>{g.forEach(p=>{let E={data:p.data(),id:p.id};r.push(E)}),a.length==P+1&&e(r)},g=>{t(g)})})})}getProductsList(){return this.afs.collection("products",o=>o.where("deleted_at","==",null).orderBy("updated_at","desc")).snapshotChanges()}getProductDetail(o){return this.afs.collection("products").doc(o)}addProdct(o){return new Promise((e,t)=>{this.afs.collection("products").add(o).then(r=>{e(r)}).catch(r=>{t(r)})})}deleteProduct(o){return new Promise((e,t)=>{this.afs.collection("products").doc(o).delete().then(r=>{e(r)}).catch(r=>{t(r)})})}updateProduct(o,e){return new Promise((t,r)=>{this.afs.collection("products").doc(o).update(e).then(n=>{t(n)}).catch(n=>{r(n)})})}}return d.\u0275fac=function(o){return new(o||d)(f.LFG(u.ST))},d.\u0275prov=f.Yz7({token:d,factory:d.\u0275fac,providedIn:"root"}),d})()},9365:(v,_,c)=>{c.d(_,{n:()=>i});var h=c(5867),f=c(4650),u=c(8064);let i=(()=>{class d{constructor(o){this.afs=o,this.getChunkedArray=(e,t)=>{var r=0,n=e.length,a=[];for(r=0;r<n;r+=t){const l=e.slice(r,r+t);a.push(l)}return a}}getVendersListByIds(o){return new Promise((e,t)=>{let r=[];const n=[...new Set(o)].filter(l=>""!=l),a=this.getChunkedArray(n,10);a.forEach((l,P)=>{this.afs.collection("vendors",g=>g.where(h.Z.firestore.FieldPath.documentId(),"in",l)).get().toPromise().then(g=>{g.forEach(p=>{let E={data:p.data(),id:p.id};r.push(E)}),a.length==P+1&&e(r)},g=>{t(g)})})})}getShopsList(){return this.afs.collection("shops",o=>o.where("deleted_at","==",null).orderBy("updated_at","desc")).snapshotChanges()}getShopDetail(o){return this.afs.collection("shops").doc(o)}addShop(o){return new Promise((e,t)=>{this.afs.collection("shops").add(o).then(r=>{e(r)}).catch(r=>{t(r)})})}deleteShop(o){return new Promise((e,t)=>{this.afs.collection("shops").doc(o).delete().then(r=>{e(r)}).catch(r=>{t(r)})})}updateShop(o,e){return new Promise((t,r)=>{this.afs.collection("shops").doc(o).update(e).then(n=>{t(n)}).catch(n=>{r(n)})})}}return d.\u0275fac=function(o){return new(o||d)(f.LFG(u.ST))},d.\u0275prov=f.Yz7({token:d,factory:d.\u0275fac,providedIn:"root"}),d})()},5870:(v,_,c)=>{c.d(_,{i:()=>u});var h=c(4650),f=c(8064);let u=(()=>{class i{constructor(s){this.afs=s}getTagsList(){return this.afs.collection("tags").snapshotChanges()}getTagsDetail(s){return this.afs.collection("tags").doc(s)}addTags(s){return new Promise((o,e)=>{this.afs.collection("tags").add(s).then(t=>{o(t)}).catch(t=>{e(t)})})}deleteTags(s){return new Promise((o,e)=>{this.afs.collection("tags").doc(s).delete().then(t=>{o(t)}).catch(t=>{e(t)})})}updateTags(s,o){return new Promise((e,t)=>{this.afs.collection("tags").doc(s).update(o).then(r=>{e(r)}).catch(r=>{t(r)})})}}return i.\u0275fac=function(s){return new(s||i)(h.LFG(f.ST))},i.\u0275prov=h.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})()},4606:(v,_,c)=>{c.d(_,{K:()=>d});var h=c(5867),u=(c(6776),c(4650)),i=c(8064);let d=(()=>{class s{constructor(e){this.afs=e,this.getChunkedArray=(t,r)=>{var n=0,a=t.length,l=[];for(n=0;n<a;n+=r){const P=t.slice(n,n+r);l.push(P)}return l}}getUserList(){return this.afs.collection("users",e=>e.where("deleted_at","==",null)).snapshotChanges()}getUserListByIds(e){return new Promise((t,r)=>{let n=[];const a=[...new Set(e)].filter(P=>""!=P),l=this.getChunkedArray(a,10);l.forEach((P,g)=>{this.afs.collection("Users",p=>p.where("userId","in",P)).get().toPromise().then(p=>{let E=p.docs.map(y=>y.data());n=[...n,...E],l.length==g+1&&t(n)},p=>{r(p)})})})}getUserDetail(e){return this.afs.collection("users").doc(e)}addUser(e){return new Promise((t,r)=>{this.afs.collection("users").doc(e.id).set(e).then(n=>{t(n)}).catch(n=>{r(n)})})}softDeleteSingleUser(e,t){return new Promise((r,n)=>{this.afs.collection("users").doc(e).update(t).then(a=>{r(a)}).catch(a=>{n(a)})})}softDeleteMultipleUser(e){return new Promise((t,r)=>{const n={deleted_at:h.Z.firestore.FieldValue.serverTimestamp(),deleted_by:e.deleted_by,disabled:!0,deleted_by_user_type:e.deleted_by_user_type};this.afs.collection("users").doc(e.id).update(n).then(a=>{t(a)}).catch(a=>{r(a)})})}updateUser(e,t){return new Promise((r,n)=>{this.afs.collection("users").doc(e).update(t).then(a=>{r(a)}).catch(a=>{n(a)})})}}return s.\u0275fac=function(e){return new(e||s)(u.LFG(i.ST))},s.\u0275prov=u.Yz7({token:s,factory:s.\u0275fac,providedIn:"root"}),s})()},4924:(v,_,c)=>{c.d(_,{m:()=>d});var h=c(5867),u=(c(6776),c(4650)),i=c(8064);let d=(()=>{class s{constructor(e){this.afs=e}getVendorsList(){return this.afs.collection("vendors",e=>e.where("deleted_at","==",null).orderBy("updated_at","desc")).snapshotChanges()}getVendorDetail(e){return this.afs.collection("vendors").doc(e)}addVendor(e){return new Promise((t,r)=>{this.afs.collection("vendors").add(e).then(n=>{t(n)}).catch(n=>{r(n)})})}softDeleteSingleProduct(e,t){return new Promise((r,n)=>{this.afs.collection("vendors").doc(e).update(t).then(a=>{r(a)}).catch(a=>{n(a)})})}softDeleteMultipleProduct(e){return new Promise((t,r)=>{const n={deleted_at:h.Z.firestore.FieldValue.serverTimestamp(),deleted_by:e.deleted_by,disabled:!0,deleted_by_user_type:e.deleted_by_user_type};this.afs.collection("vendors").doc(e.id).update(n).then(a=>{t(a)}).catch(a=>{r(a)})})}updateVendor(e,t){return new Promise((r,n)=>{this.afs.collection("vendors").doc(e).update(t).then(a=>{r(a)}).catch(a=>{n(a)})})}}return s.\u0275fac=function(e){return new(e||s)(u.LFG(i.ST))},s.\u0275prov=u.Yz7({token:s,factory:s.\u0275fac,providedIn:"root"}),s})()}}]);