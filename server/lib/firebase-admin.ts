import * as admin from "firebase-admin";

let initialized = false;

export function initializeFirebaseAdmin() {
  if (initialized || (admin.apps && admin.apps.length > 0)) {
    return;
  }

  if (
    !process.env.FIREBASE_PRIVATE_KEY ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.VITE_FIREBASE_PROJECT_ID
  ) {
    console.warn("Firebase Admin SDK credentials not fully configured");
    return;
  }

  try {
    const serviceAccount = {
      type: process.env.FIREBASE_TYPE || "service_account",
      project_id: process.env.VITE_FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    });

    initialized = true;
  } catch (err) {
    console.error("Failed to initialize Firebase Admin SDK:", err);
  }
}

export function getAdminAuth() {
  initializeFirebaseAdmin();
  return admin.apps && admin.apps.length > 0 ? admin.auth() : null;
}

export function getAdminDb() {
  initializeFirebaseAdmin();
  return admin.apps && admin.apps.length > 0 ? admin.firestore() : null;
}

export const adminAuth = getAdminAuth();
export const adminDb = getAdminDb();

export default admin;
