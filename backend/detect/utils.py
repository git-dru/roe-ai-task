import os
import uuid
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings

def upload_file(file):
  # Construct a file path or use a default one
  file_path = f'{settings.UPLOAD_URL}/{generate_random_filename()}'

  # Save the file to the default storage
  path = default_storage.save(file_path, ContentFile(file.read()))
  
  # The full path to the file in the storage
  file_url = default_storage.url(path)
  
  return file_url

def remove_file(file_path):
  # Remove the file from the default storage
  default_storage.delete(file_path)
  
def make_dir(path):
    # Create the directory if it doesn't exist
    if not os.path.exists(path):
        os.makedirs(path)

def generate_random_filename(extension = ""):
  filename = uuid.uuid4()
  
  if extension:
    filename = f"{filename}.{extension}"
    
  return filename