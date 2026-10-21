const Tiempo = {
  horaAMinutos(horaStr) {
    const [h, m] = horaStr.split(":").map(Number);
    return h * 60 + m;
  },

  minutosAHora(minutos) {
    const h = Math.floor(minutos / 60).toString().padStart(2, '0');
    const m = (minutos % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  },

  seSesionesChocan(sesionA, sesionB) {
    if (sesionA.dia !== sesionB.dia) return false;
    
    const rangosA = sesionA.bloques.map(idB => {
      const b = BLOQUES.find(x => x.id === idB);
      return { inicio: this.horaAMinutos(b.inicio), fin: this.horaAMinutos(b.fin) };
    });
    const rangosB = sesionB.bloques.map(idB => {
      const b = BLOQUES.find(x => x.id === idB);
      return { inicio: this.horaAMinutos(b.inicio), fin: this.horaAMinutos(b.fin) };
    });

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