import { Injectable } from '@angular/core';

let loginType;
let uid;

import { menu } from '../../routes/menu';

@Injectable()
export class MenuService {
    userTypesArr: any;
    constructor() {
        uid = sessionStorage.getItem("uid");
        loginType = sessionStorage.getItem("loginType");
    }

    getMenu() {
        loginType = sessionStorage.getItem("loginType");
        if (loginType != null && loginType != '') {
            this.userTypesArr = {
                "WxAsS1whStfbgdXvxqHs": ["Dashboard", "User Management", "App Users", "Vendor Management", "User Roles", "Stores", "Categories", "Products", "Cities", "Transactions", "FAQ", "App Home Sections", "Occasion", "Tags", "System"],
                "u7GeGmO2luLmkOMKeZ0k": ["dashboard", "Stores", "Products", "Cities", "Transactions", "My Orders"],
            };
            return menu.filter(item => this.userTypesArr[loginType].includes(item.text));
        } else {
            console.log("Somthing wrong!");
        }
    }

}
