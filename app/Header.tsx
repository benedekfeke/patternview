
import { auth0 } from '@/lib/auth0';
import HeaderClient from './components/HeaderClient';



export default async function Header() {

  const session = await auth0.getSession();
  const user = session?.user ?? null;

  return <HeaderClient user={user} />
}
