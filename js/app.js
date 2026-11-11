document.addEventListener('DOMContentLoaded', async () => {
  try {
    await db.open();
    console.log('IndexedDB initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize IndexedDB:', err);
  }

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Service Worker registered.'))
      .catch((err) => console.log('Service Worker registration failed:', err));
  }

  setupNavigation();
  dashboard.render();
});

function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      const target = item.getAttribute('data-target');
      loadModule(target);
    });
  });
}

function loadModule(target) {
  const content = document.getElementById('mainContent');
  switch (target) {
    case 'dashboard':
      dashboard.render();
      break;
    case 'sales':
      salesModule.render();
      break;
    case 'products':
      products.render();
      break;
    case 'inventory':
      inventory.render();
      break;
    case 'cylinders':
      content.innerHTML = `<h2>၄၈ ကီလို မယ်အိုး (Mother Cylinder) ခြေရာခံစနစ်</h2><p class="card">အဆင့် ၃ တွင် ဆက်လက်ဖွံ့ဖြိုးပါမည်။</p>`;
      break;
    case 'oxygen':
      content.innerHTML = `<h2>အောက်ဆီဂျင် အိုးများ စီမံခန့်ခွဲမှု</h2><p class="card">အဆင့် ၃ တွင် ဆက်လက်ဖွံ့ဖြိုးပါမည်။</p>`;
      break;
    case 'customers':
      content.innerHTML = `<h2>ဖောက်သည်များနှင့် အကြွေးစာရင်း</h2><p class="card">အဆင့် ၃ တွင် ဆက်လက်ဖွံ့ဖြိုးပါမည်။</p>`;
      break;
    case 'expenses':
      content.innerHTML = `<h2>ဆိုင်စရိတ်နှင့် အသုံးစရိတ်များ</h2><p class="card">အဆင့် ၄ တွင် ဆက်လက်ဖွံ့ဖြိုးပါမည်။</p>`;
      break;
    case 'reports':
      content.innerHTML = `<h2>အရောင်းနှင့် အမြတ်အစွန်း အစီရင်ခံစာများ</h2><p class="card">အဆင့် ၄ တွင် ဆက်လက်ဖွံ့ဖြိုးပါမည်။</p>`;
      break;
    case 'backup':
      content.innerHTML = `<h2>ဒေတာ ဘက်ကပ်ယူရန်နှင့် ပြန်တင်ရန်</h2><p class="card">အဆင့် ၄ တွင် ဆက်လက်ဖွံ့ဖြိုးပါမည်။</p>`;
      break;
    default:
      dashboard.render();
  }
}
