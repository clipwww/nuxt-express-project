export const firebaseCert = {
  type: "service_account",
  project_id: "my-first-firebase-projec-30d45",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
  client_email: "firebase-adminsdk-7w90z@my-first-firebase-projec-30d45.iam.gserviceaccount.com",
  client_id: "104901202111697562780",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7w90z%40my-first-firebase-projec-30d45.iam.gserviceaccount.com"
}

