export interface AppEnvironment {
  production: boolean;
  useDemoFallback: boolean;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
  ai?: {
    enableFirebaseAiLogic?: boolean;
    model?: string;
    proxyUrl?: string;
  };
}

export const environment: AppEnvironment = {
  production: false,
  useDemoFallback: true,
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
  },
  ai: {
    enableFirebaseAiLogic: false,
    model: "gemini-2.5-flash",
    proxyUrl: "",
  },
};
