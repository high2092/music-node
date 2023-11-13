import { DocumentReference, collection, doc } from 'firebase/firestore';
import { db } from '../../firebase/firestore';

export const getUserDbRef = (userId: number | string) => doc(db, 'data', userId.toString());
export const getMusicSequenceDbRef = (userDbRef: DocumentReference) => doc(userDbRef, 'sequence', 'music_sequence');
export const getMusicNodeSequenceDbRef = (userDbRef: DocumentReference) => doc(userDbRef, 'sequence', 'node_sequence');
export const getMusicDbRef = (userDbRef: DocumentReference) => collection(userDbRef, 'music');
export const getMusicNodeDbRef = (userDbRef: DocumentReference) => collection(userDbRef, 'node');
