# Quality Department Website (VZAO)

## Internal Development & Database Guidelines

This guide provides instructions on how to connect to the Azure MySQL
database, manage User Secrets, and handle Entity Framework Core
migrations within the Quality Department project.

------------------------------------------------------------------------

## How to Connect to the Azure MySQL Database Using MySQL Workbench

### 1. Install MySQL Workbench

If MySQL Workbench is not installed on your machine:

1.  Download the MySQL Workbench installer.
2.  Run the installer and follow the setup wizard.
3.  Install with default settings.

------------------------------------------------------------------------

### 2. Connect to the Azure Database

1.  Open **MySQL Workbench**.
2.  Click the **"+" (plus icon)** next to **MySQL Connections** to
    create a new connection.
3.  In the **Setup New Connection** window fill in the following fields:

```{=html}
<!-- -->
```
    Connection Name: VZAO-Quality-Db
    Connection Method: Standard (TCP/IP)
    Hostname: vzao-quality-db.mysql.database.azure.com
    Port: 3306
    Username: vzao_dev_team
    Password: Click "Store in Vault..." and enter the password provided to you privately.

4.  Go to the **SSL** tab:

```{=html}
<!-- -->
```
    Use SSL: Require

5.  Click **Test Connection** to verify the settings.\
    If the connection is successful, click **OK**.

------------------------------------------------------------------------

### 3. Database Management Capabilities

After successfully connecting, you can:

-   View and manage tables (entities such as `News`, `Surveys`,
    `Documents`).
-   Execute SQL queries to verify data.
-   Check system tables managed by Microsoft Identity (`AspNetUsers`,
    `AspNetRoles`).
-   Work with the database simultaneously with other team members.

------------------------------------------------------------------------

# Database Setup Guide (User Secrets & Configuration)

To keep database credentials secure, we use **User Secrets** instead of
hardcoding them in `appsettings.json`.

### 1. Move to the API project folder

``` bash
cd QualityDepartment.API
```

### 2. Initialize User Secrets (only once)

``` bash
dotnet user-secrets init
```

### 3. Set the connection string

``` bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=vzao-quality-db.mysql.database.azure.com;Port=3306;Database=VzaoQualityDb;Uid=vzao_dev_team;Pwd=YOUR_PASSWORD;SslMode=Required;"
```

`YOUR_PASSWORD` will be provided to you privately.

### 4. Verify the secret

``` bash
dotnet user-secrets list
```

------------------------------------------------------------------------

# Applying Entity Framework Core Migrations

Always run these commands **from the root directory of the solution**.

### Apply existing migrations to the database

``` bash
dotnet ef database update --project QualityDepartment.Infrastructure --startup-project QualityDepartment.API
```

### Create a new migration (when the model changes)

``` bash
dotnet ef migrations add MigrationName --project QualityDepartment.Infrastructure --startup-project QualityDepartment.API
```

Then apply the migration:

``` bash
dotnet ef database update --project QualityDepartment.Infrastructure --startup-project QualityDepartment.API
```

------------------------------------------------------------------------

# Handling Migration Conflicts

## 1. Migration exists locally but not in the database

Run:

``` bash
dotnet ef database update --project QualityDepartment.Infrastructure --startup-project QualityDepartment.API
```

------------------------------------------------------------------------

## 2. Migration applied in database but missing locally

Update your local repository:

``` bash
git pull
```

Then run:

``` bash
dotnet ef database update --project QualityDepartment.Infrastructure --startup-project QualityDepartment.API
```

------------------------------------------------------------------------

## 3. Conflicting migrations created by different developers

Pull the latest changes:

``` bash
git pull
```

Remove your local migration (if it has not been applied yet):

``` bash
dotnet ef migrations remove --project QualityDepartment.Infrastructure --startup-project QualityDepartment.API
```

Recreate the migration after updating the model:

``` bash
dotnet ef migrations add NewMigrationName --project QualityDepartment.Infrastructure --startup-project QualityDepartment.API
```

------------------------------------------------------------------------

# Resetting the Database

⚠️ **Do this only after team approval. This will delete all data.**

``` bash
dotnet ef database drop --project QualityDepartment.Infrastructure --startup-project QualityDepartment.API
dotnet ef database update --project QualityDepartment.Infrastructure --startup-project QualityDepartment.API
```
