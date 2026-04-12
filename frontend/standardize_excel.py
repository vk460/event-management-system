import os

norm_logic = r"""      const data = XLSX.utils.sheet_to_json(ws);
      const normalized = data.map(row => {
          const newRow = {};
          Object.keys(row).forEach(key => {
              const cleanKey = key.trim().toLowerCase().replace(/\s+/g, '_');
              newRow[cleanKey] = row[key];
          });
          return newRow;
      });
      setPreviewData(normalized);"""

# The target we are replacing
old_pattern_1 = """      const data = XLSX.utils.sheet_to_json(ws);
      setPreviewData(data);"""

old_pattern_2 = """      const data = XLSX.utils.sheet_to_json(ws);
      setPreviewData(data.slice(0, 50));"""

files = [
    r"f:\Event Management\frontend\src\pages\Principal\Dashboard.jsx",
    r"f:\Event Management\frontend\src\pages\HOD\Dashboard.jsx",
    r"f:\Event Management\frontend\src\pages\Teacher\Dashboard.jsx"
]

for f_path in files:
    if not os.path.exists(f_path): continue
    with open(f_path, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Try multiple common patterns
    if old_pattern_1 in text:
         text = text.replace(old_pattern_1, norm_logic)
         print(f"Fixed pattern 1 in {f_path}")
    elif old_pattern_2 in text:
         text = text.replace(old_pattern_2, norm_logic)
         print(f"Fixed pattern 2 in {f_path}")

    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(text)
