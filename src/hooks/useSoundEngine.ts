import { useCallback, useRef } from 'react';
import * as Tone from 'tone';

export type SoundType = 'click' | 'correct' | 'incorrect' | 'purchase';

type SoundMap = Record<SoundType, Tone.Synth> | null;

export function useSoundEngine() {
  const sounds = useRef<SoundMap>(null);

  const init = useCallback(async () => {
    if (sounds.current) return;
    await Tone.start();

    sounds.current = {
      click: new Tone.Synth({ oscillator: { type: 'sine' } }).toDestination(),
      correct: new Tone.Synth({ oscillator: { type: 'triangle' } }).toDestination(),
      incorrect: new Tone.Synth({ oscillator: { type: 'square' } }).toDestination(),
      purchase: new Tone.Synth({ oscillator: { type: 'sine' } }).toDestination(),
    };
  }, []);

  const play = useCallback((sound: SoundType, note: string, enabled: boolean) => {
    if (!enabled || !sounds.current?.[sound]) return;
    sounds.current[sound].triggerAttackRelease(note, '8n');
  }, []);

  return { init, play };
}
