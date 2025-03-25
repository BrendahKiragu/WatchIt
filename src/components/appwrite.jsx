const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_COLLECTION_ID;
const PROJECT_KEY = import.meta.env.VITE_APPWRITE_PROJECT_ID;

export const AppWrite = async () => {
  console.log(DATABASE_ID, COLLECTION_ID, PROJECT_KEY);
};
