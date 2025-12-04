FROM python:3.10
WORKDIR /app
COPY SSACP.py ./
COPY tire.proto ./
RUN pip install grpcio grpcio-tools pymongo
RUN python -m grpc_tools.protoc --python_out=. --grpc_python_out=. -I. tire.proto
CMD ["python", "SSACP.py"]