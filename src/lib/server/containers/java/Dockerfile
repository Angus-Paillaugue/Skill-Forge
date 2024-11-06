FROM openjdk:17-slim

# Install wget and the JDK to get javac
RUN apt-get update && apt-get install -y wget openjdk-17-jdk

# Download the Gson library
RUN wget https://repo1.maven.org/maven2/com/google/code/gson/gson/2.8.8/gson-2.8.8.jar -P /usr/local/lib

# Set the classpath to include the Gson library
ENV CLASSPATH /usr/local/lib/gson-2.8.8.jar

WORKDIR /app
