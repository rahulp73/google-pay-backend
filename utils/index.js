function handleCashback(amount) {
    let cashbackPercentage = 0;
  
    if (amount % 500 === 0) {
      console.log('No cashback for multiples of 500.');
      return 0;
    }
  
    if (amount < 1000) {
      cashbackPercentage = 0.05;
    } else {
      cashbackPercentage = 0.02;
    }
  
    const cashbackAmount = amount * cashbackPercentage;
    console.log(`Cashback: ${cashbackAmount}`);
    return cashbackAmount;
  }
  
  module.exports = { handleCashback };
  