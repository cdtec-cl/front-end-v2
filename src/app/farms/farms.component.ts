import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';
//services
import { WiseconnService } from '../services/wiseconn.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-farms',
  templateUrl: './farms.component.html',
  styleUrls: ['./farms.component.scss']
})
export class FarmsComponent implements OnInit {
  public farms;
  public loading = false;
  public searchTable:any;
  public userLS:any=null;
  public user:any=null;
  constructor(
    private wiseconnService: WiseconnService,
    private userService:UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    if(localStorage.getItem("user")){
        this.userLS=JSON.parse(localStorage.getItem("user"));
        if(bcrypt.compareSync(this.userLS.plain, this.userLS.hash)){
          this.user=JSON.parse(this.userLS.plain);
          if(this.user.role.id==1){//admin
            this.getFarms();
          }else{
            this.getFarmsByUser();
          }
        }else{
          this.router.navigate(['/login']);
        }
      }else{
        this.router.navigate(['/login']);
      }
  }
  getFarms(){      
    this.loading = true;
    this.wiseconnService.getFarms().subscribe((response: any) => {
      this.farms = response.data?response.data:response;      
      this.loading = false;
    });
  }
  getFarmsByUser(){      
    this.loading = true;
    this.userService.getFarmsByUser(this.user.id).subscribe((response: any) => {
      this.farms = response.data?response.data:response;      
      this.loading = false;
    });
  }
}
