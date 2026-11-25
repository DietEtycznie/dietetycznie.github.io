import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FooterComponent, HeaderComponent } from "./components/ui";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="app-shell">
      <app-header />
      <div class="app-content">
        <router-outlet></router-outlet>
      </div>
      <app-footer />
    </div>
  `,
  styles: [
    `
      .app-shell {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      .app-content {
        flex: 1 0 auto;
      }
    `,
  ],
})
export class AppComponent {}
