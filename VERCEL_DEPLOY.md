# 🚀 Deploy Proxy AI ke Vercel (2 Menit)

File `api/ai.js` di repo ini adalah **Vercel Serverless Function** yang meneruskan panggilan AI
(Ollama / NVIDIA) dari browser tanpa diblokir CORS. File statis lain (HTML tool) otomatis ikut
ter-hosting oleh Vercel.

## Langkah Deploy

1. **Push repo** ke GitHub (jika belum):
   ```bash
   git add .
   git commit -m "feat: tambah AI proxy (api/ai.js) + generator soal manual"
   git push origin main
   ```

2. Buka **https://vercel.com** → login dengan **GitHub** → **Add New Project** → **Import** repo `home`.

3. Vercel otomatis mendeteksi:
   - `api/ai.js` → Serverless Function
   - File `*.html` → konten statis

4. **(Opsional tapi disarankan)** Set **Environment Variables** di
   **Settings → Environment Variables** (agar key tidak perlu diketik di aplikasi):
   - `OLLAMA_API_KEY` → tempel key Ollama Anda
   - `NVIDIA_API_KEY` → tempel key NVIDIA Anda
   Lalu **Redeploy** (Deployments → ⋯ → Redeploy).

5. Klik **Deploy** → tunggu selesai → dapat URL seperti:
   `https://nama-proyek.vercel.app`

## Cara Pakai

> Karena **halaman utama Anda di-hosting di GitHub Pages** (`tool.robopanda.my.id`),
> Endpoint Proxy **harus diisi URL lengkap** Vercel Anda — GitHub Pages tidak menyediakan `/api/ai`.

| Situasi | Isi "Endpoint Proxy" di aplikasi |
|---|---|
| Halaman di GitHub Pages *(kasus Anda)* | **`https://<nama-proyek>.vercel.app/api/ai`** (wajib lengkap) |
| Halaman di-hosting di Vercel yang sama | biarkan `/api/ai` (relatif) |

Di aplikasi `soal/index.html`:
1. **Provider AI** = `Ollama` (default)
2. **API Key** = key Ollama Anda *(bisa kosong jika `OLLAMA_API_KEY` sudah di-set di Vercel)*
3. **Model AI** = `gemma4:31b` (default, sudah teruji) — alternatif: `gpt-oss:20b`
4. **Endpoint Proxy** = `https://<nama-proyek>.vercel.app/api/ai`
5. Klik **⚡ Generate Soal (NVIDIA AI)** → tombol kini memanggil proxy Anda.

> ⚠️ **Catatan pengujian lokal:** Live Server biasa (8800/5500) **tidak** menyediakan `/api/ai`.
> Untuk mencoba function di lokal gunakan `vercel dev` (perlu Vercel CLI: `npm i -g vercel`),
> atau deploy dulu lalu isi Endpoint Proxy dengan URL Vercel.

## Catatan Teknis

- Function memakai native `fetch` (Node 20 di Vercel), timeout `AbortSignal.timeout(55000)`.
- `vercel.json` menyetel `maxDuration: 30` dan header CORS untuk `/api/*`.
- API key: browser tetap membawa key lewat header `Authorization`, namun **lebih aman** bila
  disimpan sebagai env var Vercel (key tidak pernah muncul di kode frontend).
- Provider didukung: `ollama` (api.ollama.com/api/chat) dan `nvidia` (integrate.api.nvidia.com/v1/chat/completions).