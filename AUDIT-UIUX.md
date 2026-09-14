# 🔍 Audit UI/UX — Teaching Tools Hub (Root Files)

> Tanggal audit: 2026-09-14
> **Scope:** file di root saja — `index.html`, `math-generator.html`, `attendance.html`, `convert-pdf.html`, `merge-pdf.html`, `handwriting.html`, `wordEditor.html`. Audit folder `soal/` ada di **Bagian 6** (dipesan terpisah setelahnya). Folder `beginner/` & `kiddy/` di luar scope.
> **Standar acuan:** WCAG 2.1 AA (kontras, fokus, semantik), responsivitas mobile, alur UX (feedback, error state), konsistensi desain.

---

## 1. Ringkasan Eksekutif

| Halaman | Skor | Status Umum |
|---|---|---|
| `index.html` | **C** | Struktur hub bagus, tapi 4 link rusak + grid tidak responsif |
| `math-generator.html` | **C** | Fungsional lengkap, form kurang feedback & validasi |
| `attendance.html` | **C** | Fungsi jelas, layout A4 tidak responsif + kontras tabel rendah |
| `convert-pdf.html` | **C** | Alur reorder bagus, tanpa loading state & error handling |
| `merge-pdf.html` | **B-** | Sederhana & jelas, perlu loading + handling PDF rusak |
| `handwriting.html` | **B-** | Live preview bagus, tapi tanpa tombol kembali + overflow mobile |
| `wordEditor.html` | **B+** | Alur tab + smart parse terbaik, hanya butuh polish aksesibilitas |
| `soal/index.html` | **B+** | (Bagian 6) Fitur kaya & error handling baik; masalah: mobile layout + guard UI |

📌 **Prioritas #1:** Tambahkan `<meta name="viewport">` di 6 halaman (fix mobile dalam 1 baris per halaman).

---

## 2. Temuan Lintas-Halaman (Cross-Cutting)

| # | Severity | Temuan | Halaman Terdampak |
|---|---|---|---|
| C1 | 🔴 | **Tidak ada `<meta name="viewport">`** → di HP halaman tampil ter-zoom-out / layout bocor | semua kecuali `wordEditor.html` |
| C2 | 🔴 | **Link rusak** di grid utama (`flashcard`, `homework`, `rubric`, `report`) → user masuk halaman 404 | `index.html` |
| C3 | 🟠 | **Kontras teks putih di atas oranye `#ffab19` = ~2.0:1** (gagal AA utk teks normal), hijau `#00c896` putih = ~2.2:1 | header & tombol semua halaman |
| C4 | 🟠 | **Design language tidak konsisten:** header gradien biru→hijau (`index`, `math`), biru→oranye (`attendance`, `convert`, `merge`), biru flat Arial (`wordEditor`), biru Google (`handwriting`); font pun beda (Fredoka/Roboto vs Arial vs Segoe UI) | semua |
| C5 | 🟡 | **Tidak ada `:focus-visible` / focus ring** → pengguna keyboard tidak tahu posisi kursor | semua |
| C6 | 🟡 | **Bahasa tombol campur aduk:** "Generate Worksheet", "Convert Gambar", vs "Cetak", "Bersihkan" | `math`, `convert`, `merge` |
| C7 | 🟡 | **Tanpa `aria-live`** untuk konten dinamis (hasil generate) → screen reader tidak membaca pembaruan | `math`, `wordEditor`, `attendance` |
| C8 | 🟢 | Tidak ada `meta description` & favicon → kualitas hasil pencarian & tab browser | semua |
| C9 | 🟢 | Footer copyright tahun hardcoded `2026` → akan basi | `index`, `math` |

---
## 3. Audit Detail per Halaman

### 3.1 `index.html` — Halaman Utama (Hub)
| Area | Temuan | Severity |
|---|---|---|
| Responsif | Tidak ada viewport meta; grid `repeat(4,1fr)` kaku tanpa breakpoint → di HP (< 360px) kartu jadi ~80px & teks terpotong | 🔴 |
| Navigasi | 4 kartu menunjuk ke file yang belum ada: `flashcard.html`, `homework.html`, `rubric.html`, `report.html` | 🔴 |
| Informasi | Deskripsi singkat per tool pada kartu jelas ✓ | 🟢 |
| Kontras | Judul kartu hijau `#00c896` di atas putih ≈ 2.2:1 — sulit dibaca | 🟠 |
| Interaksi | Hover `translateY` menyenangkan ✓, tapi tak ada state `:focus` untuk keyboard; seluruh kartu adalah `<a>` (target besar ✓) | 🟡 |
| Struktur | Header/footer jelas; hero menyampaikan nilai ✓ | 🟢 |
| Konsistensi | Card-container tanpa label sektor (mis. "Admin", "Materi", "Evaluasi") → user harus membaca semua | 🟡 |

