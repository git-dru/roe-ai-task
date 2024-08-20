from rest_framework.views import APIView
from django.http.response import JsonResponse

from detect.utils import upload_file
from detect.service import detect

class DetectAPIView(APIView):
  def post(self, request):
    file = request.FILES.get('file')
    search_text = request.data.get('search_text')
        
    if file:
      uploaded_url = upload_file(file)
      
      video_output_path = detect(uploaded_url, search_text)
      
      return JsonResponse({
        "message": "File uploaded successfully",
        "file_url": video_output_path
      })
    else:
      return JsonResponse({
        "message": "No file uploaded"
      }, status=400)