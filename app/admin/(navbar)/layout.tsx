import Head from "./dashboard/Head";
import Nav from "./dashboard/Nav";
import { User } from "./query/page";
import { getAuthAdmin } from "../../actions/cookie";
import { parseJwt } from "../../actions/utils";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user: User;
  let t = await getAuthAdmin();
  const data = await parseJwt(t?.value);
  user = data.user;

  return (
    <>
      <Head username={user?.campus} />
      <Nav />
      {children}
    </>
  );
}
