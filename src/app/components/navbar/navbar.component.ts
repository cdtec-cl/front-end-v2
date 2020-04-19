import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    active: boolean
}

export const SidebarRoute: RouteInfo[] = [
    { path: '/user-profile', title: 'Ver Perfil',  icon: 'Profile', class: '', active : false },
    { path: '/', title: 'Cerrar sesión',  icon:'Logout', class: '' , active : false},
];
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('toggleButton', {static: true }) toggleButton: ElementRef;
    public toggled:boolean=null;
    private listTitles: any[];
    public location: Location;
    public mobile_menu_visible: any = 0;
    private sidebarVisible: boolean;
    public activeHover = false;
    public userLS:any=null;
    public user:any=null;


    constructor(location: Location,  private element: ElementRef, private router: Router) {
      this.location = location;
          this.sidebarVisible = false;
    }

    ngOnInit(){
      if(localStorage.getItem("user")){
        this.userLS=JSON.parse(localStorage.getItem("user"));
        if(bcrypt.compareSync(this.userLS.plain, this.userLS.hash)){
          this.user=JSON.parse(this.userLS.plain);
          this.listTitles = SidebarRoute.filter(listTitle => listTitle);
          const navbar: HTMLElement = this.element.nativeElement;
          this.toggled=this.isMobileMenu()?false:true;
          this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
              $layer.remove();
              this.mobile_menu_visible = 0;
            }
          });
        }else{
          this.router.navigate(['/login']);
        }
      }else{
        this.router.navigate(['/login']);
      }
      
    }

    sidebarOpen() {
        const toggleButton=this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        const sidebar = document.getElementsByClassName('sidebar')[0];
        const mainPanel = document.getElementsByClassName('main-panel')[0];
        body.classList.add('nav-open');

        sidebar.classList.add('sidebar-close');

        mainPanel.classList.add('w-100');
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('nav-open');

        const sidebar: any = document.getElementsByClassName('sidebar sidebar-close')[0];
        if (sidebar) {
          sidebar.classList.remove('sidebar-close');
        }

        const mainPanel: any = document.getElementsByClassName('main-panel')[0];
        if (mainPanel) {
          mainPanel.classList.remove('w-100');
        }
    };
    sidebarToggle() {
        this.toggled=!this.toggled;
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible) {
            this.sidebarClose();
        } else {
            this.sidebarOpen();
        }
        this.sidebarVisible = !this.sidebarVisible;

        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            var $layer:any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
            }
            /*setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);*/

            this.mobile_menu_visible = 0;
        } else {
            /*setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);*/

            var $layer: any = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            }else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() { //asign a function
              body.classList.remove('nav-open');
              this.mobile_menu_visible = 0;
              $layer.classList.remove('visible');
              this.toggled=!this.toggled;
              setTimeout(function() {
                  $layer.remove();
              }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };
    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };
    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }

      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }
}
