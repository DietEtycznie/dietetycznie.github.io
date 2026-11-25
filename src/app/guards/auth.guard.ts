import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { combineLatest } from "rxjs";
import { filter, map, take } from "rxjs/operators";
import { AuthService } from "../../services/auth.service";

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return combineLatest([authService.authReady$, authService.user$]).pipe(
    filter(([ready]) => ready),
    take(1),
    map(([, user]) => {
      if (!user) {
        router.navigate(["/logowanie"], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
      return true;
    }),
  );
};
