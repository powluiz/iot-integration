#include <ArduinoJson.h>
#include <DHT.h>
#include <PubSubClient.h>
#include <WiFi.h>

// ==========================================
//                 CONFIGS
// ==========================================
namespace Config {
// Rede
const char* WIFI_SSID = "";
const char* WIFI_PASS = "";

// MQTT
// broker público - utilizado para fins de demonstração
const char* MQTT_BROKER = "broker.hivemq.com";
const int MQTT_PORT = 1883;
const char* DEVICE_ID = "esp32-edge-01";

// Tópicos
const char* TOPIC_STATUS = "pos/iot/luz/status";  // Feedback do relé
const char* TOPIC_COMMAND = "pos/iot/luz/cmd";    // Comandos recebidos
const char* TOPIC_SENSOR = "pos/iot/sensor/dht";  // Telemetria (Novo)

// Pinagem da ESP32
constexpr uint8_t PIN_RELAY = 4;  // GPIO do relé
constexpr uint8_t PIN_DHT = 32;   // GPIO do sensor

// Sensor
constexpr uint8_t DHT_TYPE = DHT11;
constexpr long SENSOR_INTERVAL = 5000;  // Leitura a cada 5s
}  // namespace Config

class RelayService {
   private:
    uint8_t relayPin;
    bool isOn;

   public:
    RelayService(uint8_t rPin) : relayPin(rPin), isOn(false) {}

    void begin() {
        pinMode(relayPin, OUTPUT);
        digitalWrite(relayPin, HIGH);
    }

    void turnOn() {
        digitalWrite(relayPin, LOW);
        isOn = true;
    }

    void turnOff() {
        digitalWrite(relayPin, HIGH);
        isOn = false;
    }

    bool getState() { return isOn; }
};

class SensorService {
   private:
    DHT dht;
    unsigned long lastReadTime;
    const long interval;

   public:
    SensorService(uint8_t pin, uint8_t type, long readInterval)
        : dht(pin, type), interval(readInterval), lastReadTime(0) {}

    void begin() { dht.begin(); }

    bool readData(float& temp, float& hum) {
        if (millis() - lastReadTime < interval) return false;

        lastReadTime = millis();
        float t = dht.readTemperature();
        float h = dht.readHumidity();

        if (isnan(t) || isnan(h)) {
            Serial.println("[Sensor] Falha na leitura do DHT!");
            return false;
        }

        temp = t;
        hum = h;
        return true;
    }
};

WiFiClient espClient;
PubSubClient client(espClient);

RelayService relayService(Config::PIN_RELAY);
SensorService sensorService(Config::PIN_DHT, Config::DHT_TYPE,
                            Config::SENSOR_INTERVAL);

// ==========================================
//                 Utils
// ==========================================

void publishTelemetry(float temp, float hum) {
    StaticJsonDocument<256> doc;
    doc["deviceId"] = Config::DEVICE_ID;
    doc["type"] = "environment";
    doc["temp"] = temp;
    doc["hum"] = hum;
    doc["uptime"] = millis() / 1000;

    char buffer[256];
    serializeJson(doc, buffer);

    client.publish(Config::TOPIC_SENSOR, buffer);
    Serial.println("[MQTT] Telemetria enviada: " + String(buffer));
}

void publishState() {
    StaticJsonDocument<128> doc;
    doc["deviceId"] = Config::DEVICE_ID;
    doc["power"] = relayService.getState() ? "ON" : "OFF";

    char buffer[128];
    serializeJson(doc, buffer);
    client.publish(Config::TOPIC_STATUS, buffer, true);
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
    Serial.printf("[MQTT] Mensagem em %s\n", topic);

    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, payload, length);

    if (error) {
        Serial.print(F("[JSON] Falha no parse: "));
        Serial.println(error.f_str());
        return;
    }

    if (doc.containsKey("action")) {
        const char* action = doc["action"];

        if (strcmp(action, "ON") == 0) {
            relayService.turnOn();
        } else if (strcmp(action, "OFF") == 0) {
            relayService.turnOff();
        }
        publishState();
    }
}

void connectToWiFi() {
    Serial.print("[WiFi] Conectando a ");
    Serial.println(Config::WIFI_SSID);

    WiFi.begin(Config::WIFI_SSID, Config::WIFI_PASS);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\n[WiFi] Conectado. IP: " + WiFi.localIP().toString());
}

void connectToMQTT() {
    while (!client.connected()) {
        Serial.print("[MQTT] Tentando conexão... ");
        String clientId = Config::DEVICE_ID;

        if (client.connect(clientId.c_str())) {
            Serial.println("Conectado.");
            client.subscribe(Config::TOPIC_COMMAND);
        } else {
            Serial.print("Falha, rc=");
            Serial.print(client.state());
            Serial.println(" (Tentando em 5s)");
            delay(5000);
        }
    }
}

// ==========================================
//                    MAIN
// ==========================================

void setup() {
    Serial.begin(115200);

    relayService.begin();
    sensorService.begin();

    connectToWiFi();
    client.setServer(Config::MQTT_BROKER, Config::MQTT_PORT);
    client.setCallback(mqttCallback);
}

void loop() {
    if (!client.connected()) {
        connectToMQTT();
    }
    client.loop();

    float temp, hum;
    if (sensorService.readData(temp, hum)) {
        publishTelemetry(temp, hum);
    }
}