**Saran cepat:**
- Tambah `<meta name="viewport">`, ganti grid dengan `repeat(auto-fit, minmax(220px,1fr))` + media query 768/480px.
- Sembunyikan kartu rusak atau buat placeholder "Segera hadir" (dengan `disabled` style) hingga file dibuat.
- Ikuti pola grid `beginner/` & `kiddy/` yang sudah responsif (`auto-fit`).

### 3.2 `math-generator.html` — Generator Worksheet Matematika
| Area | Temuan | Severity |
|---|---|---|
| Responsif | Grid worksheet 6 kolom tetap (`0.6fr 2fr 2fr 0.6fr 2fr 2fr`) tanpa media query → rusak di layar sempit | 🔴 |
| Validasi | Jika `min > max` (mis. 99 dan 10) hasil `NaN`; tidak ada sanitasi/peringatan | 🟡 |
| Error state | Pesan "Silakan pilih minimal satu operasi." memakai `style="color:red"` di luar form (bukan styled feedback) | 🟡 |
| Feedback | Tombol **Cetak** bisa dipencet sebelum generate → mencetak kosong; tidak ada guard | 🟡 |
| Form UX | Kelompok setting pakai `<h3>` jelas ✓; labels membungkus input (accessible) ✓ | 🟢 |
| Kontras | Teks putih di atas tombol biru `#4d97ff` ≈ 3.3:1 — di bawah AA 4.5:1 untuk teks reguler | 🟠 |
| Icons | Tombol aksi tanpa ikon; jarak antar tombol rapat | 🟡 |

**Saran cepat:**
- Validasi range: `if (min > max) min/max = swap` + pesan inline.
- Cetak: `disabled` bila `worksheetContainer` kosong.
- Tambah loading ringan saat generate (juga mencegah double-click).

### 3.3 `attendance.html` — Generator Absensi
| Area | Temuan | Severity |
|---|---|---|
| Responsif | `.page { width:21cm; height:29.7cm }` + dua kolom 10.5cm → overflow horizontal besar di HP/tablet | 🔴 |
| Cetak | `body{zoom:1.1}` tidak didukung Firefox/Chrome lama → ukuran hasil print tidak konsisten | 🟠 |
| Kontras | Header tabel warna-warni (hijau, merah, ungu, dll) dengan font putih 12px ≈ 2.0–2.6:1 → sulit dibaca | 🟠 |
| Kejelasan | Label radio: "Sekolah", "Privat (Kehadiran)", "Privat (Materi)", "Terapi Wicara" ✓ deskriptif | 🟢 |
| Feedback | Setelah generate tidak ada konfirmasi (mis. "10 tabel dibuat") — user harus scroll ke bawah | 🟡 |
| Type | `button[type="button"]` ✓ (tidak me-refresh halaman) | 🟢 |

**Saran cepat:**
- Saat print: hapus `zoom`, andalkan `@page { size:A4; margin:0 }` + `width:100%` pada `.page`.
- Ganti warna header tabel dengan palet kontras tinggi atau tebal (bold 13-14px).

### 3.4 `convert-pdf.html` — Image/Text → PDF
| Area | Temuan | Severity |
|---|---|---|
| Error handling | `img.type !== "image/jpeg"` diasumsikan PNG → file **WebP/HEIC/GIF akan crash** tanpa pesan (tanpa `try/catch`) | 🟠 |
| Loading | Konversi banyak gambar bisa lama; tombol tidak `disabled` → double-click = 2 PDF terunduh | 🟡 |
| Responsif | Ada media query 600px ✓, tapi tanpa viewport meta tetap muncul zoom-out di HP | 🟠 |
| Alur | List + tombol ↑↓✕ bagus dan jelas ✓; nama file diurutkan ✓ | 🟢 |
| Feedback sukses | Tidak ada pesan sukses, hanya langsung download (bisa terasa "tiba-tiba") | 🟡 |
| TXT spacing | Tiap file teks dipaksa `addPage()` di akhir → selalu ada halaman kosong di akhir dokumen | 🟢 |

