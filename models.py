from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class Artist(Base):
    __tablename__ = "artist"
    ArtistId = Column("artist_id", Integer, primary_key=True)
    Name = Column("name", String)
    albums = relationship("Album", back_populates="artist")

class Album(Base):
    __tablename__ = "album"
    AlbumId = Column("album_id", Integer, primary_key=True)
    Title = Column("title", String)
    ArtistId = Column("artist_id", Integer, ForeignKey("artist.artist_id"))
    artist = relationship("Artist", back_populates="albums")
    tracks = relationship("Track", back_populates="album")

class Genre(Base):
    __tablename__ = "genre"
    GenreId = Column("genre_id", Integer, primary_key=True)
    Name = Column("name", String)

class Track(Base):
    __tablename__ = "track"
    TrackId = Column("track_id", Integer, primary_key=True)
    Name = Column("name", String)
    AlbumId = Column("album_id", Integer, ForeignKey("album.album_id"))
    GenreId = Column("genre_id", Integer, ForeignKey("genre.genre_id"))
    UnitPrice = Column("unit_price", Numeric)
    album = relationship("Album", back_populates="tracks")
    genre = relationship("Genre")

class Customer(Base):
    __tablename__ = "customer"
    CustomerId = Column("customer_id", Integer, primary_key=True)
    FirstName = Column("first_name", String)
    LastName = Column("last_name", String)
    Email = Column("email", String)

class Invoice(Base):
    __tablename__ = "invoice"
    InvoiceId = Column("invoice_id", Integer, primary_key=True)
    CustomerId = Column("customer_id", Integer, ForeignKey("customer.customer_id"))
    InvoiceDate = Column("invoice_date", DateTime)
    Total = Column("total", Numeric)
    customer = relationship("Customer")
    items = relationship("InvoiceItem", back_populates="invoice")

class InvoiceItem(Base):
    __tablename__ = "invoice_line"
    InvoiceLineId = Column("invoice_line_id", Integer, primary_key=True)
    InvoiceId = Column("invoice_id", Integer, ForeignKey("invoice.invoice_id"))
    TrackId = Column("track_id", Integer, ForeignKey("track.track_id"))
    UnitPrice = Column("unit_price", Numeric)
    Quantity = Column("quantity", Integer)
    invoice = relationship("Invoice", back_populates="items")
    track = relationship("Track")
