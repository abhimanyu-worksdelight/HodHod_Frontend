import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-gifts',
  templateUrl: './my-gifts.component.html',
  styleUrls: ['./my-gifts.component.css']
})
export class MyGiftsComponent implements OnInit {

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
