import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { map, take } from "rxjs/operators";
import { AuthService } from "../../services/auth.service";

const ADMIN_UID = "QXmfYBytYyPzHQKr3IhMILGlQrv2";

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map((user) => {
      console.log(user);
      if (!user || user.uid !== ADMIN_UID) {
        router.navigate(["/"]);
        return false;
      }
      return true;
    }),
  );
};
