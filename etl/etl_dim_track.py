import boto3
import pandas as pd
import psycopg2
import io

conn = psycopg2.connect(
    host="chinook-db98.cfkcevqr8vv7.us-east-1.rds.amazonaws.com",
    database="chinook",
    user="postgres",
    password="postgres123"
)

df = pd.read_sql("""
    SELECT 
        t.track_id AS TrackKey,
        t.name AS Name,
        al.title AS Album,
        ar.name AS Artist,
        g.name AS Genre,
        mt.name AS MediaType,
        COALESCE(t.composer, '') AS Composer,
        t.milliseconds AS Milliseconds
    FROM track t
    JOIN album al ON t.album_id = al.album_id
    JOIN artist ar ON al.artist_id = ar.artist_id
    JOIN genre g ON t.genre_id = g.genre_id
    JOIN media_type mt ON t.media_type_id = mt.media_type_id
""", conn)

conn.close()

buffer = io.BytesIO()
df.to_parquet(buffer, index=False)
buffer.seek(0)

s3 = boto3.client('s3')
s3.put_object(
    Bucket='chinook-analytics-dw',
    Key='dim-track/dim_track.parquet',
    Body=buffer.getvalue()
)
print("DimTrack cargado:", len(df), "filas")