### 3.5 `merge-pdf.html` — Penggabung PDF
| Area | Temuan | Severity |
|---|---|---|
| Error handling | PDF **terproteksi password / corrupt** → `PDFDocument.load` melempar error tanpa pesan ramah | 🟠 |
| Loading | Proses gabung beberapa PDF besar bisa lama tanpa indikator; tombol tanpa guard double-click | 🟡 |
| Alur | Sangat sederhana & jelas ✓; alert "Pilih minimal 2 file PDF!" ✓ | 🟢 |
| Kontras | Header dan tombol biru-oranye dengan teks putih → isu kontras yang sama dengan C3 | 🟠 |

### 3.6 `handwriting.html` — Worksheet Menulis
| Area | Temuan | Severity |
|---|---|---|
| Navigasi | **Tidak ada tombol "Home"/kembali** (halaman lain semua punya) → user harus tekan back browser | 🟠 |
| Responsif | `.sheet` 210mm × min-297mm → overflow horizontal di HP; tidak ada transform/zoom-out | 🔴 |
| Live preview | Judul + isi cerita diperbarui real-time ✓ (pola bagus, contoh terbaik di repo) | 🟢 |
| Kontrol cetak | `print-color-adjust: exact` ✓; story-box diganti bg netral saat print ✓ | 🟢 |
| Fleksibilitas | Jumlah baris menulis **fixed** (min-height 800px) — tak bisa diatur (mis. untuk kelas kecil) | 🟡 |
| Kontras | Biru `#1a73e8` + putih bagus ✓; kuning `#fff9c4` + `#333` ✓ | 🟢 |

### 3.7 `wordEditor.html` — Editor Lembar Soal
| Area | Temuan | Severity |
|---|---|---|
| Alur | 2 tab (Input → Hasil Cetak) + auto-switch ke preview setelah Proses ✓ — paling matang di repo | 🟢 |
| Responsif | Ada viewport ✓ + media query 600px (opsi 1 kolom, dotted line wrap) ✓ | 🟢 |
| Empty state | Input kosong → output "Tidak ada data untuk diproses." ✓ | 🟢 |
| Persistensi | Jika user refresh, teks di tab Input hilang — tanpa autosave draft (localStorage) | 🟡 |
| Navigasi | Tidak ada tombol kembali ke Home | 🟡 |
| Parsing | Deteksi instruksi hanya huruf besar `/^[A-E]\.\s/`; baris "a." kecil tak terdeteksi → jadi teks biasa | 🟢 |
| Aksesibilitas | Tab aktif memakai warna+border (bukan hanya warna) ✓; tapi panel tak punya `role="tab"`/ARIA | 🟡 |
| Print | `.preview-box` margin `@page:1.2cm` ✓; content padding-bottom agar tak tertutup action-bar ✓ | 🟢 |

---

## 4. Matriks Rekomendasi Prioritas

### 🔴 Quick Win — Harus (1–2 jam kerja)
| # | Aksi | File |
|---|---|---|
| P1 | Tambah `<meta name="viewport" content="width=device-width, initial-scale=1.0">` | index, math-generator, attendance, convert-pdf, merge-pdf, handwriting |
| P2 | Buat `flashcard`, `homework`, `rubric`, `report` (atau sembunyikan kartunya) | index.html |
| P3 | Tombol **Home/kembali** di `handwriting.html` & `wordEditor.html` | 2 file |

### 🟠 Sedang — Sebaiknya (0.5–1 hari)
| # | Aksi | File |
|---|---|---|
| P4 | Grid index → `auto-fit minmax(220px,1fr)` + breakpoint; ikuti pola beginner/kiddy | index.html |
| P5 | `@media (max-width:600px)` untuk grid worksheet math (1 kolom), `overflow-x:auto` sebagai cadangan | math-generator.html |
| P6 | Hapus `zoom:1.1` di print attendance; kutak-katik ukuran via lebar kolom saja | attendance.html |
| P7 | Error handling `try/catch` + pesan ramah pada `mergePDFs` & `convertImagesToPDF` (support file WeBp via `embedPng` dengan konversi canvas) | merge, convert |
| P8 | Palet aksesibel: teks gelap `#fff`→`#212121` di atas oranye/hijau, atau gelapkan bg (mis. `#e59400`, `#008f6f`) | semua |

