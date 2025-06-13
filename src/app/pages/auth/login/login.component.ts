import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "../../../../services/auth.service";
import { HeaderComponent } from "../../../components/ui/header/header.component";
import { FooterComponent } from "../../../components/ui/footer/footer.component";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = "";
  returnUrl = "/";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = "";

    const { email, password } = this.loginForm.value;

    this.authService
      .signIn(email, password)
      .then(() => {
        this.router.navigateByUrl(this.returnUrl);
      })
      .catch((error) => {
        this.error = this.getErrorMessage(error);
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
      .then(() => {
        this.router.navigateByUrl(this.returnUrl);
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
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Invalid email or password";
      case "auth/invalid-email":
        return "Please enter a valid email address";
      case "auth/too-many-requests":
        return "Too many unsuccessful login attempts. Please try again later";
      case "auth/popup-closed-by-user":
        return "Login popup was closed before authentication completed";
      default:
        return error.message || "An unexpected error occurred";
    }
  }
}
