import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componnents/front_office/template/home/home.component';
import { HeaderBackComponent } from './componnents/back_office/template/header-back/header-back.component';
import { ListTypeActivityComponent } from './componnents/front_office/activities/ListTypeActivity/ListTypeActivity/ListTypeActivity.component';
import { ListActivitiesComponent } from './componnents/front_office/activities/ListActivities/ListActivities.component';
import { AddEditActivitiesComponent } from './componnents/front_office/activities/AddEditActivities/AddEditActivities.component';
import { StatisticsComponent } from './componnents/front_office/activities/Statistics/statistics.component';

const routes: Routes = [
    {path : '', component : HomeComponent},
    {path : 'Back', component : HeaderBackComponent},
    {path : 'ListType', component : ListTypeActivityComponent},
    {path : 'ListActivity', component : ListActivitiesComponent},
    {path : 'statistics', component : StatisticsComponent},
    {path : 'add-edit', component: AddEditActivitiesComponent},
    {path : 'add-edit/:id', component: AddEditActivitiesComponent}, 
    {path : 'activities/details/:id', component: AddEditActivitiesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
