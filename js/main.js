document.addEventListener('DOMContentLoaded', () => {
  // Pestañas de navegación
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.disabled) return;
      buttons.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      
      btn.classList.add('active');
      const viewId = `vista-${btn.getAttribute('data-view')}`;
      document.getElementById(viewId).classList.add('active');
    });
  });
