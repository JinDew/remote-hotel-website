import { auth } from "../_lib/auth";

export const metadata = {
  title: "Guest area",
};
export default async function Page() {
  const session = await auth();
  console.log("session: ", session);
  return <h1>Welcome {session.user.name}</h1>;
}
