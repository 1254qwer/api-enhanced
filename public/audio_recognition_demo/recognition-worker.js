importScripts('./ncm_recognition.js');

const methods = {
  afp: NcmRecognition.fingerprint_afp,
  hfp: NcmRecognition.fingerprint_hfp,
  asr: NcmRecognition.audio_asr,
};

self.onmessage = async ({ data }) => {
  try {
    const sampleRate = data.algorithm === 'afp' ? 8000 : 16000;
    if (!Object.hasOwn(methods, data.algorithm) || !(data.samples instanceof Float32Array) || data.sampleRate !== sampleRate) {
      throw new Error('Worker 收到无效算法或 PCM 输入。');
    }
    await NcmRecognition({ module_or_path: './ncm_recognition_bg.wasm' });
    const payload = methods[data.algorithm](data.samples, sampleRate);
    if (!payload) {
      throw new Error('Rust WASM 返回空数据；请尝试其他片段。');
    }
    // Display the original byte count without decoding the Base64 string.
    const padding = payload.endsWith('==') ? 2 : payload.endsWith('=') ? 1 : 0;
    const byteLength = payload.length / 4 * 3 - padding;
    self.postMessage({ payload, byteLength });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : String(error) });
  }
};
