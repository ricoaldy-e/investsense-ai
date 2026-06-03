# InvestSense AI

## Deskripsi Singkat Proyek
InvestSense AI adalah platform pendukung keputusan investasi saham (stock decision support) yang ditenagai oleh kecerdasan buatan (AI). Dirancang khusus untuk membantu investor pemula di pasar modal Indonesia (IHSG), platform ini menyediakan katalog saham real-time, manajemen *watchlist*, sentimen berita pasar, serta asisten AI interaktif. Tujuan utama dari InvestSense AI adalah untuk menetralkan bias psikologis (seperti FOMO) dan menyajikan wawasan pasar berbasis data agar pengguna dapat mengambil keputusan finansial yang lebih rasional dan terstruktur.

## Petunjuk Setup Proyek

Sebelum memulai, pastikan perangkat Anda telah memenuhi prasyarat berikut:
- **Node.js** (versi 18.x atau lebih baru sangat disarankan)
- **NPM** (Node Package Manager) yang biasanya sudah terinstal bersama Node.js
- Koneksi internet untuk mengunduh *dependencies* dan terhubung ke API backend.

## Cara Instalasi Proyek

Ikuti langkah-langkah di bawah ini untuk menginstal proyek di lingkungan lokal Anda:

1. **Clone repositori ini** (atau *extract* folder proyek) dan buka terminal di dalam direktori proyek:
   ```bash
   cd investsense-ai
   ```

2. **Instal seluruh *dependencies*** menggunakan NPM:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**
   - Duplikat file `.env.example` yang telah disediakan dan ubah namanya menjadi `.env`.
   - Buka file `.env` dan pastikan variabel di dalamnya sudah sesuai (Anda bisa menggunakan *default* yang terhubung langsung ke backend server Hugging Face).

## Petunjuk Penggunaan

Setelah berhasil masuk ke dalam aplikasi, Anda dapat menggunakan beberapa fitur utama berikut:
1. **Stock Catalog:** Telusuri berbagai saham IHSG. Anda dapat melihat detail grafik harga, indikator RSI, serta analisis fundamental singkat yang di-generate oleh AI.
2. **Watchlist:** Tambahkan saham-saham pantauan Anda ke dalam Watchlist untuk akses dan monitoring yang lebih cepat.
3. **Market Insight:** Baca berita-berita ekonomi terkini yang dilengkapi dengan indikator sentimen (Positif, Negatif, Netral) otomatis dari AI.
4. **AI Assistant:** Gunakan tombol robot (chat panel) untuk bertanya secara langsung mengenai metrik sebuah saham (contoh: "Bagaimana prospek BBCA hari ini?"). AI akan menjawab berdasarkan data faktual.

## Cara Menjalankan Aplikasi

Untuk menjalankan aplikasi ini di tahap pengembangan (*development server*), jalankan perintah berikut di terminal:

```bash
npm run dev
```

Aplikasi akan otomatis berjalan di *localhost* (biasanya di `http://localhost:5173/`). Buka link tersebut melalui *browser* Anda.

## Informasi Penting Lainnya Terkait Proyek

- **Bukan Nasihat Keuangan:** Platform ini adalah alat bantu edukasi berbasis algoritma. Semua data dan analisis dari AI **bukan** merupakan nasihat keuangan profesional (Not Financial Advice). Risiko investasi ditanggung sepenuhnya oleh pengguna.
- **Keamanan Akun:** Aplikasi menggunakan arsitektur keamanan standar industri berupa *Access Token* di LocalStorage dan *Refresh Token* di HTTP-Only Cookie untuk mencegah serangan XSS. Jika *session* kedaluwarsa, sistem akan me-*logout* Anda secara otomatis.
- **Batasan Akses API:** Tergantung dari beban server backend (terutama karena backend API saat ini di-*host* pada *Free Tier* Hugging Face), respons AI terkadang mungkin membutuhkan waktu beberapa detik lebih lama saat *cold start*.