import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job
from awsglue.dynamicframe import DynamicFrame

args = getResolvedOptions(sys.argv, ['JOB_NAME'])
sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

track = glueContext.create_dynamic_frame.from_catalog(database="chinook_transactional", table_name="chinook_public_track").toDF()
album = glueContext.create_dynamic_frame.from_catalog(database="chinook_transactional", table_name="chinook_public_album").toDF()
artist = glueContext.create_dynamic_frame.from_catalog(database="chinook_transactional", table_name="chinook_public_artist").toDF()
genre = glueContext.create_dynamic_frame.from_catalog(database="chinook_transactional", table_name="chinook_public_genre").toDF()
media = glueContext.create_dynamic_frame.from_catalog(database="chinook_transactional", table_name="chinook_public_media_type").toDF()

df = track.join(album, "album_id", "left").join(artist, "artist_id", "left").join(genre, "genre_id", "left").join(media, "media_type_id", "left")

dyf = DynamicFrame.fromDF(df, glueContext, "dyf")
glueContext.write_dynamic_frame.from_options(frame=dyf, connection_type="s3", connection_options={"path": "s3://chinook-analytics-dw/dim-track/"}, format="parquet")
job.commit()
