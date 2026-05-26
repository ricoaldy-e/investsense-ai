// import api from './api';
import { delay } from './utils';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

export const chatService = {
  async sendMessage(query) {
    if (USE_MOCK) {
      // Simulasi waktu berpikir AI (1.5 detik)
      await delay(1500);

      const lowerQuery = query.toLowerCase();

      // Jika pengguna bertanya tentang saham spesifik (misal AAPL atau TSLA)
      if (lowerQuery.includes('aapl') || lowerQuery.includes('apple')) {
        return {
          id: Date.now(),
          role: 'ai',
          type: 'text',
          content: "Berdasarkan data terbaru, Apple Inc. (AAPL) menunjukkan momentum kenaikan yang stabil (RSI 65.4). Tetap pertahankan disiplin alokasi modal dan hindari aksi spekulatif. Pertimbangkan posisi masuk setelah terjadi koreksi teknis."
        };
      }

      if (lowerQuery.includes('tsla') || lowerQuery.includes('tesla')) {
        return {
          id: Date.now(),
          role: 'ai',
          type: 'text',
          content: "Tesla (TSLA) sedang mengalami tekanan jual yang signifikan dengan volatilitas tinggi. Menangkap pisau jatuh (catching a falling knife) sangat berbahaya. Pantau terus hingga ada sinyal pembalikan arah yang jelas."
        };
      }

      if (lowerQuery.includes('risiko') || lowerQuery.includes('risk')) {
        return {
          id: Date.now(),
          role: 'ai',
          type: 'text',
          content: "Manajemen risiko adalah kunci. Jangan pernah menginvestasikan uang yang Anda tidak rela kehilangannya. Diversifikasi portofolio Anda dan selalu siapkan dana darurat."
        };
      }

      // Default response
      return {
        id: Date.now(),
        role: 'ai',
        type: 'text',
        content: "Saya adalah Asisten InvestSense AI. Saya dapat menganalisis saham spesifik (seperti AAPL atau TSLA), memberikan wawasan sentimen pasar, atau menjelaskan konsep investasi. Apa yang ingin Anda analisis hari ini?"
      };
    } else {
      // Future integration with Real AI Backend (FastAPI)
      // const response = await api.post('/chat/send', { query });
      // return response.data;
      throw new Error("Real API not implemented yet");
    }
  }
};

