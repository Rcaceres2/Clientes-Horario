const Catalogo = {
  init() {
    this.render();
    document.getElementById('buscar-mat').addEventListener('input', () => this.render());
    document.getElementById('filtro-trim').addEventListener('change', () => this.render());
  },

  render() {
    const contenedor = document.getElementById('lista-catalogo');
    const filtroTexto = document.getElementById('buscar-mat').value.toLowerCase();
    const filtroTrim = document.getElementById('filtro-trim').value;

    contenedor.innerHTML = '';

    const materiasFiltradas = MATERIAS.filter(m => {
      const matchTexto = m.nombre.toLowerCase().includes(filtroTexto) || m.codigo.toLowerCase().includes(filtroTexto);
      const matchTrim = filtroTrim === '' || m.trimestre.toString() === filtroTrim;
      return matchTexto && matchTrim;
    });

    materiasFiltradas.forEach(m => {
      const card = document.createElement('div');
      card.className = 'card';
      const seleccionada = Seleccion.estaSeleccionada(m.codigo); 
    card.innerHTML = `
      <div>
        <h3>${m.codigo} - ${m.nombre}</h3>
        <p>Trimestre: ${m.trimestre} | UC: ${m.uc}</p>
        <p>Secciones disponibles: ${m.secciones.length}</p>
      </div>
      <button class="${seleccionada ? 'btn-seleccionada' : 'primary-btn'}" 
              onclick="Seleccion.toggleMateria('${m.codigo}')">
        ${seleccionada ? 'Ver / Modificar Secciones' : 'Seleccionar Materia'}
      </button>
    `;
  contenedor.appendChild(card);
});
  }
};
