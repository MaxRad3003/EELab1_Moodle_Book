import http.server
import socketserver
import urllib.parse
import os
import zipfile
import threading
import webbrowser

PORT = 8080
DIRECTORY = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist", "previews")

PLAYER_HTML = """<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="utf-8">
    <title>H5P Moodle Simulator</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/h5p-standalone@3.5.1/dist/styles/h5p.css">
    <script src="https://cdn.jsdelivr.net/npm/h5p-standalone@3.5.1/dist/main.bundle.js"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f9fa; margin: 0; padding: 20px; }
        .simulator-header { text-align: center; margin-bottom: 20px; color: #005696; }
        #h5p-container { max-width: 900px; margin: 0 auto; background: white; box-shadow: 0 0 15px rgba(0,0,0,0.1); border-radius: 8px; padding: 10px; }
        .nav-controls { max-width: 900px; margin: 0 auto 15px auto; display: flex; justify-content: space-between; align-items: center; }
    </style>
</head>
<body>
    <div class="nav-controls">
        <a href="javascript:history.back()" class="btn btn-outline-secondary fw-bold">⬅ חזור אחורה</a>
        <h4 class="m-0 text-primary fw-bold">סימולטור H5P (מצב תצוגה מקדימה)</h4>
        <div style="width: 100px;"></div>
    </div>
    
    <div id="h5p-container"></div>
    
    <script>
        const el = document.getElementById('h5p-container');
        const options = {
            h5pJsonPath: '{extract_url}',
            frameJs: 'https://cdn.jsdelivr.net/npm/h5p-standalone@3.5.1/dist/frame.bundle.js',
            frameCss: 'https://cdn.jsdelivr.net/npm/h5p-standalone@3.5.1/dist/styles/h5p.css',
        };
        new H5PStandalone.H5P(el, options);
    </script>
</body>
</html>
"""

class MoodleSimulatorHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Prevent caching so that rebuilt h5p files are loaded fresh
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        super().end_headers()

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        
        # Intercept .h5p file requests
        if parsed_path.path.endswith('.h5p'):
            rel_path = urllib.parse.unquote(parsed_path.path).lstrip('/')
            full_disk_path = os.path.join(DIRECTORY, rel_path)
            
            if os.path.exists(full_disk_path):
                # We need to extract the zip to a temporary folder
                extract_dir = full_disk_path + "_extracted"
                
                # Always re-extract to ensure we have the latest version if the file changed
                try:
                    with zipfile.ZipFile(full_disk_path, 'r') as zip_ref:
                        zip_ref.extractall(extract_dir)
                except Exception as e:
                    print(f"Error extracting H5P file: {e}")
                    self.send_error(500, f"Error extracting H5P file: {e}")
                    return
                
                # Return the HTML player page instead of the zip file
                extract_url = parsed_path.path + "_extracted"
                html_content = PLAYER_HTML.replace('{extract_url}', extract_url)
                
                self.send_response(200)
                self.send_header("Content-type", "text/html; charset=utf-8")
                self.end_headers()
                self.wfile.write(html_content.encode('utf-8'))
                return

        return super().do_GET()

def start_server():
    if not os.path.exists(DIRECTORY):
        print(f"Error: Directory '{DIRECTORY}' does not exist.")
        print("Please build the previews first (e.g., using 'npm run preview:index').")
        return

    with socketserver.TCPServer(("", PORT), MoodleSimulatorHandler) as httpd:
        print(f"\\n===============================================")
        print(f"🚀 Moodle Simulator running at http://localhost:{PORT}")
        print(f"📁 Serving directory: {DIRECTORY}")
        print(f"💡 H5P files will automatically play in the browser.")
        print(f"===============================================\\n")
        
        # Try to automatically open the browser
        threading.Timer(1.0, lambda: webbrowser.open(f'http://localhost:{PORT}/index.html')).start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\\nServer stopped.")

if __name__ == "__main__":
    start_server()
