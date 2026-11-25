import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../../services/auth.service";
import { FirebaseService } from "../../../../services/firebase.service";
import { AuthShellComponent } from "../../../components/ui";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, AuthShellComponent],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private firebase = inject(FirebaseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  loading = false;
  error = "";
  returnUrl = "/";
  isFallbackMode = this.firebase.isFallbackMode;

  constructor() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });

    const rawReturn = this.route.snapshot.queryParams["returnUrl"] || "/";
    this.returnUrl =
      typeof rawReturn === "string" && rawReturn.startsWith("/") && !rawReturn.startsWith("//")
        ? rawReturn
        : "/";
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return Boolean(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = "";

    const { email, password } = this.loginForm.value;
    this.authService
      .signIn(email, password)
      .then(() => this.router.navigateByUrl(this.returnUrl))
      .catch((err) => {
        this.error = this.getErrorMessage(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loginWithGoogle(): void {
    this.loading = true;
    this.error = "";

    this.authService
      .signInWithGoogle()
      .then(() => this.router.navigateByUrl(this.returnUrl))
      .catch((err) => {
        this.error = this.getErrorMessage(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  loginDemo(asAdmin: boolean): void {
    this.loading = true;
    this.authService
      .signInDemo(asAdmin)
      .then(() => this.router.navigateByUrl(asAdmin ? "/admin" : this.returnUrl))
      .finally(() => {
        this.loading = false;
      });
  }

  private getErrorMessage(error: any): string {
    switch (error?.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Nieprawidłowy adres email lub hasło.";
      case "auth/invalid-email":
        return "Podaj poprawny adres email.";
      case "auth/too-many-requests":
        return "Zbyt wiele nieudanych prób logowania. Spróbuj ponownie za chwilę.";
      case "auth/popup-closed-by-user":
        return "Okno logowania Google zostało zamknięte przed zakończeniem.";
      default:
        return "Wystąpił nieoczekiwany błąd podczas logowania. Spróbuj ponownie.";
    }
  }
}
