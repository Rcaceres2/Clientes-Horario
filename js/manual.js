const Manual = {
  init() {
    const selectMat = document.getElementById('select-mat-manual');
    const selectSec = document.getElementById('select-sec-manual');
    const formManual = document.getElementById('form-manual');
    const mensajeManual = document.getElementById('mensaje-manual');

    if (!selectMat || !selectSec || !formManual) return;

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
      if (materia && materia.secciones) {
        materia.secciones.forEach(s => {
          const optSec = document.createElement('option');
          optSec.value = s.id;
          optSec.textContent = `Sección ${s.id} (Prof. ${s.profesor || 'Por definir'})`;
          selectSec.appendChild(optSec);
        });
      }
    });

    formManual.addEventListener('submit', (e) => {
      e.preventDefault();
      const codigoMat = selectMat.value;
      const idSec = selectSec.value;

      if (!codigoMat || !idSec) {
        mensajeManual.innerHTML = `<p style="color:var(--danger)">Seleccione materia y sección.</p>`;
        return;
      }

      const materia = MATERIAS.find(m => m.codigo === codigoMat);
      const seccion = materia.secciones.find(s => s.id === idSec);

      if (!materia || !seccion) {
        mensajeManual.innerHTML = `<p style="color:var(--danger)">No se encontró la sección.</p>`;
        return;
      }

      if (!Seleccion.estaSeleccionada(materia.codigo)) {
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
    });
  }
};
