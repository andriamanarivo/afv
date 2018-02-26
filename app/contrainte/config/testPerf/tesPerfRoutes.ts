import { Routes, RouterModule } from '@angular/router';
import { TestPerfHomePageComponent } from '../../../presentation/test-perf-home-page/test-perf-home-page.component';



const ROUTES: Routes = [
    {
        path: 'testPerf',
        component: TestPerfHomePageComponent,
        pathMatch: 'full'
    }
];


export const TESTPERF_ROUTES = RouterModule.forChild(ROUTES);
