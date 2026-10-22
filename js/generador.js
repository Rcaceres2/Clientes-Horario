const Generador = {
  init() {
    const btnGenerar = document.getElementById('btn-generar');
    if (btnGenerar) {
      btnGenerar.addEventListener('click', () => this.generarCombinaciones());
    }
  },

  generarCombinaciones() {
    const contenedor = document.getElementById('resultados-generador');
    if (!contenedor) return;

    const materiasSel = Seleccion.materiasSeleccionadas;
    if (materiasSel.length === 0) {
      contenedor.innerHTML = `<p style="color:var(--danger)">Selecciona al menos una materia en el catálogo primero.</p>`;
      return;
    }

    let opcionesPorMateria = [];
    for (let mSel of materiasSel) {
      const materiaOriginal = MATERIAS.find(m => m.codigo === mSel.codigo);
      if (!materiaOriginal || !materiaOriginal.secciones || materiaOriginal.secciones.length === 0) {
        contenedor.innerHTML = `<p style="color:var(--danger)">La materia ${mSel.nombre} no tiene secciones registradas.</p>`;
        return;
      }

      if (mSel.estado === 'fijada' && mSel.seccionSeleccionada) {
        opcionesPorMateria.push([{ ...mSel.seccionSeleccionada, materiaNombre: mSel.nombre }]);
      } else {
        opcionesPorMateria.push(materiaOriginal.secciones.map(s => ({ ...s, materiaNombre: mSel.nombre })));
      }
    }

    let combinacionesValidas = [];

    function buscar(index, horarioActual) {
      if (index === opcionesPorMateria.length) {
        combinacionesValidas.push([...horarioActual]);
        return;
      }

      for (let seccion of opcionesPorMateria[index]) {
        let hayCruce = false;

        for (let sesionExistente of horarioActual) {
          for (let hNuevo of (seccion.horario || [])) {
            for (let hExistente of (sesionExistente.horario || [])) {
              if (hNuevo.dia.trim().toUpperCase() === hExistente.dia.trim().toUpperCase()) {
                const bloquesNuevos = hNuevo.bloques || [];
                const bloquesViejos = hExistente.bloques || [];
                if (bloquesNuevos.some(b => bloquesViejos.includes(b))) {
                  hayCruce = true;
                  break;
                }
              }
            }
            if (hayCruce) break;
          }
          if (hayCruce) break;
        }

        if (!hayCruce) {
          horarioActual.push(seccion);
          buscar(index + 1, horarioActual);
          horarioActual.pop();
        }
      }
    }

    buscar(0, []);

    contenedor.innerHTML = `<h3>Se encontraron ${combinacionesValidas.length} combinaciones posibles sin cruces.</h3>`;

    if (combinacionesValidas.length === 0) {
      contenedor.innerHTML += `<p style="color:var(--danger)">No hay combinaciones posibles con las materias seleccionadas debido a cruces de horario entre sus secciones.</p>`;
      return;
    }

    const btnCargar = document.createElement('button');
    btnCargar.className = 'primary-btn';
    btnCargar.textContent = 'Cargar Primera Combinación en Horario Definitivo';
    btnCargar.style.marginTop = '1rem';
    btnCargar.onclick = () => {
      combinacionesValidas[0].forEach(secElegida => {
        const mat = Seleccion.materiasSeleccionadas.find(m => m.nombre === secElegida.materiaNombre);
        if (mat) {
          mat.seccionSeleccionada = secElegida;
          mat.estado = 'fijada';
        }
      });
      Seleccion.actualizarUI();
      if (typeof HorarioDefinitivo !== 'undefined') {
        HorarioDefinitivo.cargar();
      }
    };

    contenedor.appendChild(btnCargar);
  }
};
