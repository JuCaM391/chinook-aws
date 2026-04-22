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
        customer_id AS CustomerKey,
        first_name AS FirstName,
        last_name AS LastName,
        COALESCE(company, '') AS Company,
        country AS Country,
        city AS City,
        COALESCE(state, '') AS State,
        email AS Email
    FROM customer
""", conn)

conn.close()

buffer = io.BytesIO()
df.to_parquet(buffer, index=False)
buffer.seek(0)

s3 = boto3.client('s3')
s3.put_object(
    Bucket='chinook-analytics-dw',
    Key='dim-customer/dim_customer.parquet',
    Body=buffer.getvalue()
)
print("DimCustomer cargado:", len(df), "filas")
