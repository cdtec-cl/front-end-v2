import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../models/user';
import { WiseconnService } from '../services/wiseconn.service';
import { HttpClient, HttpHeaders, HttpHandler,HttpClientModule  } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as Chartist from 'chartist';
import { UserService } from 'app/services/user.service';
import { NotificationService } from 'app/services/notification.service';
// elements
import {
	accountsConfigObj,
	farmsConfigObj
} from "./selectsconfigs/configs";

@Component({
  selector: 'app-dashboard-campo',
  templateUrl: './dashboard-campo.component.html',
  styleUrls: ['./dashboard-campo.component.css']
})
export class DashboardCampoComponent implements OnInit {
  
  public loading:boolean=false;
  public userLS:any=null;
  	//accounts
	public accountsConfig = accountsConfigObj;
	public accounts: Array<any> = [];
	public selectedAccounts: any;
	//farms
	public farmsConfig = farmsConfigObj;
	public farms: Array<any> = [];
  public selectedFarms: Array<any> = [];
  public zones: any[]=[];
  public zone:any=null;
  constructor(private router: Router, public wiseconnService: WiseconnService,) { }  
  ngOnInit() {
    this.getAccounts();
	
		if(localStorage.getItem("user")){
			this.userLS=JSON.parse(localStorage.getItem("user"));			
		}else{
			this.router.navigate(['/login']);
		}
  }

  selectionChanged(event,select) {
		switch (select) {	
			case "farm":
	  this.selectedFarms=event.value;  
	  this.setLocalStorageItem("lastFarmId",this.selectedFarms['id']);   
      this.getZones(this.selectedFarms['id']);
			break;
			case "account":
      this.selectedAccounts=event.value;      
			if(JSON.parse(localStorage.getItem("datafarms"))) {
				let farm_aux =JSON.parse(localStorage.getItem("datafarms")); 
        this.farms=[];
        console.log(this.selectedAccounts);
        				
					let accountId=this.selectedAccounts.id;
					let farms=farm_aux.filter(function(element){
						if(element['account']['id'] == accountId){
							element.name=element.name;
							return element;
						}
					})
					for(let farm of farms){
						this.farms=[...this.farms,farm];
					}
					this.selectedFarms=[];				
			}			
			default:
			// code...
			break;
		}
  }

  setLocalStorageItem(key,value){
    localStorage.setItem(key,value);
  }
  
  getAccounts() {
		this.loading=true;
		this.wiseconnService.getAccounts().subscribe((response: any) => {
			this.loading=false;
			let accounts = response.data?response.data:response;
			let options = [];
			for (let i = 0; i < accounts.length; i++) {
				options.push({
					id: accounts[i].id,
					name: accounts[i].name
				});
			}
			this.accounts=options;
		},
		error => {
			console.log("error:",error)
			this.loading=false;
		});
  }

  getZones(id) {
    this.loading = true;
    this.wiseconnService.getZones(id).subscribe((response: any) => {
      this.loading = false; 
      this.zones = response.data?response.data:response;
    });
  }

   
}
