
// app/utils/api.ts ---------------------------------------------
export async function uploadReceipt(uri: string) {
  // 👈 En Android emulador usa 10.0.2.2:8000 en vez de localhost
  const ENDPOINT = "http://192.168.3.3:8000/upload"; // IP de tu PC (o 10.0.2.2)

  const fileName = uri.split("/").pop() ?? "receipt.jpg";

  const form = new FormData();
  form.append("file", {
    uri,
    name: fileName,
    type: "image/jpeg",   // Expo Camera devuelve jpeg por defecto
  } as any);              // “as any” para evitar que TS proteste

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    body: form,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Upload failed: ${res.status} – ${txt}`);
  }
  return await res.json();              //  { job_id: "…uuid…" }
}
export default function _NoScreen() {
  return null;           // silencia el warning de expo-router
}
