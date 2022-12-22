import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatorService } from '../core/translator/translator.service';
import { MenuService } from '../core/menu/menu.service';
import { SharedModule } from '../shared/shared.module';
import { PagesModule } from './pages/pages.module';
import { QRCodeModule } from 'angularx-qrcode';
import { GotGiftComponent } from './component/got-gift/got-gift.component';
import { SeeGiftComponent } from './component/see-gift/see-gift.component';

import { routes } from './routes';
@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(routes),
        PagesModule,
        QRCodeModule
    ],
    declarations: [
        GotGiftComponent,
        SeeGiftComponent,
    ],
    exports: [
        RouterModule,
    ]
})

export class RoutesModule {
    constructor(public menuService: MenuService, tr: TranslatorService) {
        // menuService.addMenu(menu);
    }
}
