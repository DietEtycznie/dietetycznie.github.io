import "@angular/compiler";
import { EnvironmentInjector, runInInjectionContext } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, firstValueFrom, Observable } from "rxjs";
import { describe, expect, it, vi } from "vitest";
import { User } from "../../models/user.model";
import { AuthService } from "../../services/auth.service";
import { adminGuard } from "./admin.guard";
import { authGuard } from "./auth.guard";

function createMockInjector(authStub: Partial<AuthService>, navigateSpy: ReturnType<typeof vi.fn>) {
  const providers = new Map<unknown, unknown>([
    [AuthService, authStub],
    [Router, { navigate: navigateSpy }],
  ]);

  return {
    get: (token: unknown) => providers.get(token),
  } as unknown as EnvironmentInjector;
}

describe("Route guards (authGuard & adminGuard)", () => {
  it("authGuard redirects unauthenticated users to /logowanie with returnUrl", async () => {
    const navigate = vi.fn();
    const injector = createMockInjector(
      {
        authReady$: new BehaviorSubject(true),
        user$: new BehaviorSubject<User | null>(null),
      },
      navigate,
    );

    const result$ = runInInjectionContext(injector, () =>
      authGuard({} as any, { url: "/jadlospisy?section=myPlans" } as any),
    ) as Observable<boolean>;

    expect(await firstValueFrom(result$)).toBe(false);
    expect(navigate).toHaveBeenCalledWith(["/logowanie"], {
      queryParams: { returnUrl: "/jadlospisy?section=myPlans" },
    });
  });

  it("authGuard allows signed-in users through", async () => {
    const navigate = vi.fn();
    const injector = createMockInjector(
      {
        authReady$: new BehaviorSubject(true),
        user$: new BehaviorSubject<User | null>({
          uid: "u-1",
          email: "jan@test.pl",
          displayName: "Jan",
          role: "user",
        }),
      },
      navigate,
    );

    const result$ = runInInjectionContext(injector, () =>
      authGuard({} as any, { url: "/jadlospisy" } as any),
    ) as Observable<boolean>;

    expect(await firstValueFrom(result$)).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });

  it("adminGuard blocks non-admin users and redirects to /", async () => {
    const navigate = vi.fn();
    const injector = createMockInjector(
      {
        authReady$: new BehaviorSubject(true),
        isAdmin$: new BehaviorSubject(false),
      },
      navigate,
    );

    const result$ = runInInjectionContext(injector, () =>
      adminGuard({} as any, { url: "/admin" } as any),
    ) as Observable<boolean>;

    expect(await firstValueFrom(result$)).toBe(false);
    expect(navigate).toHaveBeenCalledWith(["/"]);
  });

  it("adminGuard allows admin users after authReady$ emits true", async () => {
    const navigate = vi.fn();
    const authReady$ = new BehaviorSubject(false);
    const injector = createMockInjector(
      {
        authReady$,
        isAdmin$: new BehaviorSubject(true),
      },
      navigate,
    );

    const result$ = runInInjectionContext(injector, () =>
      adminGuard({} as any, { url: "/admin" } as any),
    ) as Observable<boolean>;

    const pending = firstValueFrom(result$);
    authReady$.next(true);

    expect(await pending).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });
});
