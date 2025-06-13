import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
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
  private router = inject(Router);
  user$ = this.authService.user$.pipe();

  isMobileNavOpen = false;
  isUserMenuOpen = false;

  toggleMobileNav(): void {
    this.isMobileNavOpen = !this.isMobileNavOpen;
    if (!this.isMobileNavOpen) {
      this.isUserMenuOpen = false;
    }
  }

  closeMobileNav(): void {
    this.isMobileNavOpen = false;
    this.isUserMenuOpen = false;
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  getFirstLetters(name: string | undefined): string {
    if (!name) return "";
    const [first, second] = name.trim().split(" ");
    if (!first) return "";
    if (!second) return first.charAt(0).toUpperCase();
    return (first.charAt(0) + second.charAt(0)).toUpperCase();
  }

  logout(): void {
    this.authService.signOut();
    this.closeMobileNav();
  }

  goToLikedRecipes() {
    this.closeUserMenu();
    this.router.navigate(["/recipes"], { queryParams: { liked: "1" } });
  }

  goToMyDietPlans() {
    this.closeUserMenu();
    this.router.navigate(["/diet-plans"], {
      queryParams: { section: "myPlans" },
    });
  }
}
