#!/usr/bin/env python3
"""
Bark TTS Processor
Generates expressive, synthetic AI voices using Suno AI's Bark
"""

import argparse
import json
import sys
import os
from pathlib import Path

try:
    from bark import SAMPLE_RATE, generate_audio, preload_models
    from scipy.io.wavfile import write as write_wav
    import numpy as np
    BARK_AVAILABLE = True
except ImportError:
    BARK_AVAILABLE = False

def generate_voice(text, voice_preset, output_path):
    """Generate voice using Bark"""
    if not BARK_AVAILABLE:
        return {
            'success': False,
            'error': 'Bark not installed',
            'note': 'Install with: pip install git+https://github.com/suno-ai/bark.git scipy'
        }

    try:
        # Download and load models (first time only)
        print("Loading Bark models...", file=sys.stderr)
        preload_models()

        # Generate audio
        print(f"Generating audio with voice preset: {voice_preset}", file=sys.stderr)
        audio_array = generate_audio(text, history_prompt=voice_preset)

        # Ensure output directory exists
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)

        # Save audio file
        write_wav(output_path, SAMPLE_RATE, audio_array)

        # Calculate duration
        duration = len(audio_array) / SAMPLE_RATE

        return {
            'success': True,
            'output_path': output_path,
            'duration': duration,
            'sample_rate': SAMPLE_RATE,
            'voice_preset': voice_preset
        }

    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def main():
    parser = argparse.ArgumentParser(description='Bark TTS Voice Generator')
    parser.add_argument('--text', required=True, help='Text to synthesize')
    parser.add_argument('--voice', required=True, help='Bark voice preset')
    parser.add_argument('--output', required=True, help='Output audio file path')

    args = parser.parse_args()

    result = generate_voice(args.text, args.voice, args.output)

    # Output JSON result
    print(json.dumps(result))

if __name__ == '__main__':
    main()
