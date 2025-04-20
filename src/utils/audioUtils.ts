
export class AudioManager {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: AudioWorkletNode | null = null;
  private audioQueue: AudioData[] = [];

  async initialize() {
    try {
      this.audioContext = new AudioContext({
        sampleRate: 16000,
        latencyHint: 'interactive'
      });
      
      await this.audioContext.audioWorklet.addModule('/audioProcessor.js');
      
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.processorNode = new AudioWorkletNode(this.audioContext, 'audio-processor');
      
      this.sourceNode.connect(this.processorNode);
      this.processorNode.connect(this.audioContext.destination);

      this.setupMessageHandling();
    } catch (error) {
      console.error('Error initializing audio:', error);
      throw error;
    }
  }

  private setupMessageHandling() {
    if (!this.processorNode) return;
    
    this.processorNode.port.onmessage = (event) => {
      const audioChunk = event.data;
      this.audioQueue.push(audioChunk);
    };
  }

  async stop() {
    this.mediaStream?.getTracks().forEach(track => track.stop());
    await this.audioContext?.close();
    this.sourceNode?.disconnect();
    this.processorNode?.disconnect();
    
    this.audioContext = null;
    this.mediaStream = null;
    this.sourceNode = null;
    this.processorNode = null;
  }

  getAudioChunk(): AudioData | undefined {
    return this.audioQueue.shift();
  }

  async playAudio(audioData: ArrayBuffer) {
    if (!this.audioContext) return;
    
    try {
      const audioBuffer = await this.audioContext.decodeAudioData(audioData);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }
}

export interface AudioData {
  data: ArrayBuffer;
  sampleRate: number;
  channelCount: number;
}
