import api from './api';
import { delay } from './utils';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

export const chatService = {
  /**
   * sendMessage — Sends a user message to the RAG chatbot.
   *
   * Real API mode:
   *   POST /api/v1/chat
   *   Body: { user_message: string }
   *   Response: { success, ticker_detected, answer }
   *
   * Returns a message object matching the shape expected by AIChatPanel.
   */
  async sendMessage({ message, ticker }) {
    if (USE_MOCK) {
      // Simulasi waktu berpikir AI (1.5 detik)
      await delay(1500);

      const lowerQuery = message.toLowerCase();

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
    }

    // ─── Real API Mode ──────────────────────────────────────────────────
    try {
      const finalMessage = ticker 
        ? `${message} (Context: Please analyze specifically for ticker ${ticker})` 
        : message;

      const response = await api.post('/chat', {
        user_message: finalMessage,
      });

      const data = response.data;

      if (!data.success || !data.answer) {
        throw new Error('AI response was empty or invalid.');
      }

      return {
        id: Date.now(),
        role: 'ai',
        type: 'text',
        content: data.answer,
        // Extra metadata from BE — can be used by the panel for context indicators
        tickerDetected: data.ticker_detected || null,
      };
    } catch (error) {
      // Handle specific BE error responses
      if (error.response?.status === 503) {
        return {
          id: Date.now(),
          role: 'ai',
          type: 'error',
          content: 'Mentor AI sedang tidak tersedia. Silakan coba beberapa saat lagi.',
        };
      }

      if (error.response?.status === 401) {
        return {
          id: Date.now(),
          role: 'ai',
          type: 'error',
          content: 'Sesi Anda telah berakhir. Silakan login ulang untuk menggunakan AI Assistant.',
        };
      }

      if (error.response?.status === 400) {
        return {
          id: Date.now(),
          role: 'ai',
          type: 'error',
          content: 'Pesan tidak dapat diproses. Pastikan pesan Anda tidak kosong.',
        };
      }

      // Re-throw for generic errors so AIChatPanel's catch block handles it
      throw error;
    }
  }
};
