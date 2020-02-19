import { Routes } from '@angular/router';

import { ClientComponent } from 'app/client/client.component';
import { FarmClientComponent } from 'app/farm-client/farm-client.component';
import { FarmMapPolygonComponent } from 'app/farm-map-polygon/farm-map-polygon.component';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { FarmMapComponent } from '../../farm-map/farm-map.component';
import { FarmsComponent } from '../../farms/farms.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { ReportInstalationComponent } from '../../report-instalation/report-instalation.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { FreePlotterComponent } from 'app/free-plotter/free-plotter.component';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'report-instalacion',   component: ReportInstalationComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'farms', component:  FarmsComponent, pathMatch:  'full' },
    { path: 'farmmap/:id', component:  FarmMapComponent, pathMatch:  'full' },
    { path: 'client', component:  ClientComponent, pathMatch:  'full' },
    { path: 'client-farm/:id', component:  FarmClientComponent, pathMatch:  'full' },
    { path: 'farmpolygon/:id/:farm', component:  FarmMapPolygonComponent, pathMatch:  'full' },
    { path: 'free-plotter', component:  FreePlotterComponent, pathMatch:  'full' },
    
];
