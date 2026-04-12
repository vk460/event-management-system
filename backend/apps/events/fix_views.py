import os

file_path = r"f:\Event Management\backend\apps\events\views.py"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

import re

# Match the logic block loosely
pattern = r"        action = request.data.get\('action'\) # 'approve' or 'reject'\n\s*if action == 'approve':\n\s*if request.user.role == 'hod':\n\s*event.status = Event.Status.HOD_APPROVED\n\s*msg = \"hod_approved\"\n\s*else:\n\s*event.status = Event.Status.APPROVED\n\s*msg = \"approved\"\n\s*elif action == 'reject':\n\s*event.status = Event.Status.REJECTED\n\s*msg = \"rejected\""

replacement = """        action = request.data.get('action') # 'approve' or 'reject'
        if action == 'approve':
            if request.user.role in ['principal', 'admin']:
                event.status = Event.Status.PRINCIPAL_APPROVED
                msg = "principal_approved"
            elif request.user.role == 'hod':
                if event.status != Event.Status.PRINCIPAL_APPROVED:
                     return Response({"error": "Event must be approved by Principal first."}, status=status.HTTP_400_BAD_REQUEST)
                event.status = Event.Status.APPROVED
                msg = "approved"
            else:
                 return Response({"error": "Unauthorized action."}, status=status.HTTP_403_FORBIDDEN)
        elif action == 'reject':
            event.status = Event.Status.REJECTED
            msg = "rejected\""""

content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated views.py correctly.")
