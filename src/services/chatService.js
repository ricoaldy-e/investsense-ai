// Simulate network delay for AI processing
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const chatService = {
  async sendMessage(query) {
    // Simulasi waktu berpikir AI (1.5 detik)
    await delay(1500);

    const lowerQuery = query.toLowerCase();

    // Jika pengguna bertanya tentang saham spesifik (misal AAPL atau TSLA)
    if (lowerQuery.includes('aapl') || lowerQuery.includes('apple')) {
      return {
        id: Date.now(),
        role: 'ai',
        type: 'text',
        content: "Berdasarkan data terbaru, Apple Inc. (AAPL) menunjukkan momentum kenaikan yang stabil (RSI 65.4). Namun, ingatlah untuk tidak terjebak FOMO. Tunggu koreksi kecil sebelum menambah posisi Anda."
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
};