### 🟡 Optimalisasi — Bagus untuk punya (berkelanjutan)
| # | Aksi | File |
|---|---|---|
| P9 | Loading state + `disabled` tombol selama proses async; `aria-live` untuk hasil | math, convert, merge |
| P10 | Unifikasi design system: satu set CSS token warna (`#4d97ff`/`#00c896`/`#ffab19`), font Fredoka+Roboto | semua |
| P11 | Auto-detect `mata pelajaran`/`kelas :` & nomor soal dengan normalisasi huruf kecil di wordEditor | wordEditor.html |
| P12 | Autosave draft ke localStorage + debounce preview | wordEditor, handwriting |
| P13 | `aria-label`/`role=tablist` & focus styles, `<noscript>` fallback | semua |

### 🟢 Catatan kecil
- Tahun copyright dari `new Date().getFullYear()`.
- Perkecil PDF Library: `pdf-lib` (≈600KB) hanya dimuat di halaman yang butuh ✓ (sudah benar, tidak perlu diubah).
- Tambahkan `rel="noopener"` jika ada tautan luar.

---

## 5. Skor & Kesimpulan

**Kekuatan utama repo ini:** alur tool singkat (input → generate → cetak), selaras dengan kebutuhan guru di kelas; live-preview di `handwriting`, smart-parse di `wordEditor`, dan reorder file di `convert/merge` adalah UX yang sudah baik.

**Kelemahan terbesar:** kurangnya basis responsif (viewport) dan desain yang terpecah-pecah antar halaman. Memperbaiki **P1–P3** saja sudah menaikkan kesan profesional secara signifikan; **P4–P8** menuntaskan masalah pokok pada pengalaman mobile dan aksesibilitas.
## 6. Audit Folder `soal/` — `soal/index.html` (Generator Soal AI)

> **Status file yang diaudit:** versi terkini (1.651 baris) — sudah melewati perbaikan besar sejak iterasi awal: API key *tidak lagi hardcoded*, kelas diperluas ke 1–6 SD, ada validasi+error handling, `escapeHTML` (anti-XSS), toast, simpan/muat soal, model dinaikkan ke `llama-3.3-70b-instruct`.
> **Skor keseluruhan: B+** — salah satu halaman paling matang di repo.

### 6.1 Yang sudah baik ✓
| Fitur | Catatan |
|---|---|
| Layout 2 panel | Sidebar (320px) + main preview; scroll mandiri di desktop — nyaman untuk kerja panjang |
| Cascading dropdown | Kelas → Mapel → Kisi-kisi mengalir alami; kisi ter-reset saat ganti kelas/mapel ✓ |
| Database kisi | Lengkap kelas 1–6 SD per mapel; cukup untuk seluruh jenjang SD |
| Loading state | Spinner + teks "Sedang membuat X PG & Y Esai..." + info mapel/kisi dipilih ✓ |
| Error handling | `response.ok`, pesan error NVIDIA, `try/catch` JSON, empty-state error dengan saran pemulihan ✓ |
| Keamanan | Semua input AI di-`escapeHTML()` (anti-XSS); API key disimpan di `localStorage`, bukan di HTML ✓ |
| Simpan/Muat | `localStorage` + toast konfirmasi + recovery validasi data; tombol Simpan muncul hanya jika ada soal ✓ |
| Cetak/PDF | Mode hemat (2 kolom), kunci ringkas di halaman baru (`page-break-before`), `print-color-adjust` ✓ |
| Aksesibilitas dasar | Ada viewport ✓, dark-mode via CSS vars ✓, label `for` pada sebagian kontrol ✓ |

### 6.2 Temuan & Rekomendasi

