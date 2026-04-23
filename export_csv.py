import boto3
import time

athena = boto3.client('athena', region_name='us-east-1')
s3_output = 's3://chinook-analytics-dw/athena-results/'

queries = {
    'tracks_por_dia': "SELECT d.FullDate, SUM(f.Quantity) AS total_tracks FROM chinook_dw.fact_sales f JOIN chinook_dw.dim_date d ON f.InvoiceDateKey = d.DateKey GROUP BY d.FullDate ORDER BY d.FullDate",
    'artista_por_mes': "SELECT d.Year, d.Month, t.Artist, SUM(f.Quantity) AS total FROM chinook_dw.fact_sales f JOIN chinook_dw.dim_track t ON f.TrackKey = t.TrackKey JOIN chinook_dw.dim_date d ON f.InvoiceDateKey = d.DateKey GROUP BY d.Year, d.Month, t.Artist ORDER BY d.Year, d.Month, total DESC",
    'dia_semana': "SELECT d.DayOfWeek, SUM(f.Quantity) AS total FROM chinook_dw.fact_sales f JOIN chinook_dw.dim_date d ON f.InvoiceDateKey = d.DateKey GROUP BY d.DayOfWeek ORDER BY total DESC",
    'mes_ventas': "SELECT d.Month, SUM(f.Quantity) AS total FROM chinook_dw.fact_sales f JOIN chinook_dw.dim_date d ON f.InvoiceDateKey = d.DateKey GROUP BY d.Month ORDER BY total DESC"
}

for name, query in queries.items():
    resp = athena.start_query_execution(
        QueryString=query,
        ResultConfiguration={'OutputLocation': s3_output}
    )
    qid = resp['QueryExecutionId']
    while True:
        status = athena.get_query_execution(QueryExecutionId=qid)['QueryExecution']['Status']['State']
        if status in ['SUCCEEDED','FAILED']: break
        time.sleep(2)
    print(f"{name}: {status} -> {s3_output}{qid}.csv")
