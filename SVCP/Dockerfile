FROM python:3.10
WORKDIR /app
COPY SVCP.py .
RUN pip install fastapi uvicorn pymongo
CMD ["uvicorn", "SVCP:app", "--host", "0.0.0.0", "--port", "8000"]
