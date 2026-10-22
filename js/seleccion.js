const Seleccion = {
  materiasSeleccionadas: [],
  topeUC: 28,

  estaSeleccionada(codigo) {
    return this.materiasSeleccionadas.some(m => m.codigo === codigo);
  },

  toggleMateria(codigo) {
    const materia = MATERIAS.find(m => m.codigo === codigo);
    const index = this.materiasSeleccionadas.findIndex(m => m.codigo === codigo);

    if (index > -1) {
      this.materiasSeleccionadas.splice(index, 1);
    } else {
      const totalUC = this.calcularTotalUC() + materia.uc;
      if (totalUC > this.topeUC) {
        alert(`No puedes exceder el tope máximo de ${this.topeUC} Unidades de Crédito.`);
        return;
      }
      this.materiasSeleccionadas.push({
        codigo: materia.codigo,
        nombre: materia.nombre,
        uc: materia.uc,
        seccionSeleccionada: null,
        estado: 'normal'
      });
    }

    this.actualizarUI();
  },

  calcularTotalUC() {
    return this.materiasSeleccionadas.reduce((acc, m) => acc + m.uc, 0);
  },

  actualizarUI() {
    const infoUC = document.getElementById('info-uc');
    if (infoUC) {
      infoUC.innerText = `UC Seleccionadas: ${this.calcularTotalUC()} / ${this.topeUC}`;
    }
    if (typeof Catalogo !== 'undefined') Catalogo.render();
    this.renderSeleccionadas();
  },

  renderSeleccionadas() {
    const contenedor = document.getElementById('lista-seleccionadas');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';

    if (this.materiasSeleccionadas.length === 0) {
      contenedor.innerHTML = '<p>No hay materias seleccionadas aún.</p>';
      const tabResumen = document.getElementById('tab-resumen');
      if (tabResumen) tabResumen.disabled = true;
      return;
    }

    this.materiasSeleccionadas.forEach(m => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <h3>${m.nombre} (${m.uc} UC)</h3>
        <p>Estado: ${m.estado}</p>
        <button class="secondary-btn" onclick="Seleccion.toggleMateria('${m.codigo}')">Quitar Materia</button>
      `;
      contenedor.appendChild(div);
    });

    const btnIrGen = document.getElementById('btn-ir-generador');
    if (btnIrGen) {
      btnIrGen.onclick = () => {
        const tabGenerador = document.querySelector('[data-view="generador"]');
        if (tabGenerador) tabGenerador.click();
      };
    }
  }
};
