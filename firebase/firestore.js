import app from './firebase.config';
import { getFirestore } from 'firebase/firestore';

const fireStore = getFirestore(app.firebaseApp);

export { fireStore as db };
