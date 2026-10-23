const HorarioDefinitivo = {
  MAPA_DIAS: {
    'LUN': 'LUNES',
    'MAR': 'MARTES',
    'MIE': 'MIERCOLES',
    'JUE': 'JUEVES',
    'VIE': 'VIERNES',
    'SAB': 'SABADO'
  },

  cargar() {
    const tabResumen = document.getElementById('tab-resumen');
    if (tabResumen) tabResumen.disabled = false;

    const btnResumen = document.querySelector('[data-view="resumen"]');
    if (btnResumen) btnResumen.click();

    this.renderRejilla();
  },

  _normalizarDia(dia) {
    return (dia || '').trim().toUpperCase()
      .replace('Á', 'A').replace('É', 'E').replace('Í', 'I')
      .replace('Ó', 'O').replace('Ú', 'U');
  },

  _diaCompleto(diaCorto) {
    const d = this._normalizarDia(diaCorto);
    return this.MAPA_DIAS[d] || d;
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
                  dia: this._normalizarDia(h.dia),
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
    const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    const listaBloques = (typeof BLOQUES !== 'undefined' && Array.isArray(BLOQUES)) ? BLOQUES : [];

    listaBloques.forEach(b => {
      const celdaHora = document.createElement('div');
      celdaHora.className = 'horario-cell horario-header';
      celdaHora.textContent = `${b.inicio || ''} - ${b.fin || ''}`;
      grid.appendChild(celdaHora);

      const idFila = String(b.id || '').trim().toUpperCase();

      diasSemana.forEach(diaColumna => {
        const celda = document.createElement('div');
        celda.className = 'horario-cell';

        const encontradas = sesionesTodas.filter(s => {
          const diaCompleto = this._diaCompleto(s.dia);
          const coincideDia = diaCompleto === diaColumna;
          const coincideBloque = s.bloqueId === idFila;
          return coincideDia && coincideBloque;
        });

        if (encontradas.length > 0) {
          celda.style.backgroundColor = '#dbeafe';
          celda.innerHTML = encontradas
            .map(e => `<strong>${e.materia}</strong><br><small>Sec: ${e.seccion}</small>`)
            .join('<hr style="margin:2px 0">');
        }

        grid.appendChild(celda);
      });
    });
  }
};
