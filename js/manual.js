const Manual = {
  init() {
    const selectMat = document.getElementById('select-mat-manual');
    const selectSec = document.getElementById('select-sec-manual');
    const formManual = document.getElementById('form-manual');
    const mensajeManual = document.getElementById('mensaje-manual');

    if (!selectMat || !selectSec || !formManual) return;
    if (typeof MATERIAS === 'undefined') {
      console.warn('MATERIAS no está definido; el formulario manual no funcionará.');
      return;
    }

    selectMat.innerHTML = '<option value="">Seleccione una materia...</option>';
    MATERIAS.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.codigo;
      opt.textContent = `${m.codigo} - ${m.nombre}`;
      selectMat.appendChild(opt);
    });

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
      if (!materia) {
        mensajeManual.innerHTML = `<p style="color:var(--danger)">Materia no encontrada.</p>`;
        return;
      }
      const seccion = (materia.secciones || []).find(s => s.id === idSec);
      if (!seccion) {
        mensajeManual.innerHTML = `<p style="color:var(--danger)">Sección no encontrada.</p>`;
        return;
      }

      if (!Seleccion.estaSeleccionada(materia.codigo)) {
        if (!Seleccion.puedeAgregarUC(materia.uc)) {
          mensajeManual.innerHTML = `<p style="color:var(--danger)">Excede el tope de ${Seleccion.topeUC} UC.</p>`;
          return;
        }
        Seleccion.materiasSeleccionadas.push({
          codigo: materia.codigo,
          nombre: materia.nombre,
          uc: materia.uc,
          seccionSeleccionada: seccion,
          estado: 'fijada'
        });
      } else {

        const index = Seleccion.materiasSeleccionadas.findIndex(m => m.codigo === materia.codigo);
        Seleccion.materiasSeleccionadas[index].seccionSeleccionada = seccion;
        Seleccion.materiasSeleccionadas[index].estado = 'fijada';
      }

      Seleccion.actualizarUI();
      if (typeof HorarioDefinitivo !== 'undefined') HorarioDefinitivo.cargar();

      mensajeManual.innerHTML = `<p style="color:var(--success)">¡Sección agregada al horario definitivo con éxito!</p>`;
    });
  }
};
