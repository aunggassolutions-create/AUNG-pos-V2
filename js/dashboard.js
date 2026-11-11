const dashboard = {
  async render() {
    const sales = await db.getAll('sales') || [];
    const expenses = await db.getAll('expenses') || [];
    const customers = await db.getAll('customers') || [];
    const products = await db.getAll('products') || [];

    const todayStr = new Date().toISOString().split('T')[0];

    let todaySales = 0;
    let todayProfit = 0;
    let todayCount = 0;

    sales.forEach(sale => {
      if (sale.date && sale.date.startsWith(todayStr)) {
        todaySales += Number(sale.totalAmount || 0);
        todayProfit += Number(sale.totalProfit || 0);
        todayCount++;
      }
    });

    let todayExpenses = 0;
    expenses.forEach(exp => {
      if (exp.date && exp.date.startsWith(todayStr)) {
        todayExpenses += Number(exp.amount || 0);
      }
    });

    let totalCredit = 0;
    customers.forEach(cust => {
      totalCredit += Number(cust.outstandingBalance || 0);
    });

    let lowStockCount = 0;
    products.forEach(prod => {
      if (Number(prod.currentStock || 0) <= Number(prod.minStock || 5)) {
        lowStockCount++;
      }
    });

    const container = document.getElementById('mainContent');
    container.innerHTML = `
      <h2>လုပ်ငန်းသုံး ဒက်ရှ်ဘုတ် (Dashboard)</h2>
      <p style="color: var(--text-muted); margin-bottom: 20px;">AUNG Gas Solutions - ဇင်မာလမ်း၊ တာမွေ/သက္ကတမြို့နယ်</p>
      
      <div class="grid-4">
        <div class="stat-card">
          <h3>ယနေ့ ရောင်းရငွေ (Today's Sales)</h3>
          <div class="value">${todaySales.toLocaleString()} ကျပ်</div>
        </div>
        <div class="stat-card">
          <h3>ယနေ့ အမြတ်ငွေ (Gross Profit)</h3>
          <div class="value" style="color: var(--success);">${todayProfit.toLocaleString()} ကျပ်</div>
        </div>
        <div class="stat-card">
          <h3>ယနေ့ ကုန်ကျစရိတ် (Expenses)</h3>
          <div class="value" style="color: var(--danger);">${todayExpenses.toLocaleString()} ကျပ်</div>
        </div>
        <div class="stat-card">
          <h3>စုစုပေါင်း အကြွေးကျန် (Credit)</h3>
          <div class="value" style="color: var(--warning);">${totalCredit.toLocaleString()} ကျပ်</div>
        </div>
      </div>

      <div class="card">
        <h3>သတိပေးချက်များနှင့် မကြာသေးမီက အရောင်းအဝယ်များ</h3>
        <p style="margin-top: 8px;">လက်ရှိ ပစ္စည်းလက်ကျန်နည်းနေသော ပစ္စည်းအရေအတွက်: <strong>${lowStockCount} ခု</strong></p>
        <p>ယနေ့ စုစုပေါင်း အရောင်းဘောက်ချာ အရေအတွက်: <strong>${todayCount} ခု</strong></p>
      </div>

      <div class="card">
        <h3>နောက်ဆုံးပြုလုပ်ခဲ့သော အရောင်းစာရင်းများ</h3>
        <table>
          <thead>
            <tr>
              <th>ဘောက်ချာ နံပါတ်</th>
              <th>ရက်စွဲ</th>
              <th>ဖောက်သည်</th>
              <th>စုစုပေါင်း (ကျပ်)</th>
              <th>ငွေပေးချေမှု</th>
            </tr>
          </thead>
          <tbody>
            ${sales.slice(-5).reverse().map(s => `
              <tr>
                <td>${s.id}</td>
                <td>${s.date}</td>
                <td>${s.customerName || 'ငွေသားဖောက်သည်'}</td>
                <td>${Number(s.totalAmount).toLocaleString()}</td>
                <td>${s.paymentMethod || 'Cash'}</td>
              </tr>
            `).join('') || '<tr><td colspan="5" style="text-align:center;">အရောင်းစာရင်း မရှိသေးပါ။</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }
};
