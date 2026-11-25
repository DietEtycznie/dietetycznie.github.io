import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../../services/auth.service";
import { AuthShellComponent } from "../../../components/ui";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, AuthShellComponent],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  error = "";

  constructor() {
    this.registerForm = this.fb.group(
      {
        displayName: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get("password")?.value;
    const confirmPassword = group.get("confirmPassword")?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      group.get("confirmPassword")?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return Boolean(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.error = "";

    const { email, password, displayName } = this.registerForm.value;
    this.authService
      .signUp(email, password, displayName)
      .then(() => this.router.navigate(["/"]))
      .catch((err) => {
        this.error = this.getErrorMessage(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  registerWithGoogle(): void {
    this.loading = true;
    this.error = "";
    this.authService
      .signInWithGoogle()
      .then(() => this.router.navigate(["/"]))
      .catch((err) => {
        this.error = this.getErrorMessage(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  private getErrorMessage(error: any): string {
    switch (error?.code) {
      case "auth/email-already-in-use":
        return "Ten adres email jest już zarejestrowany.";
      case "auth/invalid-email":
        return "Podaj poprawny adres email.";
      case "auth/operation-not-allowed":
        return "Rejestracja przez email/hasło jest obecnie wyłączona.";
      case "auth/weak-password":
        return "Hasło jest zbyt słabe — użyj co najmniej 6 znaków.";
      case "auth/popup-closed-by-user":
        return "Okno rejestracji Google zostało zamknięte przed zakończeniem.";
      default:
        return "Nie udało się utworzyć konta. Spróbuj ponownie.";
    }
  }
}
