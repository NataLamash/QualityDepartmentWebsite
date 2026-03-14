# Project Structure

The Quality Department Website solution follows a multi-layered architecture to separate concerns and ensure maintainability.

## Solution Layers

### 1. QualityDepartment.API
This is the entry point of the application. It handles external communication and hosts the Swagger documentation.
* **Controllers**: Define API endpoints for News, Archive, and Feedback.
* **Configuration**: Contains `Program.cs` and `launchSettings.json` for environment setup.
* **Middleware**: Custom logic for handling requests/responses (e.g., Swagger setup).

### 2. QualityDepartment.Core
The heart of the system, containing business logic definitions and data models. It has no dependencies on other projects.
* **Entities**: Database models based on the system schema, including `News`, `Document`, `Feedback_Message`, and `Survey`.
* **DTOs**: Data Transfer Objects used to pass data between the API and Services.
* **Enums**: Specific domain types such as `QuestionType` and `FeedbackStatus`.
* **Interfaces**: Definitions for services and repositories that will be implemented in the Infrastructure layer.

### 3. QualityDepartment.Infrastructure
Handles data persistence and integration with external systems.
* **Data**: Contains the `ApplicationDbContext` and Identity configuration for roles (Admin/Superadmin).
* **Repositories/Services**: Concrete implementations of the interfaces defined in the Core project.
* **Migrations**: Entity Framework Core files that manage the database schema versioning.