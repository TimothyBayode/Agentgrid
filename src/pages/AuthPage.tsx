import { useEffect, useState } from "react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "@/lib/router";
import { AuthShowcase } from "@/components/auth/AuthShowcase";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";

export default function AuthPage() {
  const navigate = useNavigate();
  const { authenticated } = usePrivy();
  const [error, setError] = useState<string | null>(null);
  const { login } = useLogin();

  useEffect(() => {
    if (authenticated) {
      navigate("/agents", { replace: true });
    }
  }, [authenticated, navigate]);

  const startLogin = async (provider: "google" | "github" | "discord" | "wallet") => {
    setError(null);
    try {
      await login({ loginMethods: [provider] });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center overflow-x-hidden bg-background p-3 sm:p-5">
      <div className="grid w-full max-w-[1180px] gap-5 lg:grid-cols-2">
        <AuthShowcase />

        <section className="flex flex-col justify-center px-1 py-8 sm:px-8 lg:px-14">
          <div className="mx-auto w-full max-w-[400px]">
            <p className="mb-6 text-[15px] font-medium text-foreground">
              One button signs you in or starts your registration.
            </p>

            <SocialAuthButtons onSelect={startLogin} />

            {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

            <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
              Each provider is a separate account. If you registered with the other one, continue
              with that one instead.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
