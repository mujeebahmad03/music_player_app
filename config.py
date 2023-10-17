from decouple import config

DJANGO_SECRET_KEY = config("SECRET_KEY")
CLIENT_ID = config("CLIENT_ID")
CLIENT_SECRET = config("CLIENT_SECRET")
REDIRECT_URI = "http://127.0.0.1:8000/spotify/redirect"

