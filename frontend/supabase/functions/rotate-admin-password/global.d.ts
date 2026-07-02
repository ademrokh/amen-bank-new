declare const Deno: {
  env: {
    get(name: string): string | undefined;
  };
  serve(handler: (request?: Request) => Promise<Response> | Response): void;
};

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export function createClient(url: string, key: string): {
    auth: {
      admin: {
        updateUserById: (
          userId: string,
          attributes: { password: string }
        ) => Promise<{ error?: { message: string } | null }>;
      };
    };
  };
}
