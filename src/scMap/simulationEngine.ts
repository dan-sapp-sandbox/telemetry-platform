class SimulationClock {
  private t: number = 0; // UNIX seconds
  private last = performance.now();

  private speed = 1;
  private playing = true;

  setTime = (unixSeconds: number) => {
    this.t = unixSeconds;
  };

  start = () => {
    const tick = (now: number) => {
      const dtMs = now - this.last;
      this.last = now;

      if (this.playing) {
        // convert ms → seconds
        this.t += (dtMs / 1000) * this.speed;
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
