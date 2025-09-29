// app/invite/page.tsx

import ProcessInvite from "@/components/auth/ProcessInvite";

export default function InvitePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return <ProcessInvite token={searchParams.token} />;
}
