import time, json, os, random
import paho.mqtt.client as mqtt

CAR_ID = int(os.environ.get("CAR_ID", "1"))
VEL = 60             
TRACK_LENGTH = 4309  

ISCCP_CHECKPOINTS = [i*(TRACK_LENGTH/15) for i in range(15)]

client = mqtt.Client()
client.connect("mosquitto", 1883)

position = 0.0

def tires_data():
    def one():
        temp = random.randint(70, 120)
        press = round(random.uniform(18.0, 22.0), 2)
        return {"temp": temp, "press": press}
    return {
        "FL": one(), "FR": one(),
        "RL": one(), "RR": one()
    }


while True:
    
    position += VEL
    if position >= TRACK_LENGTH:
        position -= TRACK_LENGTH

   
    for i, p in enumerate(ISCCP_CHECKPOINTS):
        if abs(position - p) < 5:   
            msg = {
                "car_id": CAR_ID,
                "tires": tires_data(),
                "position": position,
                "checkpoint_id": i
            }
            topic_name = f"tires/checkpoint/{i}"
            client.publish(topic_name, json.dumps(msg))
            print(f"car {CAR_ID} evento enviado para checkpoint {i} (tópico {topic_name})")

    time.sleep(1)
