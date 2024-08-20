from django.conf import settings
import os
import numpy as np
import pandas as pd
import subprocess
from openai import OpenAI

from detect.utils import generate_random_filename, make_dir, remove_file

# Initialize OpenAI Client
client = OpenAI(api_key=settings.OPENAI_API_KEY)

def convert_video_to_audio(video_file_path, audio_file_name):
    detects_dir = os.path.join(settings.MEDIA_ROOT, 'detects')
    make_dir(detects_dir)
    audio_file_path = os.path.join(detects_dir, audio_file_name)
    
    command = "ffmpeg -i {} -vn -ar 44100 -ac 2 -b:a 192k {}".format(video_file_path, audio_file_path)
    subprocess.run(command, check=True)
    return audio_file_path

def transcribe_audio(audio_file_path):
    with open(audio_file_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-1",
            response_format="verbose_json",
            timestamp_granularities=["segment"]
        )
    return transcription.segments

def get_embedding(text, model="text-embedding-3-small"):
    text = text.replace("\n", " ")
    embedding = client.embeddings.create(input=[text], model=model).data[0].embedding
    return embedding

def cut_video(input_path, output_path, start, end):
    try:
        command = [
            'ffmpeg',
            '-i', input_path,
            '-ss', str(start),
            '-to', str(end),
            '-c', 'copy',
            output_path
        ]
        subprocess.run(command, check=True)
    except Exception as e:
        print(f"Error: {e}")

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def search_similar_segments(df, target_description, top_n=3):
    target_embedding = get_embedding(target_description)
    df['similarity'] = df['embeddings'].apply(lambda emb: cosine_similarity(emb, target_embedding))
    return df.sort_values('similarity', ascending=False).head(top_n)

def detect(filepath, search_string):
    abs_file_path = f"{settings.BASE_DIR}/{filepath}"
    audio_file_name = generate_random_filename("mp3")
    audio_file_path = convert_video_to_audio(abs_file_path, audio_file_name)
    segments = transcribe_audio(audio_file_path)

    # Data preparation
    segment_data = [{'id': seg['id'], 'text': seg['text']} for seg in segments]
    df = pd.DataFrame(segment_data)
    df['embeddings'] = df['text'].apply(get_embedding)

    # Find relevant segments
    relevant_segments = search_similar_segments(df, search_string)
    selected_segment = segments[relevant_segments.iloc[0]['id']]

    # Video cutting
    video_output_path = os.path.join(settings.MEDIA_ROOT, 'detects', generate_random_filename("mp4"))
    cut_video(abs_file_path, video_output_path, selected_segment['start'], selected_segment['end'])
    video_output_path = video_output_path.replace(str(settings.BASE_DIR), "")
    
    remove_file(abs_file_path)
    remove_file(audio_file_path)

    return video_output_path