| # | Severity | Temuan | Saran |
|---|---|---|---|
| S1 | 🟠 | **Layout tidak responsif:** `.container { grid-template-columns: 320px 1fr; height:100vh }` tanpa media query → di tablet/HP sidebar 320px tetap menempel, sisa layar menyempit | Media query `<1024px`: ubah ke 1 kolom (sidebar di atas, main di bawah), `height:auto` + `min-height` |
| S2 | 🟠 | **Tanpa guard generate:** tombol Generate tidak di-`disabled` selama fetch → double-click membuat request paralel & menimpa hasil | Flag `isGenerating` + `disabled`, nonaktifkan field sidebar saat loading |
| S3 | 🟠 | **"Muat Soal" menimpa soal tanpa konfirmasi** — jika belum disimpan, pekerjaan hilang | `confirm()` sebelum load; tampilkan info soal tersimpan (jumlah/kelas/mapel/tanggal) |
| S4 | 🟡 | **API key UX minim:** key disimpan diam-diam, tak ada cara hapus, tak ada hint cara mendapatkannya | Tombol "Hapus Key", teks kecil "Key tersimpan di browser ini", link NVIDIA build key |
| S5 | 🟡 | **2 kontrol kunci membingungkan:** "Tampilkan Kunci Jawaban (layar)" vs "Halaman Kunci Jawaban Ringkas" — yang kedua hanya berpengaruh saat **print**, tak tampak di layar | Tooltip/deskripsi kecil pada label kunciRingkas + tampilkan efeknya di preview |
| S6 | 🟡 | **Slider font hanya memengaruhi layar** — di print `.hemat` memakai `12.5px !important` (mengalahkan inline style) tanpa keterangan | Tambahkan keterangan "(pratinjau layar)" dan opsional terapkan ke print |
| S7 | 🟡 | **`max_tokens: 4096`:** untuk 25 PG + 10 esai berisiko output terpotong → JSON gagal parse | Naikkan (mis. 8192) + validasi jumlah soal yang diterima vs diminta, tampilkan peringatan |
| S8 | 🟡 | **Kontras kecil:** `.jawaban-label` hijau `#16a34a` 11px uppercase di bg-light ≈ 3:1 (gagal AA); `.kunci-sub` di dark+print memakai `--text-secondary` yang jadi terang di atas putih | Gelapkan `#15803d`, font 12px semibold; paksa warna gelap pada elemen kunci saat print |
| S9 | 🟡 | **Fokus tak dikelola:** setelah generate, kursor tidak berpindah ke hasil (pengguna mouse/HP harus scroll manual) | `soalContainer.tabIndex=-1` + `focus()` + scrollIntoView setelah render; tambah `aria-live` |
| S10 | 🟡 | **Dark mode parsial:** `.identitas-grid`, `.petunjuk-box`, `.pembahasan`, `.opsi.jawaban-benar` memakai warna pastel hardcoded yang tetap terang di dark mode | Konversi ke CSS variable / tambah override dark |
| S11 | 🟢 | **Semantik heading:** tidak ada `h1` (langsung `h2`) — kurang untuk SEO/a11y | Ganti "Setup Generator Soal" jadi `h1` |
| S12 | 🟢 | Tombol ikon **✕ hapus kisi tanpa `aria-label`**; target klik kecil (2px padding) | Tambah `aria-label="Hapus kisi"` + perbesar padding |
| S13 | 🟢 | **`html2pdf.js` (≈2MB) dimuat di awal** padahal hanya dipakai saat "Download PDF" | Load dinamis (inject `<script>` pada `exportPDF`) agar first-paint lebih cepat |
| S14 | 🟢 | Konsistensi mapel antarkelas kurang seragam (Kelas 1–2 tak punya IPA/IPS maupun IPAS, Kelas 3–4 "IPAS", Kelas 5–6 "IPA"/"IPS" terpisah) | Tampilkan label kurikulum atau satukan penamaan agar guru tidak bingung |
| S15 | 🟢 | Edit jawaban PG bebas teks (bisa ketik "benar") → kunci tampil aneh | Validasi huruf a-d saat edit + toast jika invalid |
| S16 | 🔴 | **Model AI sudah EOL:** `meta/llama-3.3-70b-instruct` dihapus NVIDIA sejak **26-08-2026** (HTTP 410). Tombol Generate Soal saat ini **dipastikan gagal** hingga model diganti | Ganti field `model` di `fetch()` ke model aktif (verifikasi 2026-09-14): `openai/gpt-oss-20b`, `google/gemma-3-12b-it`, `google/gemma-4-31b-it`, `deepseek-ai/deepseek-v4-flash-0731`, `nvidia/llama-3.1-nemotron-70b-instruct`, atau `mistralai/mistral-large` |

### 6.3 Prioritas untuk folder `soal/`
0. **S16 (🔴 kritis, 5 menit)** — ganti `model` AI yang EOL; tanpa ini fitur utama mati total.
1. **S1 + S2** (½ hari) — responsif + guard generate: dampak terbesar.
2. **S3 + S4** (½ hari) — keamanan data & API key UX.
3. **S5–S9** (1 hari) — kejelasan kontrol cetak, token kecukupan, fokus/a11y.
4. **S10–S15** (sprint berikutnya) — polish dark mode, semantik, performa, konsistensi.

> ⚠️ **Catatan keamanan (bukan hanya UI/UX):** API key NVIDIA disimpan `localStorage` plaintext — aman dari *repo publik*, tapi tetap bisa dicuri bila ada XSS lain di halaman; rekomendasi jangka panjang adalah proxy endpoint (backend serverless).