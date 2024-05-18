import Header from "./dashboard/Header";
import Navbar from "./dashboard/Navbar";
import { getAuth } from "../actions/cookie";
import { parseJwt } from "../actions/utils";
import { StudentDetails } from "./profile/page";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user: StudentDetails;
  const t = await getAuth();
  const data = await parseJwt(t?.value);
  user = data.user;

  return (
    <>
      <Header username={user?.name as string} />
      <Navbar />
      {children}
    </>
  );
}
