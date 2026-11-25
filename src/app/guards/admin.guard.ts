import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { combineLatest } from "rxjs";
import { filter, map, take } from "rxjs/operators";
import { AuthService } from "../../services/auth.service";

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return combineLatest([authService.authReady$, authService.isAdmin$]).pipe(
    filter(([ready]) => ready),
    take(1),
    map(([, isAdmin]) => {
      if (!isAdmin) {
        router.navigate(["/"]);
        return false;
      }
      return true;
    }),
  );
};
