const Generador = {
  MAX_COMBINACIONES: 5000, 

  init() {
    const btnGenerar = document.getElementById('btn-generar');
    if (btnGenerar) {
      btnGenerar.addEventListener('click', () => this.generarCombinaciones());
    }
  },

  cumplePreferencias(seccion, prefs) {
    const bloques = (seccion.horario || []).flatMap(h => h.bloques || []);
    if (bloques.length === 0) return true;

    const bloquesDef = bloques
      .map(id => BLOQUES.find(b => String(b.id) === String(id)))
      .filter(Boolean);

    if (bloquesDef.length === 0) return true;

    const promedio = bloquesDef.reduce((acc, b) => {
      const [h, m] = b.inicio.split(':').map(Number);
      return acc + (h * 60 + m);
    }, 0) / bloquesDef.length;

    if (prefs.mananas && !prefs.tardes) return promedio < 720;
    if (prefs.tardes && !prefs.mananas) return promedio >= 720;
    return true;
  },

  contarVentanas(secciones) {
    const porDia = {};
    secciones.forEach(sec => {
      (sec.horario || []).forEach(h => {
        const dia = (h.dia || '').trim().toUpperCase();
        (h.bloques || []).forEach(bId => {
          const b = BLOQUES.find(x => String(x.id) === String(bId));
          if (!b) return;
          if (!porDia[dia]) porDia[dia] = [];
          porDia[dia].push(b);
        });
      });
    });

    let ventanas = 0;
    Object.values(porDia).forEach(bloquesDia => {
      const rangos = bloquesDia
        .map(b => {
          const [hi, mi] = b.inicio.split(':').map(Number);
          const [hf, mf] = b.fin.split(':').map(Number);
          return { ini: hi * 60 + mi, fin: hf * 60 + mf };
        })
        .sort((a, b) => a.ini - b.ini);

      const unidos = [];
      rangos.forEach(r => {
        if (unidos.length === 0) { unidos.push({ ...r }); return; }
        const ult = unidos[unidos.length - 1];
        if (r.ini <= ult.fin) {
          ult.fin = Math.max(ult.fin, r.fin);
        } else {
          unidos.push({ ...r });
        }
      });

      for (let i = 1; i < unidos.length; i++) {
        if (unidos[i].ini > unidos[i - 1].fin) ventanas++;
      }
    });
    return ventanas;
  },

  generarCombinaciones() {
    const contenedor = document.getElementById('resultados-generador');
    if (!contenedor) return;

    const materiasSel = Seleccion.materiasSeleccionadas;
    if (materiasSel.length === 0) {
      contenedor.innerHTML = `<p style="color:var(--danger)">Selecciona al menos una materia en el catálogo primero.</p>`;
      return;
    }

    const prefs = {
      mananas: document.getElementById('pref-mananas')?.checked || false,
      tardes: document.getElementById('pref-tardes')?.checked || false,
      ventanas: Number(document.getElementById('pref-ventanas')?.value || 1)
    };

    let opcionesPorMateria = [];
    for (let mSel of materiasSel) {
      const materiaOriginal = MATERIAS.find(m => m.codigo === mSel.codigo);
      if (!materiaOriginal || !materiaOriginal.secciones || materiaOriginal.secciones.length === 0) {
        contenedor.innerHTML = `<p style="color:var(--danger)">La materia ${mSel.nombre} no tiene secciones registradas.</p>`;
        return;
      }

      if (mSel.estado === 'fijada' && mSel.seccionSeleccionada) {
        opcionesPorMateria.push([{
          ...mSel.seccionSeleccionada,
          materiaCodigo: mSel.codigo,
          materiaNombre: mSel.nombre
        }]);
      } else {
        const seccionesValidas = materiaOriginal.secciones
          .filter(s => this.cumplePreferencias(s, prefs))
          .map(s => ({ ...s, materiaCodigo: mSel.codigo, materiaNombre: mSel.nombre }));

        const opciones = seccionesValidas.length > 0
          ? seccionesValidas
          : materiaOriginal.secciones.map(s => ({ ...s, materiaCodigo: mSel.codigo, materiaNombre: mSel.nombre }));

        opcionesPorMateria.push(opciones);
      }
    }

    opcionesPorMateria.sort((a, b) => a.length - b.length);

    let combinacionesValidas = [];

    const buscar = (index, horarioActual) => {
      if (combinacionesValidas.length >= this.MAX_COMBINACIONES) return;

      if (index === opcionesPorMateria.length) {
        combinacionesValidas.push([...horarioActual]);
        return;
      }

      for (let seccion of opcionesPorMateria[index]) {
        let hayCruce = false;

        for (let sesionExistente of horarioActual) {
          if (this._seCruzan(seccion, sesionExistente)) {
            hayCruce = true;
            break;
          }
        }

        if (!hayCruce) {
          horarioActual.push(seccion);
          buscar(index + 1, horarioActual);
          horarioActual.pop();
        }
      }
    };

    buscar(0, []);

    contenedor.innerHTML = '';

    if (combinacionesValidas.length === 0) {
      contenedor.innerHTML = `<p style="color:var(--danger)">No hay combinaciones posibles con las materias seleccionadas debido a cruces de horario entre sus secciones.</p>`;
      return;
    }

    combinacionesValidas.sort((a, b) => this.contarVentanas(a) - this.contarVentanas(b));

    const top = combinacionesValidas.slice(0, 5);
    top.forEach((comb, idx) => {
      const ventanas = this.contarVentanas(comb);
      const btn = document.createElement('button');
      btn.className = 'primary-btn';
      btn.textContent = `Cargar combinación #${idx + 1} (${ventanas} ventana(s))`;
      btn.style.marginTop = '0.5rem';
      btn.style.display = 'block';
      btn.onclick = () => {
        this.aplicarCombinacion(comb);
      };
      contenedor.appendChild(btn);
    });
  },

  _seCruzan(secA, secB) {
    if (typeof Tiempo !== 'undefined') {
      const sesionesA = (secA.horario || []).map(h => ({ dia: h.dia, bloques: h.bloques || [] }));
      const sesionesB = (secB.horario || []).map(h => ({ dia: h.dia, bloques: h.bloques || [] }));
      for (const a of sesionesA) {
        for (const b of sesionesB) {
          if (Tiempo.seSesionesChocan(a, b)) return true;
        }
      }
      return false;
    }

    for (const hA of (secA.horario || [])) {
      for (const hB of (secB.horario || [])) {
        if ((hA.dia || '').trim().toUpperCase() !== (hB.dia || '').trim().toUpperCase()) continue;
        const bA = new Set((hA.bloques || []).map(String));
        const bB = (hB.bloques || []).map(String);
        if (bB.some(x => bA.has(x))) return true;
      }
    }
    return false;
  },

  aplicarCombinacion(comb) {
    comb.forEach(secElegida => {
      const mat = Seleccion.materiasSeleccionadas.find(m => m.codigo === secElegida.materiaCodigo);
      if (mat) {
        mat.seccionSeleccionada = secElegida;
        mat.estado = 'fijada';
      }
    });
    Seleccion.actualizarUI();
    if (typeof HorarioDefinitivo !== 'undefined') HorarioDefinitivo.cargar();
  }
};
