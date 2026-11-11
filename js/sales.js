const salesModule = {
  cart: [],

  async render() {
    const container = document.getElementById('mainContent');
    const productsList = await db.getAll('products') || [];
    const customersList = await db.getAll('customers') || [];

    container.innerHTML = `
      <h2>🛒 POS အရောင်းကောင်တာ (Sales Management)</h2>
      <p style="color: var(--text-muted); margin-bottom: 20px;">AUNG Gas Solutions - ဇင်္ဂမလမ်း၊ သာကေတမြို့နယ်</p>

      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px;">
        <!-- Product Selection -->
        <div class="card">
          <h3>ပစ္စည်းများ ရွေးချယ်ရန်</h3>
          <div style="margin: 10px 0;">
            <input type="text" id="searchProduct" placeholder="ပစ္စည်းရှာရန်..." style="width:100%; padding:8px; border:1px solid var(--border-color); border-radius:4px;" onkeyup="salesModule.filterProducts()">
          </div>
          <div id="productListContainer" style="max-height: 400px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; margin-top: 10px;">
            ${productsList.map(p => `
              <div onclick="salesModule.addToCart(${p.id}, '${p.name}', ${p.sellingPrice}, ${p.costPrice}, ${p.currentStock})" style="background:var(--bg-color); border:1px solid var(--border-color); border-radius:6px; padding:10px; cursor:pointer; text-align:center;">
                <strong style="font-size:0.9rem; display:block; margin-bottom:4px;">${p.name}</strong>
                <span style="font-size:0.8rem; color:var(--orange); font-weight:600;">${Number(p.sellingPrice).toLocaleString()} ကျပ်</span>
                <div style="font-size:0.75rem; color:var(--text-muted);">လက်ကျန်: ${p.currentStock}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Cart & Checkout -->
        <div class="card">
          <h3>ဝယ်ယူမည့်စာရင်း (Cart)</h3>
          <div style="max-height: 200px; overflow-y: auto; margin-top: 10px;">
            <table style="font-size: 0.85rem;">
              <thead>
                <tr>
                  <th>ပစ္စည်း</th>
                  <th>ခုရေ</th>
                  <th>စုစုပေါင်း</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="cartTableBody">
                <tr><td colspan="4" style="text-align:center;">ပစ္စည်း ရွေးချယ်ထားခြင်း မရှိပါ။</td></tr>
              </tbody>
            </table>
          </div>

          <div style="margin-top: 15px; border-top: 1px solid var(--border-color); padding-top: 10px;">
            <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:1.1rem; margin-bottom:10px;">
              <span>စုစုပေါင်းကျသင့်ငွေ:</span>
              <span id="cartTotalDisplay" style="color:var(--orange);">0 ကျပ်</span>
            </div>

            <div style="margin-bottom: 10px;">
              <label style="font-size:0.85rem; font-weight:600;">ဖောက်သည် အမည်:</label>
              <select id="saleCustomer" style="width:100%; padding:6px; border:1px solid var(--border-color); border-radius:4px; margin-top:4px;">
                <option value="">ငွေသားဖောက်သည် (Walk-in Customer)</option>
                ${customersList.map(c => `<option value="${c.name}">${c.name} (${c.phone || ''})</option>`).join('')}
              </select>
            </div>

            <div style="margin-bottom: 10px;">
              <label style="font-size:0.85rem; font-weight:600;">ငွေပေးချေမှု နည်းလမ်း:</label>
              <select id="paymentMethod" style="width:100%; padding:6px; border:1px solid var(--border-color); border-radius:4px; margin-top:4px;">
                <option value="Cash">ငွေသား (Cash)</option>
                <option value="Mobile Payment">မိုဘိုင်းငွေပေးချေမှု (KPay / Wave)</option>
                <option value="Credit">အကြွေး (Credit)</option>
              </select>
            </div>

            <button class="btn" style="width:100%; margin-top:10px; background-color:var(--success);" onclick="salesModule.checkout()">အရောင်းအတည်ပြုမည် (Checkout)</button>
          </div>
        </div>
      </div>
    `;
  },

  addToCart(id, name, sellingPrice, costPrice, currentStock) {
    if (currentStock <= 0) {
      alert('ဤပစ္စည်း လက်ကျန် မရှိတော့ပါ။');
      return;
    }

    const existing = this.cart.find(item => item.id === id);
    if (existing) {
      if (existing.qty < currentStock) {
        existing.qty++;
      } else {
        alert('လက်ရှိ လက်ကျန်ပမာဏထက် ကျော်လွန်နေပါသည်။');
      }
    } else {
      this.cart.push({ id, name, sellingPrice, costPrice, qty: 1, currentStock });
    }
    this.renderCart();
  },

  renderCart() {
    const tbody = document.getElementById('cartTableBody');
    const totalDisplay = document.getElementById('cartTotalDisplay');

    if (this.cart.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">ပစ္စည်း ရွေးချယ်ထားခြင်း မရှိပါ။</td></tr>';
      totalDisplay.innerText = '0 ကျပ်';
      return;
    }

    let total = 0;
    tbody.innerHTML = this.cart.map((item, index) => {
      const subtotal = item.sellingPrice * item.qty;
      total += subtotal;
      return `
        <tr>
          <td>${item.name}</td>
          <td><input type="number" value="${item.qty}" min="1" max="${item.currentStock}" style="width:40px;" onchange="salesModule.updateQty(${index}, this.value)"></td>
          <td>${subtotal.toLocaleString()}</td>
          <td><button onclick="salesModule.removeItem(${index})" style="color:var(--danger); border:none; background:none; cursor:pointer;">✕</button></td>
        </tr>
      `;
    }).join('');

    totalDisplay.innerText = total.toLocaleString() + ' ကျပ်';
  },

  updateQty(index, val) {
    const qty = parseInt(val);
    if (qty > 0 && qty <= this.cart[index].currentStock) {
      this.cart[index].qty = qty;
    } else {
      alert('လက်ကျန်ပမာဏ မှားယွင်းနေပါသည်။');
    }
    this.renderCart();
  },

  removeItem(index) {
    this.cart.splice(index, 1);
    this.renderCart();
  },

  async checkout() {
    if (this.cart.length === 0) {
      alert('ဝယ်ယူမည့်စာရင်းတွင် ပစ္စည်းမရှိပါ။');
      return;
    }

    const customerName = document.getElementById('saleCustomer').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const now = new Date();
    const saleId = 'INV-' + now.getTime().toString().slice(-6);

    let totalAmount = 0;
    let totalProfit = 0;

    this.cart.forEach(item => {
      totalAmount += item.sellingPrice * item.qty;
      totalProfit += (item.sellingPrice - item.costPrice) * item.qty;
    });

    const saleRecord = {
      id: saleId,
      date: now.toISOString(),
      customerName: customerName || 'ငွေသားဖောက်သည်',
      items: [...this.cart],
      totalAmount,
      totalProfit,
      paymentMethod,
      paymentStatus: paymentMethod === 'Credit' ? 'Pending' : 'Paid'
    };

    // Save sale
    await db.add('sales', saleRecord);

    // Update product stock
    for (const item of this.cart) {
      const allProducts = await db.getAll('products') || [];
      const prod = allProducts.find(p => p.id === item.id);
      if (prod) {
        prod.currentStock -= item.qty;
        await db.put('products', prod);
      }
    }

    // If credit customer, update customer balance
    if (paymentMethod === 'Credit' && customerName) {
      const customers = await db.getAll('customers') || [];
      let cust = customers.find(c => c.name === customerName);
      if (cust) {
        cust.outstandingBalance = (cust.outstandingBalance || 0) + totalAmount;
        await db.put('customers', cust);
      } else {
        await db.add('customers', {
          name: customerName,
          phone: '',
          address: 'သက္ကတမြို့နယ်',
          outstandingBalance: totalAmount
        });
      }
    }

    alert(`အရောင်းအောင်မြင်ပါသည်! ဘောက်ချာနံပါတ်: ${saleId}`);
    this.cart = [];
    this.render();
  }
};
