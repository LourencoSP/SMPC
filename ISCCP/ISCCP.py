import paho.mqtt.client as mqtt
import json, os, grpc
import tire_pb2, tire_pb2_grpc

SSACP_HOST = os.environ["SSACP_HOST"]

CHECKPOINT_ID = os.environ["CHECKPOINT_ID"] 


channel = grpc.insecure_channel(SSACP_HOST)
stub = tire_pb2_grpc.TireServiceStub(channel)

def on_message(client, userdata, msg):
    data = msg.payload.decode()
    obj = tire_pb2.TireInfo(car_id = json.loads(data)["car_id"], json_data = data)
    stub.SendTire(obj)
    
    print(f"ISCCP (Checkpoint {CHECKPOINT_ID}) enviado para SSACP", data) 
    
client = mqtt.Client(callback_api_version=mqtt.CallbackAPIVersion.VERSION1)
client.connect("mosquitto", 1883)


topic_to_subscribe = f"tires/checkpoint/{CHECKPOINT_ID}"
client.subscribe(topic_to_subscribe)
print(f"ISCCP for checkpoint {CHECKPOINT_ID} subscribing to {topic_to_subscribe}")


client.on_message = on_message

client.loop_forever()