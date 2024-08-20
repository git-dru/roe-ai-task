# Roe AI Take-Home Assignment

## Overview

This project is a minimal full-stack web application built using Django (backend) and Next.js (frontend) that allows users to upload short video clips (under 3 minutes) and search for specific frames based on a natural language question. The app uses OpenAI's Whisper model for transcribing the audio from the video and GPT-3 for embedding and semantic search to find the most relevant video segment.

## Features

1. **Video Upload**: Allows users to upload video files through a simple API endpoint.
2. **Natural Language Search**: Users can input a natural language question, and the app will return the most relevant video frame that matches the query.
3. **Audio Transcription**: Converts the video to audio and transcribes it using OpenAI's Whisper model.
4. **Semantic Search**: Embeds the transcribed text and uses cosine similarity to find the most relevant segments.
5. **Video Clipping**: The app cuts the video to the specific segment that matches the user's query and returns the URL for the clipped video.

## Tech Stack

- **Backend**: Django, Django REST Framework
- **Frontend**: Next.js, React
- **Audio/Video Processing**: FFmpeg
- **AI Services**: OpenAI API (Whisper, GPT-3)

## Setup Instructions

### Prerequisites

- Python 3.8+
- Django 3.2+
- Node.js 14+
- FFmpeg installed on your system (https://www.wikihow.com/Install-FFmpeg-on-Windows)
- OpenAI API key

### Backend Setup (Django)

1. **Clone the repository**

   ```bash
   git clone https://github.com/git-dru/roe-ai-task.git
   cd roe-ai-task/backend
   ```

2. **Create and activate a virtual environment**

   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

3. **Create and activate a virtual environment**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
  Create a `.env`  file in the `backend`  directory and add the following:
   ```bash
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **Start the Django development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (Next.js)
1. **Navigate to the frontend directory**
   ```bash
   cd roe-ai-task/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
  Create a `.env`  file in the `frontend`  directory and add the following:
   ```bash
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

4. **Start the Next.js development server**
   ```bash
   npm run dev
   ```

5. **Access the frontend**
Open your browser and navigate to http://localhost:3000. This will take you to the Next.js frontend interface where you can upload videos and perform searches.

### Usage
- **Upload Video**: Use the frontend interface to upload a video and enter a natural language search query.
- **Search Video**: The frontend will send a request to the backend, which will process the video, search for the segment that best matches the provided text, and return the URL of the clipped video.

### API Endpoints
- `POST /api/detect/` : Upload a video and search for a relevant segment.
    - **Request Body**:
        - `file`  (file): The video file to be uploaded.
        - `search_text`  (string): The natural language question to search in the video.
    - **Response**:
        - `file_url` : URL of the clipped video segment that matches the search text.

### Decisions and Assumptions
1. **OpenAI for Search**: Whisper was chosen for transcription due to its accuracy with speech-to-text, and GPT-3 embeddings were used for their ability to understand and represent the meaning of text in a vector format.

2. **FFmpeg for Video Processing**: FFmpeg is a reliable tool for audio extraction and video clipping, making it ideal for this task.

3. **Django for API**: Django's simplicity in setting up RESTful APIs made it the choice for the backend, especially when combined with Django REST Framework.

4. **Next.js for Frontend**: Next.js provides server-side rendering and a powerful framework for building the frontend interface, making it the ideal choice for this project.
### Future Enhancements

- **Enhanced UI/UX**: Improve the user interface and user experience on the frontend.

- **Advanced Search**: Implement more advanced search techniques like dynamic time warping for better segment matching.

- **Scalability**: Implement backend caching and improve performance for handling larger videos and multiple users.

### License
This project is licensed under the MIT License - see the LICENSE file for details.