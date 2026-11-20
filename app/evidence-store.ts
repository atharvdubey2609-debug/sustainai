
export type EvidenceStatus =
  | "Pending Review"
  | "Partially Verified"
  | "Verified"
  | "Rejected";

export type EvidenceRecord = {
  id: string;
  materialId: string;
  title: string;
  documentType: string;
  issuer: string;
  reportNumber: string;
  issueDate: string;
  sourceUrl: string;
  status: EvidenceStatus;
  reviewerNotes: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
  fileBlob?: Blob;
};

const DB_NAME = "sustainai-evidence";
const STORE_NAME = "documents";
const DB_VERSION = 1;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Could not open evidence database."));
  });
}

export async function getEvidenceRecords(): Promise<EvidenceRecord[]> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();

    request.onsuccess = () => {
      const records = (request.result as EvidenceRecord[]) ?? [];
      records.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      resolve(records);
      db.close();
    };

    request.onerror = () => {
      reject(request.error);
      db.close();
    };
  });
}

export async function saveEvidenceRecord(
  record: EvidenceRecord
): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(record);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };

    transaction.onabort = () => {
      db.close();
      reject(transaction.error ?? new Error("Save operation was cancelled."));
    };
  });
}

export async function deleteEvidenceRecord(id: string): Promise<void> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
}

export function downloadEvidenceFile(record: EvidenceRecord): void {
  if (!record.fileBlob) {
    throw new Error("The original file is not available in this browser.");
  }

  const url = URL.createObjectURL(record.fileBlob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = record.fileName || "evidence-document";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
