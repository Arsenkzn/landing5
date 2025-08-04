let solPrice = 160; // Starting price

function updateSOLPrice() {
  // Simulate price fluctuation
  const change = (Math.random() - 0.5) * 10;
  solPrice = Math.max(100, solPrice + change);

  if (typeof updateSOLPrice === "function") {
    window.updateSOLPrice(solPrice);
  }

  // Update every 30 seconds
  setTimeout(updateSOLPrice, 30000);
}
