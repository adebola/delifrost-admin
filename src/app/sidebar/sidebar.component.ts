import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

declare const $: any;

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [
    {
        path: '/admin/dashboard',
        title: 'Dashboard',
        type: 'link',
        icontype: 'dashboard'
    },
    {
        path: '/admin/products/productcategories',
        title: 'Categories',
        type: 'link',
        icontype: 'dynamic_feed'

    },
    {
        path: '/admin/products/products',
        title: 'Products',
        type:  'link',
        icontype: 'local_parking',
    },
    {
        path: '/admin/orders/orders',
        title: 'Orders',
        type: 'sub',
        icontype: 'widgets',
        collapse: 'Orders',
        children: [
            {path: '', title: 'Orders', ab: 'O'},
            {path: '1', title: 'Order Delivery', ab: 'OD'}
        ]
    },
    {
        path: '/admin/utility/utility/',
        title: 'Import',
        type: 'link',
        icontype: 'build',
        // collapse: 'Utility',
        // children: [
        //     {path: '', title: 'Import Prices...', ab: 'P'},
        // ]
    },
    {
        path: '/admin/users/users',
        title: 'Users',
        type: 'link',
        icontype: 'supervisor_account'

    }
];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})
export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ps: any;

    constructor(public authService: AuthService, private router: Router) {}

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

    ngOnInit() {

        this.menuItems = ROUTES.filter(menuItem => menuItem);
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            this.ps = new PerfectScrollbar(elemSidebar);
        }
    }

    updatePS(): void  {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            this.ps.update();
        }
    }

    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    onLogout() {
        this.authService.logout();
        this.router.navigate(['/auth']);
    }
}
