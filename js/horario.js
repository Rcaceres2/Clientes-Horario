const HorarioDefinitivo = {
  cargar() {
    const tabResumen = document.getElementById('tab-resumen');
    if (tabResumen) tabResumen.disabled = false;
    
    const btnResumen = document.querySelector('[data-view="resumen"]');
    if (btnResumen) btnResumen.click();
    
    this.renderRejilla();
  },

  renderRejilla() {
    const contenedor = document.getElementById('tabla-horario-container');
    if (!contenedor) return;

    let sesionesTodas = [];
    if (typeof Seleccion !== 'undefined' && Seleccion.materiasSeleccionadas) {
      Seleccion.materiasSeleccionadas.forEach(m => {
        if (m.seccionSeleccionada && m.seccionSeleccionada.horario) {
          m.seccionSeleccionada.horario.forEach(h => {
            if (h.bloques && Array.isArray(h.bloques)) {
              h.bloques.forEach(bId => {
                sesionesTodas.push({
                  dia: h.dia ? h.dia.trim().toUpperCase() : '',
                  bloqueId: String(bId).trim().toUpperCase(),
                  materia: m.nombre,
                  seccion: m.seccionSeleccionada.id || m.seccionSeleccionada.numero || 'Única'
                });
              });
            }
          });
        }
      });
    }

    contenedor.innerHTML = `
      <div class="horario-grid">
        <div class="horario-cell horario-header">Hora</div>
        <div class="horario-cell horario-header">Lunes</div>
        <div class="horario-cell horario-header">Martes</div>
        <div class="horario-cell horario-header">Miércoles</div>
        <div class="horario-cell horario-header">Jueves</div>
        <div class="horario-cell horario-header">Viernes</div>
        <div class="horario-cell horario-header">Sábado</div>
      </div>
    `;

    const grid = contenedor.querySelector('.horario-grid');
    const diasSemana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    const diasCortos = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];

    const listaBloques = (typeof BLOQUES !== 'undefined' && Array.isArray(BLOQUES)) ? BLOQUES : [];

    listaBloques.forEach(b => {
      const celdaHora = document.createElement('div');
      celdaHora.className = 'horario-cell horario-header';
      celdaHora.textContent = `${b.inicio || ''} - ${b.fin || ''}`;
      grid.appendChild(celdaHora);

      diasSemana.forEach((diaColumna, indexDia) => {
        const celda = document.createElement('div');
        celda.className = 'horario-cell';
        
        const diaCorto = diasCortos[indexDia];

        const encontradas = sesionesTodas.filter(s => {
          const coincideDia = s.dia.includes(diaColumna) || s.dia.includes(diaCorto) || diaColumna.includes(s.dia);
          
          const idBloqueFila = String(b.id || '').trim().toUpperCase();
          const coincideBloque = s.bloqueId === idBloqueFila || 
                                 s.bloqueId.includes(idBloqueFila) || 
                                 idBloqueFila.includes(s.bloqueId);

          return coincideDia && coincideBloque;
        });

        if (encontradas.length > 0) {
          celda.style.backgroundColor = '#dbeafe';
          celda.innerHTML = encontradas.map(e => `<strong>${e.materia}</strong><br><small>Sec: ${e.seccion}</small>`).join('<hr style="margin:2px 0">');
        }

        grid.appendChild(celda);
      });
    });
  }
};
