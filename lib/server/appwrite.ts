import { Client, Users, Databases } from 'node-appwrite';

export function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.APPWRITE_API_KEY!);

  return {
    get account() {
      return new Users(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
}
