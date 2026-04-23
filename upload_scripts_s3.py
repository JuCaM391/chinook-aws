import boto3

s3 = boto3.client('s3')
bucket = 'chinook-analytics-dw'

scripts = [
    'etl/etl_dim_date.py',
    'etl/etl_dim_customer.py',
    'etl/etl_dim_track.py',
    'etl/etl_fact_sales.py'
]

for script in scripts:
    filename = script.split('/')[-1]
    s3.upload_file(script, bucket, f'glue-scripts/{filename}')
    print(f"Subido: {filename} → s3://{bucket}/glue-scripts/{filename}")

print("Todos los scripts subidos exitosamente")
