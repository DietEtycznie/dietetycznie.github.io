import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { RecipeCardComponent } from "./components/ui/recipe-card/recipe-card.component";
import { RecipesComponent } from "./pages/recipes/recipes.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppComponent,
    RecipeCardComponent,
    RecipesComponent,
  ],
  providers: [],
})
export class AppModule {}
