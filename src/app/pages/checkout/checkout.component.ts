import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../../services/home/home.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import axios from 'axios';
import { Observable } from 'rxjs';
import "firebase/functions";
import { ajax } from 'jquery';
import 'firebase/functions';
import firebase from 'firebase/compat/app';
import 'firebase/compat/functions';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  id: string = '';
  quantity: any = '';
  productDetail: any = [];
  totalPrice: any;
  occasionData: any = [];

  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    // get id and quantity from url
    this.id = this.route.snapshot.params['id'];
    this.quantity = this.route.snapshot.params['quantity'];

    this.homeService.getProductDetail(this.id).then((doc) => {
      if (doc) {
        this.productDetail = doc[0];
        // console.log('this.productDetail', this.productDetail);

        // total product price
        if (this.productDetail.data.price) {
          this.totalPrice = this.productDetail.data.price * this.quantity;

        } else {
          this.totalPrice = 0;
        }
      }
    });

    // get occasion list data
    this.getOccasionList();






  }

  getOccasionList() {
    this.homeService.getOccasionList().then((res) => {
      if (res.length) {
        this.occasionData = [];
        res.forEach((item: any) => {
          this.occasionData.push({
            id: item.id,
            data: item.data()
          });
        });
        console.log('this.occasionData', this.occasionData);
      }
    });
  }


  onClickPay() {
    const querystring = require('querystring-es3');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const url = 'https://test.oppwa.com/v1/checkouts';

    const data = querystring.stringify({
      'entityId': '8ac7a4c77d044303017d04cba9a501ab',
      'amount': '100',
      'currency': 'SAR',
      'paymentType': 'DB'
    });

    // Send POST request using HttpClient
    try {
      const response = this.http.post(url, data, { headers: headers }).subscribe();
      console.log('API Response:', response);
    } catch (error) {
      console.log('API Error:', error);
    }








    //   const https = require('https-browserify');
    //   const querystring = require('querystring-es3');

    //   const request = async () => {
    //     const path = '/v1/checkouts';
    //     const data = querystring.stringify({
    //       'entityId': '8a8294174d0595bb014d05d82e5b01d2',
    //       'amount': '92.00',
    //       'currency': 'EUR',
    //       'paymentType': 'DB'
    //     });
    //     const options = {
    //       port: 443,
    //       host: 'test.oppwa.com',
    //       path: path,
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         'Content-Length': data.length,
    //         'Authorization': 'Bearer OGE4Mjk0MTc0ZDA1OTViYjAxNGQwNWQ4MjllNzAxZDF8OVRuSlBjMm45aA=='
    //       }
    //     };
    //     return new Promise((resolve, reject) => {
    //       const postRequest = https.request(options, function (res: any) {
    //         const buf: any = [];
    //         res.on('data', (chunk: any): void => {
    //           buf.push(Buffer.from(chunk));
    //         });
    //         res.on('end', () => {
    //           const jsonString = Buffer.concat(buf).toString('utf8');
    //           try {
    //             resolve(JSON.parse(jsonString));
    //           } catch (error) {
    //             reject(error);
    //           }
    //         });
    //       });
    //       postRequest.on('error', reject);
    //       postRequest.write(data);
    //       postRequest.end();
    //     });
    //   };

    //   request().then(console.log).catch(console.error);
  };



  initiateBulkOrderWebHook() {


    // ajax({
    //   url: "https://test.oppwa.com/v1/checkouts",
    //   type: "POST",
    //   data: { amount: 100, currency: "SAR", paymentType: "DB", entityId: "8ac7a4c77d044303017d04cba9a501ab" },
    //   headers: { "Authorization": 'Bearer OGFjN2E0Yzc3ZDA0NDMwMzAxN2QwNGNhYzAwMjAxYTJ8ZFJNOFA4N2F3Uw==' },
    //   success: function (data: any) {
    //     console.log(data);
    //   }
    // });
    this.makePayment();

  }

  makePayment() {
    const processPayment = firebase.functions().httpsCallable('processPayment');

    // const processPayment = firebase.functions().httpsCallable('processPayment');
    processPayment().then((result: any) => {
      if (result) {
        console.log("Function Result Success...", result)
      } else {
        console.log("Function Result Error...", result)
      }
    });
    const https = require('https');
    const querystring = require('querystring');
    const request = async () => {
      const path = '/v1/payments';
      const data = querystring.stringify({
        'entityId': '8a8294174d0595bb014d05d829cb01cd',
        'amount': '92.00',
        'currency': 'EUR',
        'paymentBrand': 'VISA',
        'paymentType': 'CD',
        'card.number': '4200000000000000',
        'card.expiryMonth': '12',
        'card.expiryYear': '2024',
        'card.holder': 'Jane Jones'
      });
      const options = {
        port: 443,
        host: 'test.oppwa.com',
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': data.length,
          'Authorization': 'Bearer OGE4Mjk0MTc0ZDA1OTViYjAxNGQwNWQ4MjllNzAxZDF8OVRuSlBjMm45aA=='
        }
      };
      return new Promise((resolve, reject) => {
        const postRequest = https.request(options, function (res: any) {
          const buf: any = [];
          res.on('data', (chunk: any) => {
            buf.push(Buffer.from(chunk));
          });
          res.on('end', () => {
            const jsonString = Buffer.concat(buf).toString('utf8');
            try {
              resolve(JSON.parse(jsonString));
            } catch (error) {
              reject(error);
            }
          });
        });
        postRequest.on('error', reject);
        postRequest.write(data);
        postRequest.end();
      });
    };
    request().then(console.log).catch(console.error);


    // var axios = require('axios');
    // var qs = require('qs');
    // var data = qs.stringify({
    //   'entityId': '8a8294174d0595bb014d05d82e5b01d2',
    //   'amount': '92.00',
    //   'currency': 'EUR',
    //   'paymentBrand': 'VISA',
    //   'paymentType': 'CD',
    //   'card.number': '4200000000000000',
    //   'card.expiryMonth': '12',
    //   'card.expiryYear': '2024',
    //   'card.holder': 'Jane Jones'
    // });
    // var config = {
    //   method: 'post',
    //   url: 'https://test.oppwa.com/v1/payments',
    //   headers: {
    //     'Authorization': 'Bearer OGE4Mjk0MTc0ZDA1OTViYjAxNGQwNWQ4MjllNzAxZDF8OVRuSlBjMm45aA==',
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     'Cookie': 'ak_bmsc=1200B68BB653300DB29108FB1B581590~000000000000000000000000000000~YAAQTF06F/mxyaGHAQAAu1JiohN5BEtKCA6dzmA8TE6mW7R8gU2JD32BmtGuhi6XSMhTPao+jqrRNcUH2XG44aACNcx83IxP4UsxwxZdkQL2/Voxa5DL5n2dE57QyXrq4V4TOS6zWrzDwSfGLK2c5WnSJnK7l6F7BVHAvLbt6Ls+WST0yIL7sCJmeKd0CKZLWeKj/VBsCLwy93disY2zeNW37SXV28H995t0kBm39zK2jXCD/YkwV7jXeBFtXbbE5N03ln/gLqYFuxmqxVSAwG/mAlvKJAAt7bFXaoTvNzvBm8di+4wwOYYhnc7AwI5c32z7NjRdspqm/LribqeW7KwIK3Hi4dWKkUGzfy2g2W/R8o+FrJHm3TXo3lc=; bm_sv=BF25F92750A2B6C8E0E745B1B5124F9A~YAAQTF06F2Gly6GHAQAA68pzohOu6qhBi5wksnJSw5OYZd5JZfwvd7r0SVCNBvs/bDvcR+Zh/aiLapw31Lqy/gW9Wstvm144eeEDQ5U4fyiYKPcvDkzhTrVetrK4XJC+Ky/F9x4lS9AvxS4zHdwukc+W8R4GRr6DGk+Yg906WDlCgYreIiv83mvgtkfJ9fqCgtYcCbNIC+mtXfzGsYzpp3yaESFvCjNEr7kzdvEAUU8a2DjjIvbwpSxY/Dls0xR5~1'
    //   },
    //   data: data
    // };

    // axios(config)
    //   .then(function (response: any) {
    //     console.log(JSON.stringify(response.data));
    //   })
    //   .catch(function (error: any) {
    //     console.log(error);
    //   });

    // // WARNING: For POST requests, body is set to null by browsers.
    // var data = "entityId=8a8294174d0595bb014d05d82e5b01d2&amount=92.00&currency=EUR&paymentBrand=VISA&paymentType=CD&card.number=4200000000000000&card.expiryMonth=12&card.expiryYear=2024&card.holder=Jane%20Jones";

    // var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    // xhr.addEventListener("readystatechange", function () {
    //   if (this.readyState === 4) {
    //     console.log(this.responseText);
    //   }
    // });

    // xhr.open("POST", "https://test.oppwa.com/v1/payments");
    // xhr.setRequestHeader("Authorization", "Bearer OGE4Mjk0MTc0ZDA1OTViYjAxNGQwNWQ4MjllNzAxZDF8OVRuSlBjMm45aA==");
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // // WARNING: Cookies will be stripped away by the browser before sending the request.
    // xhr.setRequestHeader("Cookie", "ak_bmsc=1200B68BB653300DB29108FB1B581590~000000000000000000000000000000~YAAQTF06F/mxyaGHAQAAu1JiohN5BEtKCA6dzmA8TE6mW7R8gU2JD32BmtGuhi6XSMhTPao+jqrRNcUH2XG44aACNcx83IxP4UsxwxZdkQL2/Voxa5DL5n2dE57QyXrq4V4TOS6zWrzDwSfGLK2c5WnSJnK7l6F7BVHAvLbt6Ls+WST0yIL7sCJmeKd0CKZLWeKj/VBsCLwy93disY2zeNW37SXV28H995t0kBm39zK2jXCD/YkwV7jXeBFtXbbE5N03ln/gLqYFuxmqxVSAwG/mAlvKJAAt7bFXaoTvNzvBm8di+4wwOYYhnc7AwI5c32z7NjRdspqm/LribqeW7KwIK3Hi4dWKkUGzfy2g2W/R8o+FrJHm3TXo3lc=; bm_sv=BF25F92750A2B6C8E0E745B1B5124F9A~YAAQTF06F2Gly6GHAQAA68pzohOu6qhBi5wksnJSw5OYZd5JZfwvd7r0SVCNBvs/bDvcR+Zh/aiLapw31Lqy/gW9Wstvm144eeEDQ5U4fyiYKPcvDkzhTrVetrK4XJC+Ky/F9x4lS9AvxS4zHdwukc+W8R4GRr6DGk+Yg906WDlCgYreIiv83mvgtkfJ9fqCgtYcCbNIC+mtXfzGsYzpp3yaESFvCjNEr7kzdvEAUU8a2DjjIvbwpSxY/Dls0xR5~1");

    // xhr.send(data);



    // var myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer OGE4Mjk0MTc0ZDA1OTViYjAxNGQwNWQ4MjllNzAxZDF8OVRuSlBjMm45aA==");
    // myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    // myHeaders.append("Cookie", "ak_bmsc=1200B68BB653300DB29108FB1B581590~000000000000000000000000000000~YAAQTF06F/mxyaGHAQAAu1JiohN5BEtKCA6dzmA8TE6mW7R8gU2JD32BmtGuhi6XSMhTPao+jqrRNcUH2XG44aACNcx83IxP4UsxwxZdkQL2/Voxa5DL5n2dE57QyXrq4V4TOS6zWrzDwSfGLK2c5WnSJnK7l6F7BVHAvLbt6Ls+WST0yIL7sCJmeKd0CKZLWeKj/VBsCLwy93disY2zeNW37SXV28H995t0kBm39zK2jXCD/YkwV7jXeBFtXbbE5N03ln/gLqYFuxmqxVSAwG/mAlvKJAAt7bFXaoTvNzvBm8di+4wwOYYhnc7AwI5c32z7NjRdspqm/LribqeW7KwIK3Hi4dWKkUGzfy2g2W/R8o+FrJHm3TXo3lc=; bm_sv=BF25F92750A2B6C8E0E745B1B5124F9A~YAAQTF06F2Gly6GHAQAA68pzohOu6qhBi5wksnJSw5OYZd5JZfwvd7r0SVCNBvs/bDvcR+Zh/aiLapw31Lqy/gW9Wstvm144eeEDQ5U4fyiYKPcvDkzhTrVetrK4XJC+Ky/F9x4lS9AvxS4zHdwukc+W8R4GRr6DGk+Yg906WDlCgYreIiv83mvgtkfJ9fqCgtYcCbNIC+mtXfzGsYzpp3yaESFvCjNEr7kzdvEAUU8a2DjjIvbwpSxY/Dls0xR5~1");
    // myHeaders.append("Access-Control-Allow-Origin", "*",);

    // var urlencoded = new URLSearchParams();
    // urlencoded.append("entityId", "8a8294174d0595bb014d05d82e5b01d2");
    // urlencoded.append("amount", "92.00");
    // urlencoded.append("currency", "EUR");
    // urlencoded.append("paymentBrand", "VISA");
    // urlencoded.append("paymentType", "CD");
    // urlencoded.append("card.number", "4200000000000000");
    // urlencoded.append("card.expiryMonth", "12");
    // urlencoded.append("card.expiryYear", "2024");
    // urlencoded.append("card.holder", "Jane Jones");

    // var requestOptions = {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: urlencoded,
    //   redirect: 'follow' as RequestRedirect
    // };

    // fetch("https://test.oppwa.com/v1/payments", requestOptions)
    //   .then(response => response.text())
    //   .then(result => console.log(result))
    //   .catch(error => console.log('error', error));


    // var settings = {
    //   "url": "https://test.oppwa.com/v1/payments",
    //   "method": "POST",
    //   "timeout": 0,
    //   "headers": {
    //     "Authorization": "Bearer OGE4Mjk0MTc0ZDA1OTViYjAxNGQwNWQ4MjllNzAxZDF8OVRuSlBjMm45aA==",
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     // "Cookie": "ak_bmsc=1200B68BB653300DB29108FB1B581590~000000000000000000000000000000~YAAQTF06F/mxyaGHAQAAu1JiohN5BEtKCA6dzmA8TE6mW7R8gU2JD32BmtGuhi6XSMhTPao+jqrRNcUH2XG44aACNcx83IxP4UsxwxZdkQL2/Voxa5DL5n2dE57QyXrq4V4TOS6zWrzDwSfGLK2c5WnSJnK7l6F7BVHAvLbt6Ls+WST0yIL7sCJmeKd0CKZLWeKj/VBsCLwy93disY2zeNW37SXV28H995t0kBm39zK2jXCD/YkwV7jXeBFtXbbE5N03ln/gLqYFuxmqxVSAwG/mAlvKJAAt7bFXaoTvNzvBm8di+4wwOYYhnc7AwI5c32z7NjRdspqm/LribqeW7KwIK3Hi4dWKkUGzfy2g2W/R8o+FrJHm3TXo3lc=; bm_sv=BF25F92750A2B6C8E0E745B1B5124F9A~YAAQTF06F2Gly6GHAQAA68pzohOu6qhBi5wksnJSw5OYZd5JZfwvd7r0SVCNBvs/bDvcR+Zh/aiLapw31Lqy/gW9Wstvm144eeEDQ5U4fyiYKPcvDkzhTrVetrK4XJC+Ky/F9x4lS9AvxS4zHdwukc+W8R4GRr6DGk+Yg906WDlCgYreIiv83mvgtkfJ9fqCgtYcCbNIC+mtXfzGsYzpp3yaESFvCjNEr7kzdvEAUU8a2DjjIvbwpSxY/Dls0xR5~1"
    //   },
    //   "data": {
    //     "entityId": "8a8294174d0595bb014d05d82e5b01d2",
    //     "amount": "92.00",
    //     "currency": "EUR",
    //     "paymentBrand": "VISA",
    //     "paymentType": "CD",
    //     "card.number": "4200000000000000",
    //     "card.expiryMonth": "12",
    //     "card.expiryYear": "2024",
    //     "card.holder": "Jane Jones"
    //   }
    // };

    // $.ajax(settings).done(function (response) {
    //   console.log("Payment Response...", response);
    // });


    // ajax({
    //   url: "https://test.oppwa.com/v1/payments",
    //   type: "POST",
    //   data: {
    //     entityId: '8a8294174d0595bb014d05d82e5b01d2',
    //     amount: '100',
    //     currency: "EUR",
    //     paymentBrand: "VISA",
    //     paymentType: "CD",
    //     "card.number": "4200000000000000",
    //     "card.expiryMonth": "12",
    //     "card.expiryYear": "2024",
    //     "card.holder": "Jane Jones"
    //   },
    //   headers: {
    //     // "Access-Control-Allow-Origin": "*",
    //     "Authorization": 'Bearer OGFjN2E0Yzc3ZDA0NDMwMzAxN2QwNGNhYzAwMjAxYTJ8ZFJNOFA4N2F3Uw==',
    //   },
    //   success: function (data: any) {
    //     console.log(data);
    //   }, error: function (errorData: any) {
    //     console.log(errorData);
    //   }
    // });




  }
}
