const products = {
  async render() {
    const container = document.getElementById('mainContent');
    const allProducts = await db.getAll('products') || [];

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div>
          <h2>📦 ပစ္စည်းစာရင်း စီမံခန့်ခွဲမှု (Product Management)</h2>
          <p style="color: var(--text-muted);">AUNG Gas Solutions - ဇင်္ဂမလမ်း၊ သာကေတမြို့နယ်</p>
        </div>
        <button class="btn" onclick="products.openModal()">+ ပစ္စည်းအသစ် ထည့်ရန်</button>
      </div>

      <div class="card">
        <table>
          <thead>
            <tr>
              <th>စဥ်</th>
              <th>ပစ္စည်းအမည်</th>
              <th>အမျိုးအစား (Category)</th>
              <th>အရွယ်အစား/ယူနစ်</th>
              <th>ဝယ်ဈေး (ကျပ်)</th>
              <th>ရောင်းဈေး (ကျပ်)</th>
              <th>လက်ကျန်</th>
              <th>လုပ်ဆောင်ချက်</th>
            </tr>
          </thead>
          <tbody>
            ${allProducts.map((p, index) => `
              <tr>
                <td>${index + 1}</td>
                <td><strong>${p.name}</strong></td>
                <td>${p.category}</td>
                <td>${p.size || '-'}</td>
                <td>${Number(p.costPrice || 0).toLocaleString()}</td>
                <td>${Number(p.sellingPrice || 0).toLocaleString()}</td>
                <td><span style="color: ${Number(p.currentStock) <= Number(p.minStock) ? 'var(--danger)' : 'var(--success)'}; font-weight: bold;">${p.currentStock} ${p.unit || 'ခု'}</span></td>
                <td>
                  <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.8rem;" onclick="products.edit(${p.id})">ပြင်ရန်</button>
                  <button class="btn" style="background-color: var(--danger); padding: 4px 8px; font-size: 0.8rem;" onclick="products.remove(${p.id})">ဖျက်ရန်</button>
                </td>
              </tr>
            `).join('') || '<tr><td colspan="8" style="text-align:center;">ပစ္စည်းစာရင်း မရှိသေးပါ။</td></tr>'}
          </tbody>
        </table>
      </div>

      <!-- Product Modal -->
      <div id="productModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:2000; justify-content:center; align-items:center;">
        <div style="background:var(--card-bg); padding:24px; border-radius:8px; width:100%; max-width:500px; max-height:90vh; overflow-y:auto;">
          <h3 id="modalTitle" style="margin-bottom: 16px;">ပစ္စည်းအသစ် ထည့်သွင်းရန်</h3>
          <form id="productForm" onsubmit="products.save(event)">
            <input type="hidden" id="prodId">
            <div style="margin-bottom: 12px;">
              <label style="display:block; margin-bottom:4px; font-weight:600;">ပစ္စည်းအမည်</label>
              <input type="text" id="prodName" required style="width:100%; padding:8px; border:1px solid var(--border-color); border-radius:4px;">
            </div>
            <div style="margin-bottom: 12px;">
              <label style="display:block; margin-bottom:4px; font-weight:600;">အမျိုးအစား (Category)</label>
              <select id="prodCategory" style="width:100%; padding:8px; border:1px solid var(--border-color); border-radius:4px;">
                <option value="LPG Gas">LPG Gas (ဓာတ်ငွေ့)</option>
                <option value="Oxygen">Oxygen (အောက်ဆီဂျင်)</option>
                <option value="Gas Stoves">Gas Stoves (မီးဖိုများ)</option>
                <option value="Gas Accessories">Gas Accessories (ဆက်စပ်ပစ္စည်းများ)</option>
              </select>
            </div>
            <div style="margin-bottom: 12px;">
              <label style="display:block; margin-bottom:4px; font-weight:600;">အရွယ်အစား / ယူနစ် (ဥပမာ - 48kg, 15kg, ဗူး)</label>
              <input type="text" id="prodSize" style="width:100%; padding:8px; border:1px solid var(--border-color); border-radius:4px;">
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
              <div>
                <label style="display:block; margin-bottom:4px; font-weight:600;">ဝယ်ဈေး (ကျပ်)</label>
                <input type="number" id="prodCost" required style="width:100%; padding:8px; border:1px solid var(--border-color); border-radius:4px;">
              </div>
              <div>
                <label style="display:block; margin-bottom:4px; font-weight:600;">ရောင်းဈေး (ကျပ်)</label>
                <input type="number" id="prodPrice" required style="width:100%; padding:8px; border:1px solid var(--border-color); border-radius:4px;">
              </div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
              <div>
                <label style="display:block; margin-bottom:4px; font-weight:600;">လက်ရှိ လက်ကျန်</label>
                <input type="number" id="prodStock" required style="width:100%; padding:8px; border:1px solid var(--border-color); border-radius:4px;">
              </div>
              <div>
                <label style="display:block; margin-bottom:4px; font-weight:600;">အနည်းဆုံး သတိပေးလက်ကျန် (Min Stock)</label>
                <input type="number" id="prodMinStock" value="5" required style="width:100%; padding:8px; border:1px solid var(--border-color); border-radius:4px;">
              </div>
            </div>
            <div style="display:flex; justify-content:flex-end; gap: 10px;">
              <button type="button" class="btn btn-secondary" onclick="products.closeModal()">မလုပ်တော့ပါ</button>
              <button type="submit" class="btn">သိမ်းဆည်းမည်</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  openModal() {
    document.getElementById('modalTitle').innerText = 'ပစ္စည်းအသစ် ထည့်သွင်းရန်';
    document.getElementById('productForm').reset();
    document.getElementById('prodId').value = '';
    document.getElementById('productModal').style.display = 'flex';
  },

  closeModal() {
    document.getElementById('productModal').style.display = 'none';
  },

  async save(event) {
    event.preventDefault();
    const id = document.getElementById('prodId').value;
    const data = {
      name: document.getElementById('prodName').value,
      category: document.getElementById('prodCategory').value,
      size: document.getElementById('prodSize').value,
      costPrice: Number(document.getElementById('prodCost').value),
      sellingPrice: Number(document.getElementById('prodPrice').value),
      currentStock: Number(document.getElementById('prodStock').value),
      minStock: Number(document.getElementById('prodMinStock').value),
      unit: 'ခု'
    };

    if (id) {
      data.id = Number(id);
      await db.put('products', data);
    } else {
      await db.add('products', data);
    }

    this.closeModal();
    this.render();
  },

  async edit(id) {
    const allProducts = await db.getAll('products') || [];
    const prod = allProducts.find(p => p.id === id);
    if (!prod) return;

    document.getElementById('modalTitle').innerText = 'ပစ္စည်းစာရင်း ပြင်ဆင်ရန်';
    document.getElementById('prodId').value = prod.id;
    document.getElementById('prodName').value = prod.name;
    document.getElementById('prodCategory').value = prod.category;
    document.getElementById('prodSize').value = prod.size || '';
    document.getElementById('prodCost').value = prod.costPrice;
    document.getElementById('prodPrice').value = prod.sellingPrice;
    document.getElementById('prodStock').value = prod.currentStock;
    document.getElementById('prodMinStock').value = prod.minStock || 5;

    document.getElementById('productModal').style.display = 'flex';
  },

  async remove(id) {
    if (confirm('ဤပစ္စည်းကို ဖျက်ရန် သေချာပါသလား?')) {
      await db.delete('products', id);
      this.render();
    }
  }
};
