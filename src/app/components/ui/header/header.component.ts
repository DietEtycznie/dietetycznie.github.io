import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../../services/auth.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  user$ = this.authService.user$;

  logout(): void {
    this.authService.signOut();
  }
}
