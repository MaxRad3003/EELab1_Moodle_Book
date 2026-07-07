from playwright.sync_api import sync_playwright
import time
import os
import glob

# Get the project root directory
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def main():
    # Dynamically find all .h5p files in the release directory
    h5p_pattern = os.path.join(root, 'dist', 'release', '**', '*.h5p')
    files_to_upload = [os.path.abspath(f) for f in glob.glob(h5p_pattern, recursive=True)]

    if not files_to_upload:
        print("No .h5p files found in dist/release/ ! Please make sure you have run the release build first.")
        return

    print(f"Found {len(files_to_upload)} H5P files to upload:")
    for idx, f in enumerate(files_to_upload, 1):
        print(f"  {idx}. {os.path.basename(f)}")

    with sync_playwright() as p:
        # Launch Chromium in non-headless mode so the user can log in
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()

        print("\nNavigating to Moodle Content Bank...")
        # You can update the contextid if needed for a different course
        page.goto("https://moodle.sce.ac.il/contentbank/index.php?contextid=1296381")
        
        print("Please log in if required. Waiting for the 'Upload' button to appear...")
        # Wait for the "Upload" button to appear on the screen to confirm login is done.
        upload_btn = page.locator("text=Upload").first
        upload_btn.wait_for(state="visible", timeout=300000)
        print("Login confirmed! Starting automated uploads...")

        for file_path in files_to_upload:
            file_name = os.path.basename(file_path)
            print(f"\nUploading: {file_name}")
            
            try:
                # Click the initial 'Upload' button in the content bank
                page.locator("text=Upload").first.click()
                
                # Wait for the file picker dialog to appear and click 'Choose a file...'
                page.wait_for_selector(".dndupload-message .btn")
                page.click(".dndupload-message .btn")

                # Wait for the Moodle file picker to load
                page.wait_for_selector("input[type='file'][name='repo_upload_file']")
                
                # Bypassing OS Dialog: Set the file path directly to the hidden input
                page.set_input_files("input[type='file'][name='repo_upload_file']", file_path)
                time.sleep(1.5) # short pause

                # Click "Upload this file" button in the modal
                page.click(".fp-upload-btn")
                
                # Wait for upload to complete and for the "Save changes" button to be clickable
                page.wait_for_selector("button[data-action='save']", state="visible", timeout=60000)
                page.click("button[data-action='save']")

                # Wait for the H5P player preview page to load
                page.wait_for_selector("iframe.h5p-iframe", state="visible", timeout=60000)
                print(f"Successfully uploaded: {file_name}")

                # Click "Exit" to go back to the Content bank
                page.click("a:has-text('Exit')")
                
                # Wait to be back at the content bank list before next iteration
                page.locator("text=Upload").first.wait_for(state="visible", timeout=60000)
            except Exception as e:
                print(f"❌ Error uploading {file_name}: {e}")
                # Try to navigate back to Content Bank to recover
                page.goto("https://moodle.sce.ac.il/contentbank/index.php?contextid=1296381")
                page.locator("text=Upload").first.wait_for(state="visible", timeout=60000)

        print("\n🎉 All files processed!")
        browser.close()

if __name__ == "__main__":
    main()
