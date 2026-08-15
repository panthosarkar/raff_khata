from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
  CORSMiddleware,
  allow-origins=[
      "http://localhost:3000",
      "https://raff-khata.vercel.app"
  ]
  allow_credentials=True,
  allow_methods=[*],
  allow_headers=[*],
)
