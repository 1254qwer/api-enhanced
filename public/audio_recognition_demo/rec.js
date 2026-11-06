class TimedRecorder extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.samples = new Float32Array(options.processorOptions.maxFrames);
    this.length = 0;
    this.recording = true;
    this.nextProgress = 0;
    this.port.onmessage = ({ data }) => {
      if (data.type === 'stop') this.finish();
    };
  }

  finish() {
    if (!this.recording) return;
    this.recording = false;
    const samples = this.samples.slice(0, this.length);
    this.port.postMessage({ type: 'finished', samples }, [samples.buffer]);
    this.samples = null;
  }

  process(inputs) {
    if (!this.recording) return false;
    const channels = inputs[0];
    if (!channels?.length || !channels[0]?.length) return true;
    const count = Math.min(channels[0].length, this.samples.length - this.length);
    for (let i = 0; i < count; i++) {
      let value = 0;
      for (const channel of channels) value += channel[i] / channels.length;
      this.samples[this.length + i] = value;
    }
    this.length += count;
    if (this.length >= this.nextProgress) {
      this.port.postMessage({ type: 'progress', seconds: this.length / sampleRate });
      this.nextProgress = this.length + sampleRate / 4;
    }
    if (this.length === this.samples.length) this.finish();
    return this.recording;
  }
}

registerProcessor('timed-recorder', TimedRecorder);
