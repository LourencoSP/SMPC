FROM python:3.10
WORKDIR /app
COPY ISCCP.py ./ 
COPY tire.proto ./
RUN pip install grpcio grpcio-tools paho-mqtt
RUN python -m grpc_tools.protoc --python_out=. --grpc_python_out=. -I. tire.proto
CMD ["python", "ISCCP.py"]