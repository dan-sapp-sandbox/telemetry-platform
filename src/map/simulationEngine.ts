class SimulationClock {
  private t = 0;
  private last = performance.now();
  private speed = 1;
  private playing = true;

  start = () => {
    const tick = (now: number) => {
      const dt = now - this.last;
      this.last = now;

      if (this.playing) {
        this.t += dt * this.speed;
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  getTime = () => this.t;
  setSpeed = (s: number) => (this.speed = s);
  play = () => (this.playing = true);
  pause = () => (this.playing = false);
}

export const clock = new SimulationClock();
