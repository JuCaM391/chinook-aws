from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import artists, albums, tracks, customers, invoices

app = FastAPI(title="Chinook API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(artists.router)
app.include_router(albums.router)
app.include_router(tracks.router)
app.include_router(customers.router)
app.include_router(invoices.router)

@app.get("/")
def root():
    return {"message": "Chinook API funcionando"}
