import { useSession } from '@/features/auth/session';
import { Button } from '@/ui/atoms/Button';
import { AuthTemplate } from '@/ui/templates/AuthTemplate';

export default function HomePage() {
  const { session, signOut } = useSession();

  if (!session) {
    return null;
  }

  return (
    <AuthTemplate title="You’re signed in" description={`Welcome, ${session.user.name}.`}>
      <Button label="Sign out" onPress={signOut} />
    </AuthTemplate>
  );
}
