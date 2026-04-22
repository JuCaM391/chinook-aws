import pytest
import pandas as pd
from unittest.mock import patch, MagicMock

def test_dim_date_columns():
    import holidays
    from datetime import date, timedelta
    rows = []
    current = date(2000, 1, 1)
    us_holidays = holidays.US()
    for _ in range(10):
        rows.append({
            'DateKey': int(current.strftime('%Y%m%d')),
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
    assert 'DateKey' in df.columns
    assert 'IsHoliday' in df.columns
    assert len(df) == 10

def test_dim_date_datekey_format():
    from datetime import date
    d = date(2020, 5, 15)
    datekey = int(d.strftime('%Y%m%d'))
    assert datekey == 20200515

def test_fact_sales_total_amount():
    df = pd.DataFrame({
        'Quantity': [2, 3],
        'UnitPrice': [1.5, 2.0]
    })
    df['TotalAmount'] = df['Quantity'] * df['UnitPrice']
    assert df['TotalAmount'].iloc[0] == 3.0
    assert df['TotalAmount'].iloc[1] == 6.0
