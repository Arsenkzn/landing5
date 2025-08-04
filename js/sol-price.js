let solPrice = 160; // Начальная цена

// Функция для обновления цены SOL
function updateSOLPrice() {
  // 1. Сначала получаем реальную цену с CoinGecko
  fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
  )
    .then((response) => response.json())
    .then((data) => {
      const apiPrice = data.solana.usd;

      // 2. Добавляем случайные колебания к реальной цене
      const change = (Math.random() - 0.5) * 10;
      solPrice = Math.max(100, apiPrice + change);

      // 3. Обновляем интерфейс
      if (typeof window.updateSOLPrice === "function") {
        window.updateSOLPrice(solPrice);
      }

      // 4. Планируем следующее обновление через 30 секунд
      setTimeout(updateSOLPrice, 30000);
    })
    .catch((error) => {
      console.error("Error fetching SOL price:", error);

      // Если API не доступно, используем локальное значение с колебаниями
      const change = (Math.random() - 0.5) * 10;
      solPrice = Math.max(100, solPrice + change);

      if (typeof window.updateSOLPrice === "function") {
        window.updateSOLPrice(solPrice);
      }

      setTimeout(updateSOLPrice, 30000);
    });
}

// Первоначальный вызов
updateSOLPrice();
