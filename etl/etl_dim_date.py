import boto3
import pandas as pd
from datetime import date, timedelta
import holidays
import io

# Generar fechas desde 2000 hasta 2030
start = date(2000, 1, 1)
end = date(2030, 12, 31)

us_holidays = holidays.US()

rows = []
current = start
while current <= end:
    datekey = int(current.strftime('%Y%m%d'))
    rows.append({
        'DateKey': datekey,
        'FullDate': current.strftime('%Y-%m-%d'),
        'Year': current.year,
        'Quarter': (current.month - 1) // 3 + 1,
        'Month': current.month,
        'Day': current.day,
        'DayOfWeek': current.isoweekday(),
        'IsHoliday': current in us_holidays
    })
    current += timedelta(days=1)

df = pd.DataFrame(rows)

# Guardar como parquet y subir a S3
buffer = io.BytesIO()
df.to_parquet(buffer, index=False)
buffer.seek(0)

s3 = boto3.client('s3')
s3.put_object(
    Bucket='chinook-analytics-dw',
    Key='dim-date/dim_date.parquet',
    Body=buffer.getvalue()
)
print("DimDate cargado exitosamente:", len(df), "filas")
