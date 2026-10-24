const Manual = {
  init() {
    const selectMat = document.getElementById('select-mat-manual');
    const selectSec = document.getElementById('select-sec-manual');
    const formManual = document.getElementById('form-manual');
    const mensajeManual = document.getElementById('mensaje-manual');

    if (!selectMat || !selectSec || !formManual) return;

    const normBloque = (b) => String(b).trim().toUpperCase();

    selectMat.innerHTML = '<option value="">Seleccione una materia...</option>';
    if (typeof MATERIAS !== 'undefined') {
      MATERIAS.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.codigo;
        opt.textContent = `${m.codigo} - ${m.nombre}`;
        selectMat.appendChild(opt);
      });
    }

    selectMat.addEventListener('change', (e) => {
      selectSec.innerHTML = '<option value="">Seleccione una sección...</option>';
      const codigoMat = e.target.value;
      if (!codigoMat) return;

      const materia = MATERIAS.find(m => m.codigo === codigoMat);
      if (materia && Array.isArray(materia.secciones)) {
        materia.secciones.forEach(s => {
          const optSec = document.createElement('option');
          optSec.value = String(s.id);
          optSec.textContent = `Sección ${s.id} (Prof. ${s.profesor || 'Por definir'})`;
          selectSec.appendChild(optSec);
        });
      }
    });

    formManual.addEventListener('submit', (e) => {
      e.preventDefault();
      const codigoMat = selectMat.value;
      const idSecStr = selectSec.value;

      if (!codigoMat || !idSecStr) {
        mensajeManual.innerHTML = `<p style="color:var(--danger)">Seleccione materia y sección.</p>`;
        return;
      }

      const materia = MATERIAS.find(m => m.codigo === codigoMat);
      if (!materia || !Array.isArray(materia.secciones)) {
        mensajeManual.innerHTML = `<p style="color:var(--danger)">Materia no encontrada o sin secciones.</p>`;
        return;
      }

      const seccion = materia.secciones.find(s => String(s.id) === idSecStr);

      if (!seccion) {
        mensajeManual.innerHTML = `<p style="color:var(--danger)">No se encontró la sección (id: ${idSecStr}).</p>`;
        return;
      }

      let hayChoqueManual = false;
      Seleccion.materiasSeleccionadas.forEach(m => {
        if (m.codigo === codigoMat) return; 
        if (!m.seccionSeleccionada || !m.seccionSeleccionada.horario) return;

        m.seccionSeleccionada.horario.forEach(hExistente => {
          (seccion.horario || []).forEach(hNuevo => {
            if (String(hExistente.dia).trim().toUpperCase() !== String(hNuevo.dia).trim().toUpperCase()) return;

            const bloquesViejos = (hExistente.bloques || []).map(normBloque);
            const bloquesNuevos = (hNuevo.bloques || []).map(normBloque);

            if (bloquesNuevos.some(b => bloquesViejos.includes(b))) {
              hayChoqueManual = true;
            }
          });
        });
      });

      if (hayChoqueManual) {
        mensajeManual.innerHTML = `<p style="color:var(--danger)">⚠️ No se puede crear el horario definitivo: esta sección choca en día y hora con otra materia ya seleccionada.</p>`;
        return;
      }

      if (!Seleccion.estaSeleccionada(materia.codigo)) {
        const totalUC = Seleccion.calcularTotalUC() + materia.uc;
        if (totalUC > Seleccion.topeUC) {
          mensajeManual.innerHTML = `<p style="color:var(--danger)">Excede el tope de ${Seleccion.topeUC} UC.</p>`;
          return;
        }
        Seleccion.materiasSeleccionadas.push({
          codigo: materia.codigo,
          nombre: materia.nombre,
          uc: materia.uc,
          seccionSeleccionada: null,
          estado: 'normal'
        });
      }

      const index = Seleccion.materiasSeleccionadas.findIndex(m => m.codigo === materia.codigo);
      if (index > -1) {
        Seleccion.materiasSeleccionadas[index].seccionSeleccionada = seccion;
        Seleccion.materiasSeleccionadas[index].estado = 'fijada';
      }

      Seleccion.actualizarUI();

      if (typeof HorarioDefinitivo !== 'undefined') {
        HorarioDefinitivo.cargar();
      }

      mensajeManual.innerHTML = `<p style="color:var(--success)">¡Sección agregada al horario definitivo con éxito!</p>`;

      selectSec.innerHTML = '<option value="">Seleccione una sección...</option>';
      selectMat.value = '';
    });
  }
};
