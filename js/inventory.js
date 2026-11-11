const inventory = {
  async render() {
    const container = document.getElementById('mainContent');
    container.innerHTML = `
      <h2>⚖️ ဓာတ်ငွေ့အလေးချိန် တွက်ချက်မှုနှင့် လက်ကျန် (Inventory & Weight Converter)</h2>
      <p style="color: var(--text-muted); margin-bottom: 20px;">AUNG Gas Solutions - ဇင်္ဂမလမ်း၊ သာကေတမြို့နယ်</p>

      <div class="card" style="max-width: 600px; margin-bottom: 20px;">
        <h3>ကီလို (kg) နှင့် ပိဿာ (viss) အပြန်အလှန် တွက်ချက်စက်</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">(၁ ပိဿာ = ၁.၆၃၂၉ ကီလိုဂရမ် / ၄၈ ကီလိုအိုး = ၂၈.၅ ပိဿာ)</p>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
          <div>
            <label style="display:block; margin-bottom:4px; font-weight:600;">ကီလိုဂရမ် (kg)</label>
            <input type="number" id="calcKg" placeholder="ဥပမာ - 48" style="width:100%; padding:8px; border:1px solid var(--border-color); border-radius:4px;" oninput="inventory.convert('kg')">
          </div>
          <div>
            <label style="display:block; margin-bottom:4px; font-weight:600;">ပိဿာ (Viss)</label>
            <input type="number" id="calcViss" placeholder="ဥပမာ - 28.5" style="width:100%; padding:8px; border:1px solid var(--border-color); border-radius:4px;" oninput="inventory.convert('viss')">
          </div>
        </div>
      </div>

      <div class="card">
        <h3>ဓာတ်ငွေ့နှင့် အောက်ဆီဂျင် လက်ကျန် အကျဉ်းချုပ်</h3>
        <p style="margin-top: 8px; color: var(--text-muted);">စစ်မှန်သော ၁၀၀% ထိုင်းဓာတ်ငွေ့ (100% Thai LPG) လက်ကျန်နှင့် အိုးအခြေအနေများကို စစ်ဆေးရန် ပစ္စည်းစာရင်း မော်ဂျူးသို့ သွားပါ။</p>
      </div>
    `;
  },

  convert(type) {
    const kgInput = document.getElementById('calcKg');
    const vissInput = document.getElementById('calcViss');
    
    // Conversion factor: 1 Viss approx 1.6329 kg (or based on shop average 48kg = 28.5 viss => 1kg = 0.59375 viss)
    const ratio = 28.5 / 48.0; // viss per kg

    if (type === 'kg') {
      const kg = parseFloat(kgInput.value);
      if (!isNaN(kg)) {
        vissInput.value = (kg * ratio).toFixed(2);
      } else {
        vissInput.value = '';
      }
    } else {
      const viss = parseFloat(vissInput.value);
      if (!isNaN(viss)) {
        kgInput.value = (viss / ratio).toFixed(2);
      } else {
        kgInput.value = '';
      }
    }
  }
};
