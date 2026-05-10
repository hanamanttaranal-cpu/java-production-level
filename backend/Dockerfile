FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline



COPY src ./src

RUN mvn clean package -DskipTests



# ================= RUN IMAGE =================

FROM eclipse-temurin:17-jre-alpine



WORKDIR /app



# Install netcat (for DB check)

RUN apk add --no-cache netcat-openbsd



COPY --from=build /app/target/*.jar app.jar



EXPOSE 8082



# Wait for MySQL before starting app

CMD java -jar app.jar
