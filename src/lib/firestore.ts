import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { COLLECTIONS } from "./constants";
import type {
  ContactEntry,
  SurveyDraft,
  SurveyResponse,
  WaitingListEntry,
} from "./types";

// ---- Writes -------------------------------------------------------------

/** Firestore rejects `undefined`; drop any such keys before writing. */
function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T;
}

export async function submitSurvey(draft: SurveyDraft): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.surveyResponses), {
    ...stripUndefined(draft),
    isBetaUser: false,
    contacted: false,
    adminNotes: "",
    createdAt: serverTimestamp(),
    createdAtMs: Date.now(),
  });
  return ref.id;
}

export async function joinWaitingList(entry: Omit<WaitingListEntry, "id" | "createdAt">): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.waitingList), {
    ...entry,
    createdAt: serverTimestamp(),
    createdAtMs: Date.now(),
  });
  return ref.id;
}

export async function submitContact(entry: Omit<ContactEntry, "id" | "createdAt">): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.contacts), {
    ...entry,
    createdAt: serverTimestamp(),
    createdAtMs: Date.now(),
  });
  return ref.id;
}

// ---- Reads --------------------------------------------------------------

export async function getSurveyResponses(): Promise<SurveyResponse[]> {
  const q = query(
    collection(db, COLLECTIONS.surveyResponses),
    orderBy("createdAtMs", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as SurveyResponse) }));
}

export async function getWaitingList(): Promise<WaitingListEntry[]> {
  const q = query(
    collection(db, COLLECTIONS.waitingList),
    orderBy("createdAtMs", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as WaitingListEntry) }));
}

// ---- Admin updates ------------------------------------------------------

export async function updateSurveyResponse(
  id: string,
  patch: Partial<Pick<SurveyResponse, "isBetaUser" | "adminNotes" | "contacted">>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.surveyResponses, id), patch);
}

export async function deleteSurveyResponse(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.surveyResponses, id));
}
