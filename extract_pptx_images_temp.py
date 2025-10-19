import zipfile
import os
import shutil

# Path to your downloaded PPTX
pptx_path = "/home/eliot/Documents/Projects/TheHolyQuail.github.io/portfolio-20250713.pptx"

# Destination folder for images
output_root = "/home/eliot/Documents/Projects/TheHolyQuail.github.io/images/DIY images/temp"

# Create output folder (overwrite if exists)
if os.path.exists(output_root):
    shutil.rmtree(output_root)
os.makedirs(output_root, exist_ok=True)

# Open PPTX as a zip
with zipfile.ZipFile(pptx_path, 'r') as pptx_zip:
    # List all files in ppt/media/
    media_files = [f for f in pptx_zip.namelist() if f.startswith("ppt/media/")]
    
    if not media_files:
        print("No images found in ppt/media/")
        exit(1)
    
    # Extract each image and number them chronologically
    for i, media_file in enumerate(sorted(media_files), start=1):
        ext = os.path.splitext(media_file)[1]  # get original extension
        dest_path = os.path.join(output_root, f"image_{i}{ext}")
        with pptx_zip.open(media_file) as source, open(dest_path, 'wb') as target:
            shutil.copyfileobj(source, target)

print(f"Extraction complete. All images saved in {output_root}")
