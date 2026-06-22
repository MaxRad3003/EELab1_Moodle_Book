import os
import re
from PIL import Image

def optimize_images():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    figure_dir = os.path.join(root, 'src', 'content', 'Measuring equipment', 'EELab_Measuring_equipment', 'Figure')
    html_dir = os.path.join(root, 'src', 'content', 'Measuring equipment', 'EELab_Measuring_equipment')
    
    if not os.path.exists(figure_dir):
        print(f"Figure directory not found: {figure_dir}")
        return

    # Files to convert and optimize
    conversions = {}
    
    # Process files in Figure directory
    for file in os.listdir(figure_dir):
        file_path = os.path.join(figure_dir, file)
        if not os.path.isfile(file_path):
            continue
            
        name_part, ext = os.path.splitext(file)
        ext = ext.lower()
        
        if ext not in ['.png', '.jpg', '.jpeg']:
            continue
            
        try:
            with Image.open(file_path) as img:
                fmt = img.format
                width, height = img.size
                orig_size = os.path.getsize(file_path)
                
                # Check if it needs resize or optimization
                # If width > 1200, resize to max 1200 width
                # If JPEG (even if named png) or JPG, we save as JPEG with quality 82
                is_actually_jpeg = (fmt == 'JPEG')
                
                if ext == '.png' and is_actually_jpeg:
                    # Rename to .jpg and save as JPEG
                    new_file_name = name_part + '.jpg'
                    new_file_path = os.path.join(figure_dir, new_file_name)
                    
                    # Resize if too large
                    if width > 1200:
                        ratio = 1200 / width
                        new_height = int(height * ratio)
                        img_resized = img.resize((1200, new_height), Image.Resampling.LANCZOS)
                        img_resized.save(new_file_path, 'JPEG', quality=82, optimize=True)
                    else:
                        img.save(new_file_path, 'JPEG', quality=82, optimize=True)
                        
                    new_size = os.path.getsize(new_file_path)
                    print(f"Converted {file} ({width}x{height}) -> {new_file_name}: {orig_size} -> {new_size} bytes ({(orig_size - new_size)/1024:.1f} KB saved)")
                    
                    # Store conversion mapping
                    conversions[f"Figure/{file}"] = f"Figure/{new_file_name}"
                    
                    # Delete the old file
                    os.remove(file_path)
                    
                elif ext in ['.jpg', '.jpeg']:
                    # Optimize in-place
                    # Resize if too large
                    if width > 1200:
                        ratio = 1200 / width
                        new_height = int(height * ratio)
                        img_resized = img.resize((1200, new_height), Image.Resampling.LANCZOS)
                        img_resized.save(file_path, 'JPEG', quality=82, optimize=True)
                    else:
                        img.save(file_path, 'JPEG', quality=82, optimize=True)
                        
                    new_size = os.path.getsize(file_path)
                    if new_size < orig_size:
                        print(f"Optimized {file} ({width}x{height}) in-place: {orig_size} -> {new_size} bytes ({(orig_size - new_size)/1024:.1f} KB saved)")
                    else:
                        # If size didn't reduce, restore from disk
                        pass
        except Exception as e:
            print(f"Error processing {file}: {e}")

    # Update HTML files to point to the new JPG files
    if conversions:
        print("\nUpdating HTML references...")
        for file in os.listdir(html_dir):
            if file.endswith('.html'):
                html_path = os.path.join(html_dir, file)
                with open(html_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                updated = False
                for old_ref, new_ref in conversions.items():
                    if old_ref in content:
                        content = content.replace(old_ref, new_ref)
                        print(f"Updated ref '{old_ref}' -> '{new_ref}' in {file}")
                        updated = True
                
                if updated:
                    with open(html_path, 'w', encoding='utf-8') as f:
                        f.write(content)

if __name__ == '__main__':
    optimize_images()
