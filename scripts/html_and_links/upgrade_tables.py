import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import os
import glob
from bs4 import BeautifulSoup

def upgrade_tables():
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    content_dir = os.path.join(root_dir, 'src', 'content', 'EELab1')

    # Find all html files
    html_files = glob.glob(os.path.join(content_dir, '**', '*.html'), recursive=True)
    
    excel_note = """
    <div class="alert alert-info shadow-sm my-4 text-center" dir="rtl" style="border-right: 5px solid #005696; font-size: 1.1rem;">
        <i class="fa fa-file-excel-o fa-lg me-2" style="color: #217346;"></i>
        <strong>לעיבוד הנתונים:</strong> 
        <a href="#" class="alert-link text-decoration-none" style="color: #005696;">📥 להורדת תבנית המדידות ל-MATLAB (קובץ Excel) לחץ כאן</a>
    </div>
    """

    count = 0
    for file_path in html_files:
        with open(file_path, 'r', encoding='utf-8-sig') as f:
            content = f.read().replace('\ufeff', '')
            soup = BeautifulSoup(content, 'html.parser')
            
        tables = soup.find_all('table')
        if not tables:
            continue
            
        modified = False
        first_table = True
        
        for table in tables:
            # Upgrade table classes
            current_classes = table.get('class', [])
            if not isinstance(current_classes, list):
                current_classes = [current_classes]
                
            new_classes = ['table', 'table-bordered', 'table-striped', 'table-hover', 'text-center', 'align-middle', 'mb-0']
            table['class'] = list(set(current_classes + new_classes))
            
            # Ensure RTL
            table['dir'] = 'rtl'
            
            # Remove inline styles that mess with responsiveness
            if table.has_attr('style'):
                del table['style']
            if table.has_attr('width'):
                del table['width']
            if table.has_attr('align'):
                del table['align']
                
            # Upgrade headers
            thead = table.find('thead')
            if thead:
                thead_classes = thead.get('class', [])
                if not isinstance(thead_classes, list):
                    thead_classes = [thead_classes]
                thead['class'] = list(set(thead_classes + ['table-primary', 'align-middle']))
                
                for th in thead.find_all('th'):
                    if th.has_attr('style'):
                        del th['style']
                    if th.has_attr('align'):
                        del th['align']

            # Upgrade cells
            for td in table.find_all('td'):
                if td.has_attr('style'):
                    del td['style']
                if td.has_attr('align'):
                    del td['align']
                if td.has_attr('valign'):
                    del td['valign']
            
            # Wrap in table-responsive if not already wrapped
            parent = table.parent
            if parent and parent.name == 'div' and 'table-responsive' in parent.get('class', []):
                pass
            else:
                wrapper = soup.new_tag('div', **{'class': 'table-responsive my-4 shadow-sm rounded border'})
                table.wrap(wrapper)
                modified = True

            # Insert Excel note before the first table wrapper in the file
            if first_table:
                # Add notice if it doesn't exist
                if not soup.find(lambda tag: tag.name == 'div' and 'לעיבוד הנתונים' in tag.text):
                    note_soup = BeautifulSoup(excel_note, 'html.parser')
                    table.parent.insert_before(note_soup)
                    modified = True
                first_table = False
                
        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(str(soup))
            print(f"Upgraded tables in {os.path.basename(file_path)}")
            count += 1
            
    print(f"Successfully upgraded tables in {count} HTML files.")

if __name__ == '__main__':
    upgrade_tables()
