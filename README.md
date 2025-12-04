# SMPC - Car Tire Monitoring System

**SMPC** stands for **S**istema de **M**onitoramento de **P**neus de **C**arros (Car Tire Monitoring System). In English, this is often referred to as a **CTMS** or **TPMS** (Tire Pressure Monitoring System).

This distributed system project simulates and monitors real-time tire telemetry (temperature and pressure) for Formula 1 cars during a Grand Prix race.

## 🏎️ Project Overview

The simulation involves 24 F1 cars racing around the Interlagos circuit. As they traverse the track, they pass through 15 distinct geographic checkpoints. At each checkpoint, the cars emit telemetry data which is collected, processed, persisted, and finally exposed for visualization through a microservices architecture.

The project is designed to demonstrate the practical integration of three distinct communication patterns in distributed systems:
* **Event-Based**: Vehicle to Infrastructure communication using **MQTT**.
* **Object-Based (RPC)**: Infrastructure to Storage communication using **gRPC**.
* **Resource-Based (REST)**: Visualization Server to Client Dashboard using **HTTP/JSON**.

## 🏗️ Architecture

The solution is fully containerized using **Docker** and orchestrated with **Docker Compose**, comprising the following subsystems:

1.  **SCCP (Collection Subsystem)**
    * **Cars**: Python clients simulating vehicle movement on the track. They generate random sensor data for tire pressure and temperature and publish events via **MQTT** to topics corresponding to their current track sector.
    * **ISCCP (Infrastructure Checkpoints)**: 15 microservices acting as trackside checkpoints. Each subscribes to a specific MQTT topic, receives the telemetry, and forwards it as an object via **gRPC**.

2.  **SACP (Storage Subsystem)**
    * **SSACP (Storage Servers)**: 3 gRPC servers that receive data objects from the ISCCP units and persist them into a distributed database.
    * **Database**: A **MongoDB Replica Set** (3 nodes) ensures data persistence, redundancy, and high availability.

3.  **SVCP (Visualization Subsystem)**
    * **SSVCP**: A **FastAPI** REST service that connects to the database cluster and exposes the aggregated telemetry data via an HTTP endpoint (`/data`) for consumption by external dashboards.

## 🚀 Tech Stack

* **Language**: Python 3.10
* **Messaging**: Eclipse Mosquitto (MQTT)
* **RPC Framework**: gRPC & Protocol Buffers
* **Database**: MongoDB (Replica Set configuration)
* **API Framework**: FastAPI & Uvicorn
* **Infrastructure**: Docker & Docker Compose

## 🛠️ How to Run

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Start the environment:**
    This command builds the images and starts all 47 containers (Cars, Checkpoints, Servers, and Database nodes).
    ```bash
    docker-compose up --build
    ```

3.  **Initialize the Database (First Run Only):**
    Once the containers are running, you must initialize the MongoDB Replica Set. Open a new terminal and run:
    ```bash
    docker-compose exec mongo1 mongosh --eval 'rs.initiate({_id: "rs0", members: [{_id: 0, host: "mongo1:27017"}, {_id: 1, host: "mongo2:27017"}, {_id: 2, host: "mongo3:27017"}]})'
    ```
    *Wait for the command to return `{"ok": 1}`.*

4.  **Access the Data:**
    * Wait a few seconds for the cars to complete a sector and publish data.
    * Open your browser or API client at `http://localhost:8000/data` to view the real-time JSON stream of tire telemetry.
