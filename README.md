This project aims to develop a scalable, cloud-integrated full-stack web application for comprehensive IoT device management. The application will provide real-time monitoring, reporting, firmware management, and access control for thousands of IoT devices, including automated, verified onboarding and Over-The-Air (OTA) update capabilities

The project is structured into two main folders: iot-backend and iot-dashboard

It also includes two additional folders, IoT_Architectures and IoT_WorkFlows, which contain multiple architecture and workflow implementations using Azure Cloud, Azure IoT Edge, AWS Cloud, and AWS IoT Greengrass.

iot-backend : The iot-backend folder contains scripts responsible for data management. It retrieves data from a MongoDB database and simulates real-time data streams (e.g., for 1000 devices) to the front-end application. 

iot-dashboard: The iot-dashboard folder contains scripts for the front-end application, which fetches and visualizes data from the iot-backend on a local host.

The server.js script provides static device-specific metadata, including Device ID, current firmware version, geographic location, and last active timestamp.

The simulator.js script either simulates or retrieves real-time device metrics, such as CPU usage, memory, battery, and connectivity status, updated every few seconds.

The API can be tested by running it on localhost, or the data can be visualized by executing App.js in the iot-dashboard folder.

Over-The-Air (OTA) update functionality and Role-Based Access Control (RBAC) have been implemented within the iot-backend scripts. Their functionalities can be visualized by running App.js in the iot-dashboard folder on a local host.
