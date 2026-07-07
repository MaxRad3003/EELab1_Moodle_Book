import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import os
import re
import urllib.parse

def validate_links_in_dist(dist_dir):
    """
    Scans all HTML files in dist/moodle_ready and its subdirectories.
    Finds <a href="..."> and <img src="..."> internal links.
    Validates that the target file actually exists on the filesystem relative to the HTML file.
    """
    if not os.path.exists(dist_dir):
        print(f"Directory {dist_dir} not found. Skipping validation.")
        return True

    broken_links = 0
    total_links = 0
    
    # Simple regex to find href and src attributes
    href_pattern = re.compile(r'href=["\'](.*?)["\']', re.IGNORECASE)
    src_pattern = re.compile(r'src=["\'](.*?)["\']', re.IGNORECASE)

    for root, _, files in os.walk(dist_dir):
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                links = href_pattern.findall(content) + src_pattern.findall(content)
                
                for link in links:
                    # Ignore external links, anchor links, mailto, etc.
                    if link.startswith(('http://', 'https://', 'mailto:', '#', 'data:')):
                        continue
                    
                    # Ignore JavaScript template literals
                    if '${' in link:
                        continue
                        
                    # Ignore empty links
                    if not link.strip():
                        continue
                        
                    # Remove any query params or hash fragments from the link
                    parsed_link = urllib.parse.urlparse(link)
                    clean_link = parsed_link.path
                    
                    if not clean_link:
                        continue
                        
                    # Handle URL encoding (e.g. %20 -> space)
                    clean_link = urllib.parse.unquote(clean_link)
                    
                    total_links += 1
                    target_path = os.path.join(root, clean_link)
                    target_path = os.path.normpath(target_path)
                    
                    if not os.path.exists(target_path):
                        print(f"[FAIL] Broken link in {os.path.relpath(file_path, dist_dir).encode('ascii', 'ignore').decode()}")
                        print(f"   -> Target: '{link}' not found!")
                        broken_links += 1

    if broken_links > 0:
        print(f"\n[FAIL] Validation failed: Found {broken_links} broken links/images out of {total_links} checked.")
        return False
    else:
        print(f"[OK] Validation Passed: All {total_links} internal links and images are valid!")
        return True

if __name__ == "__main__":
    import sys
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    moodle_ready_dir = os.path.join(root, 'dist', 'moodle_ready')
    
    print("\nValidating internal links and images...")
    success = validate_links_in_dist(moodle_ready_dir)
    
    if not success:
        print("\nFix the broken links above before packaging a Moodle release.")
        sys.exit(1)
