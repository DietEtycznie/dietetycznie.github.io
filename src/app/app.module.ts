import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import {AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
// ...existing code...

@NgModule({
  declarations: [
    // ...existing code...
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    // ...existing code...
  ],
  providers: [],
  bootstrap: [/* ...existing code... */]
})
export class AppModule { }
