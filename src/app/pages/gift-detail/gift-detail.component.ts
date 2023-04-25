import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gift-detail',
  templateUrl: './gift-detail.component.html',
  styleUrls: ['./gift-detail.component.css']
})
export class GiftDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onCitySelectChange(city: any): void {
    console.log('city', city);
    if(city){
      localStorage.setItem('selectedCityId', city);
      window.location.reload();
    }else{
      localStorage.setItem('selectedCityId', 'PTMLDUiLrIpv8a0agSmi');
    }
  }

}
