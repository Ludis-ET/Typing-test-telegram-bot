import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getUserFromFirestore = async (userId: string) => {
  const usersCollection = collection(db, "users");
  const userQuery = query(usersCollection, where("id", "==", userId));
  const querySnapshot = await getDocs(userQuery);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data();
  }
  return null;
};

export const addUserToFirestore = async (userId: string, username: string) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { id: userId, username });
};
