import { AuthShowcase } from "@/components/auth/AuthShowcase";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-x-hidden bg-background p-3 sm:p-5">
      <div className="grid w-full max-w-[1180px] gap-5 lg:grid-cols-2">
        <AuthShowcase />

        <section className="flex flex-col justify-center px-1 py-8 sm:px-8 lg:px-14">
          <div className="mx-auto w-full max-w-[400px]">
            <p className="mb-6 text-[15px] font-medium text-foreground">
              One button signs you in or starts your registration.
            </p>

            <SocialAuthButtons />

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
