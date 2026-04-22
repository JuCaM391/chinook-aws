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
        i.customer_id AS CustomerKey,
        il.track_id AS TrackKey,
        CAST(TO_CHAR(i.invoice_date, 'YYYYMMDD') AS INT) AS InvoiceDateKey,
        COALESCE(c.support_rep_id, 0) AS EmployeeKey,
        il.quantity AS Quantity,
        il.unit_price AS UnitPrice,
        (il.quantity * il.unit_price) AS TotalAmount,
        EXTRACT(YEAR FROM i.invoice_date)::INT AS year,
        EXTRACT(MONTH FROM i.invoice_date)::INT AS month,
        EXTRACT(DAY FROM i.invoice_date)::INT AS day
    FROM invoice i
    JOIN invoice_line il ON i.invoice_id = il.invoice_id
    JOIN customer c ON i.customer_id = c.customer_id
""", conn)

conn.close()

s3 = boto3.client('s3')

for (year, month, day), group in df.groupby(['year', 'month', 'day']):
    partition = group.drop(columns=['year','month','day'])
    buffer = io.BytesIO()
    partition.to_parquet(buffer, index=False)
    buffer.seek(0)
    key = f'fact-sales/year={year}/month={month}/day={day}/data.parquet'
    s3.put_object(Bucket='chinook-analytics-dw', Key=key, Body=buffer.getvalue())

print("FactSales cargado:", len(df), "filas")
