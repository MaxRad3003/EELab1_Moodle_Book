import os
import subprocess
import shutil

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def run_command(cmd, cwd=root):
    print(f"Running: {cmd}")
    res = subprocess.run(cmd, shell=True, cwd=cwd)
    if res.returncode != 0:
        raise Exception(f"Command failed: {cmd}")

def rebuild_all():
    # 1. Clean dist
    dist_dir = os.path.join(root, 'dist')
    print("Cleaning dist directory...")
    run_command("npm run clean")
    os.makedirs(dist_dir, exist_ok=True)

    # 2. Build
    run_command("npm run build")

    # 3. Package Exp01, Exp02, Exp03 using Python
    run_command("python scripts/package_moodle_experiments.py")

    # 4. Package Exp04 and Exp05
    run_command("python scripts/package_exp04_exp05.py")

    # 5. Package Measuring Equipment
    run_command("python scripts/package_measuring_equipment.py")

    # 6. Package Mastech Only
    run_command("python scripts/package_mastech_only.py")

    # 7. Package Full Distribution
    run_command("python scripts/package_full_distribution.py")

    # 8. Copy ZIP files to root of dist
    print("Copying ZIP files to root of dist...")
    measuring_eq_zip = os.path.join(root, 'dist', 'moodle_ready', 'Measuring equipment', 'EELab_Measuring_equipment_Moodle_Book.zip')
    if os.path.exists(measuring_eq_zip):
        shutil.copyfile(measuring_eq_zip, os.path.join(dist_dir, 'EELab_Measuring_equipment_Moodle_Book.zip'))

    release_dir = os.path.join(root, 'dist', 'release')
    for file in os.listdir(release_dir):
        if file.endswith('.zip'):
            shutil.copyfile(os.path.join(release_dir, file), os.path.join(dist_dir, file))

    print("\nSUCCESS: All files successfully rebuilt, packaged, and organized in dist/ !")

if __name__ == '__main__':
    rebuild_all()
