import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getUserFromFirestore = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

export const addUserToFirestore = async (userId: string, username: string) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { id: userId, username });
};
