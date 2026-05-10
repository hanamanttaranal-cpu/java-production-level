# Use a lightweight JRE for the final image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Install netcat (useful for checking if MySQL is ready)
RUN apk add --no-cache netcat-openbsd

# Copy the JAR already built by Jenkins in the 'Build' stage
# The wildcard handles the versioning (ecommerce-backend-1.0.0.jar)
COPY target/*.jar app.jar

EXPOSE 8082

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
