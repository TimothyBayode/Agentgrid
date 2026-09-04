import { Github, Wallet } from "lucide-react";

type Props = {
  onSelect?: (provider: "google" | "github" | "discord" | "wallet") => void;
};

export function SocialAuthButtons({ onSelect }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <SocialButton dataTip="Continue with Google" onClick={() => onSelect?.("google")}>
        <GoogleMark />
        Google
      </SocialButton>
      <SocialButton dataTip="Continue with GitHub" onClick={() => onSelect?.("github")}>
        <Github className="h-4 w-4" />
        Github
      </SocialButton>
      <SocialButton dataTip="Continue with Discord" onClick={() => onSelect?.("discord")}>
        <DiscordMark />
        Discord
      </SocialButton>
      <SocialButton
        className="sm:col-span-3"
        dataTip="Use a BNB Chain wallet"
        onClick={() => onSelect?.("wallet")}
      >
        <Wallet className="h-4 w-4 text-emerald" />
        Connect Wallet
      </SocialButton>
    </div>
  );
}

function SocialButton({
  children,
  className = "",
  onClick,
  dataTip,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  dataTip?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      {...(dataTip ? { "data-tip": dataTip } : {})}
      className={`tip tip--bottom inline-flex h-11 items-center justify-center gap-2 border border-border bg-surface text-[13px] font-medium text-foreground transition-colors hover:border-foreground/25 hover:bg-surface-2 ${className}`}
    >
      {children}
    </button>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.8l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.4 14.5a7.2 7.2 0 0 1 0-4.6V6.8H1.4a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.8l4 3.1C6.3 7 8.9 4.8 12 4.8Z"
      />
    </svg>
  );
}

function DiscordMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#5865F2]" aria-hidden>
      <path
        fill="currentColor"
        d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
      />
    </svg>
  );
}
