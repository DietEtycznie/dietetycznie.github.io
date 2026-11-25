import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../../../services/auth.service";
import { ThemeService } from "../../../../services/theme.service";
import { BrandLogoComponent } from "../brand-logo/brand-logo.component";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, BrandLogoComponent],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  user$ = this.authService.user$;
  isAdmin$ = this.authService.isAdmin$;
  theme$ = this.themeService.theme$;

  isMobileNavOpen = false;
  isUserMenuOpen = false;

  toggleTheme(event: MouseEvent): void {
    this.themeService.toggle(event);
  }

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
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }

  logout(): void {
    this.authService.signOut();
    this.closeMobileNav();
    this.closeUserMenu();
    this.router.navigate(["/"]);
  }

  goToLikedRecipes(): void {
    this.closeUserMenu();
    this.closeMobileNav();
    this.router.navigate(["/przepisy"], { queryParams: { liked: "1" } });
  }

  goToMyDietPlans(): void {
    this.closeUserMenu();
    this.closeMobileNav();
    this.router.navigate(["/jadlospisy"], {
      queryParams: { section: "myPlans" },
    });
  }

  goToAdmin(): void {
    this.closeUserMenu();
    this.closeMobileNav();
    this.router.navigate(["/admin"]);
  }
}
