Put the 10 session recordings in this folder, named exactly:

  session-1.mp4   session-2.mp4   ...   session-10.mp4

Use H.264 video + AAC audio (a normal .mp4 from most editors/phones after export).
They then play in the student portal and watch time is tracked automatically.

Big files? Host them on a video CDN (Bunny, Cloudflare R2, S3...) and paste each
direct .mp4 link into `videoOverrides` in src/data/course.ts instead.
