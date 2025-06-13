import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../../../services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.formBuilder.group(
      {
        displayName: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get("password")?.value;
    const confirmPassword = group.get("confirmPassword")?.value;

    if (password !== confirmPassword) {
      group.get("confirmPassword")?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = "";

    const { email, password, displayName } = this.registerForm.value;

    this.authService
      .signUp(email, password, displayName)
      .then(() => {
        this.router.navigate(["/"]);
      })
      .catch((error) => {
        this.error = this.getErrorMessage(error);
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
      .then(() => {
        this.router.navigate(["/"]);
      })
      .catch((error) => {
        this.error = this.getErrorMessage(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  private getErrorMessage(error: any): string {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "The email address is already in use";
      case "auth/invalid-email":
        return "Please enter a valid email address";
      case "auth/operation-not-allowed":
        return "Email/password accounts are not enabled";
      case "auth/weak-password":
        return "The password is too weak";
      case "auth/popup-closed-by-user":
        return "Google sign-in popup was closed before authentication completed";
      default:
        return error.message || "An unexpected error occurred";
    }
  }
}
