# H5P for Exp03

Upload `Exp03_AC_Quiz.h5p` to Moodle as an H5P activity.

The editable package source is kept at:

`h5p_src/Exp03_AC_Quiz_src`

After editing `h5p_src/Exp03_AC_Quiz_src/content/content.json` or `h5p_src/Exp03_AC_Quiz_src/h5p.json`, rebuild the package from inside that source folder:

```powershell
Compress-Archive -Path * -DestinationPath ..\..\src\content\EELab1\Exp03\moodle_book_import_v2\H5P_Quiz\Exp03_AC_Quiz.h5p -Force
```
