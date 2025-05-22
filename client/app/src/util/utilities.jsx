import { doc, getDoc } from "firebase/firestore";
import db from "../firebase-config";

const fetchUserData = async (phoneNumber) => {
  try {
    const userDocRef = doc(db, "users", phoneNumber);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      console.warn(`No user found for phone number: ${phoneNumber}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export default fetchUserData;
