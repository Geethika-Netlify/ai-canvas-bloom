import { GoogleGenAI } from "@google/genai";

// Audio configuration constants
const FORMAT = 'audio/pcm';
const CHANNELS = 1;
const SEND_SAMPLE_RATE = 16000;
const RECEIVE_SAMPLE_RATE = 24000;
const CHUNK_SIZE = 1024;

// Model configuration
const MODEL = "gemini-2.0-flash-live-001";

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
  private audioPlayer: HTMLAudioElement | null = null;

  constructor() {
    this.initializeAudioContext();
    console.log('GeminiLiveStream constructor initialized');
  }

  initializeAudioContext() {
    try {
      this.audioContext = new AudioContext({
        sampleRate: SEND_SAMPLE_RATE
      });
      console.log('AudioContext initialized with sample rate:', SEND_SAMPLE_RATE);
    } catch (error) {
      console.error("Failed to initialize AudioContext:", error);
    }
  }

  async initialize(apiKey: string): Promise<boolean> {
    try {
      console.log('Initializing Gemini API with api key length:', apiKey?.length || 0);
      // Using the correct API structure for @google/genai
      this.genAIClient = new GoogleGenAI({ apiKey });
      
      // Create an audio element for playback
      if (!this.audioPlayer) {
        this.audioPlayer = document.createElement('audio');
        this.audioPlayer.autoplay = true;
        document.body.appendChild(this.audioPlayer);
        console.log('Audio player element created');
      }
      
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
      console.log('Requesting microphone access...');
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
      console.log('Microphone access granted');

      const source = this.audioContext!.createMediaStreamSource(this.mediaStream);
      this.audioProcessor = this.audioContext!.createScriptProcessor(CHUNK_SIZE, 1, 1);
      
      this.audioProcessor.onaudioprocess = (e) => {
        const audioData = e.inputBuffer.getChannelData(0);
        this.processAudioChunk(audioData);
      };

      source.connect(this.audioProcessor);
      this.audioProcessor.connect(this.audioContext!.destination);
      console.log('Audio processing pipeline setup complete');
      
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
      console.log('Starting Gemini chat session with model:', MODEL);
      // Updated to use the new Google GenAI SDK structure
      this.session = await this.genAIClient.chats.create({
        model: MODEL,
        generationConfig: {
          maxOutputTokens: 8192,
        }
      });
      console.log('Gemini chat session created:', this.session ? 'success' : 'failed');

      // Set up event handlers for audio and text messages
      const originalSendMessage = this.session.sendMessage.bind(this.session);
      this.session.sendMessage = async (params: any) => {
        console.log('Sending message to Gemini:', params);
        try {
          const response = await originalSendMessage(params);
          
          console.log('Received response from Gemini:', response);
          
          if (response && response.text) {
            console.log('Response text:', response.text);
            if (options.onTextReceived) {
              options.onTextReceived(response.text);
            }
          }
          
          return response;
        } catch (error) {
          console.error('Error sending message:', error);
          if (options.onError) {
            options.onError(error as Error);
          }
          throw error;
        }
      };

      // Process any queued audio data
      if (this.audioQueue.length > 0) {
        console.log('Processing queued audio chunks:', this.audioQueue.length);
        while (this.audioQueue.length > 0) {
          const chunk = this.audioQueue.shift();
          if (chunk) {
            await this.sendAudioChunkToGemini(chunk);
          }
        }
      }

      // Set up event handlers for receiving audio and text
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
      await this.sendAudioChunkToGemini(buffer);
    } else {
      this.audioQueue.push(buffer);
    }
  }

  private async sendAudioChunkToGemini(audioData: Uint8Array) {
    if (!this.session || this.isProcessingAudio) return;

    this.isProcessingAudio = true;
    try {
      // Convert audio data to base64 for the API
      const base64Audio = btoa(String.fromCharCode.apply(null, Array.from(audioData)));
      
      console.log('Sending audio chunk to Gemini, size:', audioData.length);
      
      // Using the updated SDK structure for sending audio
      await this.session.sendMessage({
        // For audio content, we need to use a specific format
        message: {
          parts: [
            {
              audioData: {
                values: base64Audio,
                mimeType: FORMAT
              }
            }
          ]
        }
      });
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
      console.log('Sending text message to Gemini:', text);
      // Updated to match the new Google GenAI SDK structure
      const result = await this.session.sendMessage({
        message: text
      });
      console.log('Text message sent, response:', result);
      return true;
    } catch (error) {
      console.error("Failed to send text message:", error);
      return false;
    }
  }

  async stopStream(): Promise<void> {
    console.log('Stopping Gemini stream');
    this.isStreaming = false;

    if (this.session) {
      try {
        // If there's a specific method to close the session in the SDK
        if (typeof this.session.close === 'function') {
          await this.session.close();
          console.log('Gemini session closed');
        }
      } catch (error) {
        console.error("Error closing Gemini session:", error);
      }
      this.session = null;
    }

    if (this.mediaStream) {
      console.log('Stopping media tracks');
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioProcessor) {
      console.log('Disconnecting audio processor');
      this.audioProcessor.disconnect();
      this.audioProcessor = null;
    }
    
    console.log('Stream stopped successfully');
  }

  async playAudio(audioData: Uint8Array): Promise<void> {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }

    try {
      console.log('Playing audio, data size:', audioData.length);
      
      // Convert PCM data to WAV format for browser playback
      const wavData = this.pcmToWav(audioData);
      
      // Create a blob and URL for the audio
      const blob = new Blob([wavData], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      // Play the audio using the audio element
      if (this.audioPlayer) {
        this.audioPlayer.src = url;
        this.audioPlayer.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }
  
  // Helper function to convert PCM to WAV format
  private pcmToWav(pcmData: Uint8Array): ArrayBuffer {
    // Create WAV header
    const header = new ArrayBuffer(44);
    const view = new DataView(header);
    
    // "RIFF" identifier
    view.setUint8(0, 'R'.charCodeAt(0));
    view.setUint8(1, 'I'.charCodeAt(0));
    view.setUint8(2, 'F'.charCodeAt(0));
    view.setUint8(3, 'F'.charCodeAt(0));
    
    // File size
    view.setUint32(4, 32 + pcmData.length, true);
    
    // "WAVE" identifier
    view.setUint8(8, 'W'.charCodeAt(0));
    view.setUint8(9, 'A'.charCodeAt(0));
    view.setUint8(10, 'V'.charCodeAt(0));
    view.setUint8(11, 'E'.charCodeAt(0));
    
    // "fmt " chunk
    view.setUint8(12, 'f'.charCodeAt(0));
    view.setUint8(13, 'm'.charCodeAt(0));
    view.setUint8(14, 't'.charCodeAt(0));
    view.setUint8(15, ' '.charCodeAt(0));
    
    // Chunk length
    view.setUint32(16, 16, true);
    
    // PCM format
    view.setUint16(20, 1, true);
    
    // Mono channel
    view.setUint16(22, CHANNELS, true);
    
    // Sample rate
    view.setUint32(24, RECEIVE_SAMPLE_RATE, true);
    
    // Byte rate
    view.setUint32(28, RECEIVE_SAMPLE_RATE * CHANNELS * 2, true);
    
    // Block align
    view.setUint16(32, CHANNELS * 2, true);
    
    // Bits per sample
    view.setUint16(34, 16, true);
    
    // "data" chunk
    view.setUint8(36, 'd'.charCodeAt(0));
    view.setUint8(37, 'a'.charCodeAt(0));
    view.setUint8(38, 't'.charCodeAt(0));
    view.setUint8(39, 'a'.charCodeAt(0));
    
    // Data length
    view.setUint32(40, pcmData.length, true);
    
    // Combine header and data
    const buffer = new Uint8Array(header.byteLength + pcmData.length);
    buffer.set(new Uint8Array(header), 0);
    buffer.set(pcmData, header.byteLength);
    
    return buffer.buffer;
  }
}

// Keep the rest of the existing code unchanged
export const geminiLiveStream = new GeminiLiveStream();
