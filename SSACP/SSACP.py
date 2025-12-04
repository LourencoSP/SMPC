import grpc
from concurrent import futures
import pymongo
import tire_pb2, tire_pb2_grpc
import json

mongo = pymongo.MongoClient("mongodb://mongo1:27017,mongo2:27017,mongo3:27017/?replicaSet=rs0")


db = mongo["f1"]
col = db["tires"]

class Service(tire_pb2_grpc.TireServiceServicer):
    def SendTire(self, request, context):
        doc = json.loads(request.json_data)
        col.insert_one(doc)
        return tire_pb2.Empty()
    
server = grpc.server(futures.ThreadPoolExecutor())

tire_pb2_grpc.add_TireServiceServicer_to_server(Service(), server)

server.add_insecure_port("[::]:50051")
server.start()
server.wait_for_termination()