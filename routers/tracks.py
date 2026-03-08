from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Track, Album, Artist, Genre

router = APIRouter(prefix="/tracks", tags=["Tracks"])

@router.get("/")
def get_tracks(
    name: str = Query(None),
    artist: str = Query(None),
    genre: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Track).join(Album).join(Artist).join(Genre, Track.GenreId == Genre.GenreId)
    if name:
        query = query.filter(Track.Name.ilike(f"%{name}%"))
    if artist:
        query = query.filter(Artist.Name.ilike(f"%{artist}%"))
    if genre:
        query = query.filter(Genre.Name.ilike(f"%{genre}%"))
    return query.limit(50).all()

@router.get("/{track_id}")
def get_track(track_id: int, db: Session = Depends(get_db)):
    track = db.query(Track).filter(Track.TrackId == track_id).first()
    if not track:
        raise HTTPException(status_code=404, detail="Canción no encontrada")
    return track
