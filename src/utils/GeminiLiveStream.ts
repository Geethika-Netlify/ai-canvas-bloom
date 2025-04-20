
import { GoogleGenerativeAI } from "@google/genai";

// Audio configuration constants
const FORMAT = 'audio/pcm';
const CHANNELS = 1;
const SEND_SAMPLE_RATE = 16000;
const RECEIVE_SAMPLE_RATE = 24000;
const CHUNK_SIZE = 1024;

// Model configuration
const MODEL = "models/gemini-2.0-flash-live-001";

type AudioChunk = {
  data: Uint8Array;
  mimeType: string;
};

type ChatMessage = {
  role: 'user' | 'ai';
  content: string;
};

interface StreamOptions {
  onAudioReceived?: (audioData: Uint8Array) => void;
  onTextReceived?: (text: string) => void;
  onStartSpeaking?: () => void;
  onStopSpeaking?: () => void;
  onError?: (error: Error) => void;
}

export class GeminiLiveStream {
  private genAIClient: any = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private audioProcessor: ScriptProcessorNode | null = null;
  private audioQueue: Uint8Array[] = [];
  private isStreaming: boolean = false;
  private session: any = null; // Will be the Gemini session
  private isProcessingAudio: boolean = false;

  constructor() {
    this.initializeAudioContext();
  }

  initializeAudioContext() {
    try {
      this.audioContext = new AudioContext({
        sampleRate: SEND_SAMPLE_RATE
      });
    } catch (error) {
      console.error("Failed to initialize AudioContext:", error);
    }
  }

  async initialize(apiKey: string): Promise<boolean> {
    try {
      // Using the correct API structure for @google/genai
      this.genAIClient = new GoogleGenerativeAI(apiKey);
      return true;
    } catch (error) {
      console.error("Failed to initialize Gemini API:", error);
      return false;
    }
  }

  isInitialized(): boolean {
    return !!this.genAIClient;
  }

  async startMicrophone(): Promise<boolean> {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: SEND_SAMPLE_RATE,
          channelCount: CHANNELS,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });

      const source = this.audioContext!.createMediaStreamSource(this.mediaStream);
      this.audioProcessor = this.audioContext!.createScriptProcessor(CHUNK_SIZE, 1, 1);
      
      this.audioProcessor.onaudioprocess = (e) => {
        const audioData = e.inputBuffer.getChannelData(0);
        this.processAudioChunk(audioData);
      };

      source.connect(this.audioProcessor);
      this.audioProcessor.connect(this.audioContext!.destination);
      
      return true;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      return false;
    }
  }

  async startStream(options: StreamOptions = {}): Promise<boolean> {
    if (!this.genAIClient) {
      console.error("Gemini API not initialized");
      return false;
    }

    try {
      // This is a placeholder for the actual Gemini API call to start a live session
      // We'll use the correct API structure for the JS SDK
      const model = this.genAIClient.getGenerativeModel({ model: MODEL });
      this.session = await model.startChat({
        generationConfig: {
          maxOutputTokens: 8192,
        }
      });

      // Process any queued audio data
      while (this.audioQueue.length > 0) {
        const chunk = this.audioQueue.shift();
        if (chunk) {
          await this.sendAudioChunkToGemini(chunk);
        }
      }

      // Set up event listeners for receiving audio and text from Gemini
      if (this.session) {
        // These are placeholders since the actual API may differ
        // Will be updated once the Live API is fully documented
        this.session.onAudio = (audioData: Uint8Array) => {
          if (options.onAudioReceived) {
            options.onAudioReceived(audioData);
          }
        };

        this.session.onText = (text: string) => {
          if (options.onTextReceived) {
            options.onTextReceived(text);
          }
        };
      }

      this.isStreaming = true;
      return true;
    } catch (error) {
      console.error("Failed to start Gemini stream:", error);
      return false;
    }
  }

  private async processAudioChunk(audioData: Float32Array) {
    if (!this.isStreaming) return;

    // Convert Float32Array to Int16Array for PCM
    const int16Data = new Int16Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      // Convert to 16-bit PCM
      const s = Math.max(-1, Math.min(1, audioData[i]));
      int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    // Convert to Uint8Array for transmission
    const buffer = new Uint8Array(int16Data.buffer);
    
    // Add to queue for transmission
    if (this.session) {
      this.sendAudioChunkToGemini(buffer);
    } else {
      this.audioQueue.push(buffer);
    }
  }

  private async sendAudioChunkToGemini(audioData: Uint8Array) {
    if (!this.session || this.isProcessingAudio) return;

    this.isProcessingAudio = true;
    try {
      // This is a placeholder for the actual Gemini API call
      // We'll need to update this once we have more specific implementation details
      await this.session.sendAudio(audioData);
    } catch (error) {
      console.error("Error sending audio to Gemini:", error);
    } finally {
      this.isProcessingAudio = false;
    }
  }

  async sendTextMessage(text: string): Promise<boolean> {
    if (!this.session) {
      console.error("Session not initialized");
      return false;
    }

    try {
      // Placeholder for the actual Gemini API call to send text
      const result = await this.session.sendMessage(text);
      return true;
    } catch (error) {
      console.error("Failed to send text message:", error);
      return false;
    }
  }

  async stopStream(): Promise<void> {
    this.isStreaming = false;

    if (this.session) {
      try {
        await this.session.close();
      } catch (error) {
        console.error("Error closing Gemini session:", error);
      }
      this.session = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioProcessor) {
      this.audioProcessor.disconnect();
      this.audioProcessor = null;
    }
  }

  async playAudio(audioData: Uint8Array): Promise<void> {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }

    try {
      // Convert the PCM data to AudioBuffer for playback
      const audioBuffer = await this.audioContext!.decodeAudioData(audioData.buffer);
      
      const source = this.audioContext!.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext!.destination);
      source.start(0);
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }
}

// Create a singleton instance
export const geminiLiveStream = new GeminiLiveStream();
