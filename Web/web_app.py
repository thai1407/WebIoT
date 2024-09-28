# from flask import Flask, render_template
# from flask import url_for, request, redirect
# from flask import jsonify
# from flask import make_response
# import random
# import ssl
# import paho.mqtt.client as paho
# import paho.mqtt.subscribe as subscribe
# from paho import mqtt
# import json
# import threading
#
#
# app = Flask(__name__)
#
# # Global variable to hold sensor values
# sensor_values = {
#     "air-humidity": 0,
#     "dirt-humidity": 0,
#     "air-temperature": 0
# }
#
#
# # callback to print a message once it arrives
# def print_msg(client, userdata, message):
#     """
#         Prints a mqtt message to stdout ( used as callback for subscribe )
#
#         :param client: the client itself
#         :param userdata: userdata is set when initiating the client, here it is userdata=None
#         :param message: the message with topic and payload
#     """
#     air, dirt, temp = message.payload.decode('utf-8').strip().split('-')
#     sensor_values['air-humidity'] = air
#     sensor_values['dirt-humidity'] = dirt
#     sensor_values['air-temperature'] = temp
#     # print("%s : %s" % (message.topic, message.payload))
#
#
# # Function to run the MQTT client
# def run_mqtt_client():
#     # Use TLS for secure connection with HiveMQ Cloud
#     sslSettings = ssl.SSLContext(mqtt.client.ssl.PROTOCOL_TLS)
#
#     # Put in your cluster credentials and hostname
#     auth = {'username': "Johnny", 'password': "Thanhtai2907"}
#
#     # Subscribe to all topics
#     subscribe.callback(print_msg,
#                        "#",
#                        hostname="3c7b0751f151453d800143f3e1c5b8a6.s1.eu.hivemq.cloud",
#                        port=8883,
#                        auth=auth,
#                        tls=sslSettings, protocol=paho.MQTTv31)
#
#
# # Create a new thread for the MQTT client
# mqtt_thread = threading.Thread(target=run_mqtt_client)
# # Start the thread
# mqtt_thread.start()
#
#
# @app.route("/")
# @app.route("/home")
# def home():
#     return render_template('index.html', air_humidity="0%", temperature="0 degree", dirt_humidity="0%")
#
#
# @app.route("/get_values", methods=["GET"])
# def get_values():
#     sensor_id = request.args.get('sensorId')
#
#     value = sensor_values.get(sensor_id, 0)
#
#     return jsonify(value=value)
#
#
# if __name__ == "__main__":
#     app.run(debug=True)


from flask import Flask, render_template
from flask import url_for, request, redirect
from flask import jsonify
from flask import make_response
import random
import ssl
import paho.mqtt.client as paho
import paho.mqtt.subscribe as subscribe
from paho import mqtt
import json
import threading


app = Flask(__name__)

# Global variable to hold sensor values
sensor_values = {
    "air-humidity": 0,
    "dirt-humidity": 0,
    "air-temperature": 0
}


# callback to print a message once it arrives
def print_msg(client, userdata, message):
    """
        Prints a mqtt message to stdout ( used as callback for subscribe )

        :param client: the client itself
        :param userdata: userdata is set when initiating the client, here it is userdata=None
        :param message: the message with topic and payload
    """
    # air, dirt, temp = message.payload.decode('utf-8').strip().split('-')
    if 'dirt' in message.payload.decode('utf-8').strip():
        dirt = message.payload.decode('utf-8').strip().replace('dirt', "")
        air, temp = 0, 0
    else:
        air, temp = message.payload.decode('utf-8').strip().replace('air', "").split('-')
        # air, temp = 0, 0
        # dirt = message.payload.decode('utf-8').strip().replace('dirt', "")

    sensor_values['air-humidity'] = air
    sensor_values['dirt-humidity'] = dirt
    sensor_values['air-temperature'] = temp
    # print("%s : %s" % (message.topic, message.payload))


# Function to run the MQTT client
def run_mqtt_client():
    # Use TLS for secure connection with HiveMQ Cloud
    sslSettings = ssl.SSLContext(mqtt.client.ssl.PROTOCOL_TLS)

    # Put in your cluster credentials and hostname
    auth = {'username': "Johnny", 'password': "Thanhtai2907"}

    # Subscribe to all topics
    subscribe.callback(print_msg,
                       "#",
                       hostname="3c7b0751f151453d800143f3e1c5b8a6.s1.eu.hivemq.cloud",
                       port=8883,
                       auth=auth,
                       tls=sslSettings, protocol=paho.MQTTv31)


# Create a new thread for the MQTT client
mqtt_thread = threading.Thread(target=run_mqtt_client)
# Start the thread
mqtt_thread.start()


@app.route("/")
@app.route("/home")
def home():
    return render_template('index.html', air_humidity="0%", temperature="0 degree", dirt_humidity="0%")


@app.route("/get_values", methods=["GET"])
def get_values():
    sensor_id = request.args.get('sensorId')

    value = sensor_values.get(sensor_id, 0)
    return jsonify(value=value)


if __name__ == "__main__":
    app.run(debug=True)
