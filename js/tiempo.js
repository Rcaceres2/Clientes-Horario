const Tiempo = {
  horaAMinutos(horaStr) {
    const [h, m] = horaStr.split(':').map(Number);
    return h * 60 + m;
  },

  minutosAHora(minutos) {
    const h = Math.floor(minutos / 60).toString().padStart(2, '0');
    const m = (minutos % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  },

  _normalizarDia(dia) {
    return (dia || '').trim().toUpperCase()
      .replace('Á', 'A').replace('É', 'E').replace('Í', 'I')
      .replace('Ó', 'O').replace('Ú', 'U');
  },

  seSesionesChocan(sesionA, sesionB) {
    if (this._normalizarDia(sesionA.dia) !== this._normalizarDia(sesionB.dia)) return false;

    const rangosA = (sesionA.bloques || []).map(idB => {
      const b = BLOQUES.find(x => String(x.id) === String(idB));
      if (!b) return null;
      return { inicio: this.horaAMinutos(b.inicio), fin: this.horaAMinutos(b.fin) };
    }).filter(Boolean);

    const rangosB = (sesionB.bloques || []).map(idB => {
      const b = BLOQUES.find(x => String(x.id) === String(idB));
      if (!b) return null;
      return { inicio: this.horaAMinutos(b.inicio), fin: this.horaAMinutos(b.fin) };
    }).filter(Boolean);

    for (let rA of rangosA) {
      for (let rB of rangosB) {
        if (Math.max(rA.inicio, rB.inicio) < Math.min(rA.fin, rB.fin)) {
          return true;
        }
      }
    }
    return false;
  }
};
