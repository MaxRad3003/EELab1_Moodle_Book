import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import os
import re
from PIL import Image
from concurrent.futures import ThreadPoolExecutor, as_completed

def process_image(file_path, file, figure_dir):
    name_part, ext = os.path.splitext(file)
    ext = ext.lower()
    
    if ext not in ['.png', '.jpg', '.jpeg']:
        return None
        
    try:
        with Image.open(file_path) as img:
            # Convert to RGB if needed (WebP handles RGBA, but for size we might want RGB if no alpha)
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                pass # Keep alpha
            elif img.mode != 'RGB':
                img = img.convert('RGB')
                
            width, height = img.size
            orig_size = os.path.getsize(file_path)
            
            new_file_name = name_part + '.webp'
            new_file_path = os.path.join(figure_dir, new_file_name)
            
            if width > 1200:
                ratio = 1200 / width
                new_height = int(height * ratio)
                img_resized = img.resize((1200, new_height), Image.Resampling.LANCZOS)
                img_resized.save(new_file_path, 'WEBP', quality=80, method=4)
            else:
                img.save(new_file_path, 'WEBP', quality=80, method=4)
                
            new_size = os.path.getsize(new_file_path)
            
            if new_size < orig_size:
                print(f"Converted {file} -> {new_file_name} | {orig_size//1024}KB -> {new_size//1024}KB")
                if ext != '.webp':
                    os.remove(file_path)
                return (f"Figure/{file}", f"Figure/{new_file_name}")
            else:
                # If WebP isn't smaller, keep original
                if os.path.exists(new_file_path) and new_file_path != file_path:
                    os.remove(new_file_path)
                return None
    except Exception as e:
        print(f"Error processing {file}: {e}")
        return None

def optimize_images():
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    figure_dir = os.path.join(root, 'src', 'content', 'Measuring equipment', 'EELab_Measuring_equipment', 'Figure')
    html_dir = os.path.join(root, 'src', 'content', 'Measuring equipment', 'EELab_Measuring_equipment')
    
    if not os.path.exists(figure_dir):
        print(f"Figure directory not found: {figure_dir}")
        return

    conversions = {}
    files_to_process = [f for f in os.listdir(figure_dir) if os.path.isfile(os.path.join(figure_dir, f))]
    
    print("Optimizing images in parallel...")
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = [executor.submit(process_image, os.path.join(figure_dir, f), f, figure_dir) for f in files_to_process]
        for future in as_completed(futures):
            res = future.result()
            if res:
                conversions[res[0]] = res[1]

    if conversions:
        print(f"\nUpdating {len(conversions)} HTML references...")
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
        print("Optimization complete!")
    else:
        print("No optimizations were necessary or beneficial.")

if __name__ == '__main__':
    optimize_images()
