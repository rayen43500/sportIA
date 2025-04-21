import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './componnents/front_office/template/home/home.component';
import { HeaderComponent } from './componnents/front_office/template/header/header.component';
import { FooterComponent } from './componnents/front_office/template/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HomeBackComponent } from './componnents/back_office/template/home-back/home-back.component';
import { HeaderBackComponent } from './componnents/back_office/template/header-back/header-back.component';
import { AppRoutingModule } from './app-routing.module';
import { ListTypeActivityComponent } from './componnents/front_office/activities/ListTypeActivity/ListTypeActivity/ListTypeActivity.component';
import { HttpClientModule } from '@angular/common/http';
import { ListActivitiesComponent } from './componnents/front_office/activities/ListActivities/ListActivities.component';
import { AddEditActivitiesComponent } from './componnents/front_office/activities/AddEditActivities/AddEditActivities.component';
import { AiChatComponent } from './componnents/front_office/activities/ListActivities/ai-chat/ai-chat.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    HomeBackComponent,
    HeaderBackComponent,
    ListTypeActivityComponent,
    ListActivitiesComponent,
    AddEditActivitiesComponent,
    AiChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
