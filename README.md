Detta projekt är en fullstack webbapplikation utvecklad av mig (Daniel Diaz). Applikationen är byggd med ASP.NET Core Web API 
för backend och React för frontend. Applikationen fungerar som ett bibliotekssystem där användare kan bläddra bland böcker, 
låna och lämna tillbaka dem. Administratören kan i sin tur hantera böcker och användare.

Målet med projektet är att förstå hur Databas, Backend, Frontend, Autentisering och alla delar i en modern applikation hänger ihop.
Teknologierna som används i projektet inkluderar:

### Backend

* ASP.NET Core Web API (.NET 8)
* Entity Framework Core
* SQL Server Express
* JWT-autentisering
* Swagger (Swashbuckle)

### Frontend

* React (Vite)
* Axios
* HTML / CSS / JavaScript


## Arkitektur

Projektet är uppdelat i två huvuddelar:

```bash
LibraryApp
├── backend-LibraryApi   → API (.NET)
└── frontend-LibraryApi  → React-applikation
```

Frontend kommunicerar med backend via REST API.



## Autentisering och roller

Applikationen använder JWT (JSON Web Token) för autentisering.

Det finns två roller:

* **User**

  * Kan se böcker, låna och lämna tillbaka dem
	
* **Admin**

  * Kan skapa, uppdatera och ta bort böcker

Skyddade endpoints använder:

```csharp
[Authorize]
[Authorize(Roles = "Admin")]
```



## Funktionalitet

Som användare kan man: registrera sig, loggar sig ut, låna böcker, lämna tillbaka böcker och se en lista över tillgängliga böcker.
Som admin kan man: registrera sig, skapa, uppdatera och ta bort böcker.

---

## Hur man kör projektet

### Backend (.NET API)

1. Öppna projektet i Visual Studio
2. Konfigurera databasen i `appsettings.json`
3. Kör migrationer:

```powershell
Add-Migration InitialCreate
Update-Database
```

4. Starta projektet
5. Öppna Swagger i webbläsaren:

```
https://localhost:xxxx/swagger
```

---

### Frontend (React)

1. Öppna mappen `frontend-LibraryApi` i Visual Studio Code
2. Installera beroenden:

```bash
npm install
```

3. Starta applikationen:

```bash
npm run dev
```

4. Öppna i webbläsaren:

```
http://localhost:5173
```



## Kommunikation mellan frontend och backend

* Axios används för HTTP-anrop
* JWT-token sparas i localStorage
* Token skickas i headers:

```
Authorization: Bearer {token}
```



## Problem och utmaningar

Jag hade svårt med Konfiguration av Swagger med JWT, problem med OpenAPI-paket, Hantering av mappar och projektstruktur,
konfigurarion av CORS i backend så att det fungerar med frontend och lite annat. 
Det var ett utmaning av alla delar fungerade tillsammans, men det var också en lärorik process där jag fick förståelse för 
hur alla delar hänger ihop och hur man löser problem som uppstår under utvecklingen.


## Möjliga förbättringar

Större lista av böcker med mer detaljerad information, såsom författare, utgivningsår, genre etc.
Implementera en sökfunktion för att hitta böcker baserat på titel eller författare.
Lägga till en användarprofil där användare kan se sina lånade böcker och historik. Bland annat. 


## Reflektion / Lärdomar

Genom detta projekt har jag lärt mig och övat på att bygga ett REST API, hur frontend och backend kommunicerar, 
hur JWT-autentisering fungerar i praktiken samt hur man strukturerar en fullstack-applikation


