import { Suspense } from "react";

import { AuthPage } from "@/components/auth";
import { Container } from "@/components/common/container";
import { authPage } from "@/config/auth";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: authPage.metadata.title,
  description: authPage.metadata.description,
  path: "/sign-in",
  noIndex: true,
});

function AuthPageFallback() {
  return (
    <main id="main" className="page-shell commerce-page">
      <section className="auth-v52">
        <Container className="py-20 text-center text-sm text-[#64757e]">
          Loading sign in…
        </Container>
      </section>
    </main>
  );
}

export default function SignInRoute() {
  return (
    <Suspense fallback={<AuthPageFallback />}>
      <AuthPage />
    </Suspense>
  );
}
