import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BracketMenuComponent } from './modules/bracket-menu/bracket-menu.component';
import { FormsModule } from '@angular/forms';
import { MatchupComponent } from './modules/matchup/matchup.component';

@NgModule({
  declarations: [
    AppComponent,
    BracketMenuComponent,
    MatchupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
