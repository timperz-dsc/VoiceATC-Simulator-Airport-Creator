# Flight Route Manager

En React-baserad webapp för att hantera flygrutter, inspirerad av GRD Aeronavs "Manage Routes". Applikationen är byggd med Tailwind CSS och shadcn/ui för en modern och clean design.

## Funktioner

### Grundläggande funktionalitet
- **Input-sektion** med fält för:
  - Airlines (textfält)
  - Popularity (nummerfält)
  - Route (textfält)
  - ACFT (textfält, t.ex. A320, B738)
  - Wake (dropdown: L/M/H/J)
  - FL Bottom (nummerfält, t.ex. F100)
  - FL Top (nummerfält, t.ex. F430)
  - Status (dropdown: Validated/Draft)

- **Tabell-layout** som visar alla sparade rutter med:
  - Sortering på alla kolumner (klick på kolumnnamn)
  - Delete-knapp för varje rad
  - Status-taggar (Validated/Draft)
  - Wake-kategori taggar

### Extra funktioner
- **Responsiv design** som fungerar på både desktop och mobil
- **Sökfunktion** för att filtrera på Airlines, Route eller Aircraft
- **localStorage** för att spara data lokalt
- **Modern UI** med Tailwind CSS och shadcn/ui komponenter

## Teknisk stack

- **React 18** med TypeScript
- **Tailwind CSS** för styling
- **shadcn/ui** för UI-komponenter
- **Radix UI** för tillgängliga komponenter
- **Lucide React** för ikoner

## Installation och körning

1. Installera dependencies:
```bash
npm install
```

2. Starta utvecklingsservern:
```bash
npm start
```

3. Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare

## Projektstruktur

```
src/
├── components/
│   ├── ui/           # shadcn/ui komponenter
│   └── RouteManager.tsx  # Huvudkomponent
├── hooks/
│   └── useLocalStorage.ts # Custom hook för localStorage
├── types/
│   └── route.ts      # TypeScript-typer
├── lib/
│   └── utils.ts      # Utility-funktioner
└── App.tsx           # Root-komponent
```

## Användning

1. **Lägg till en ny rutt**: Fyll i fälten i input-sektionen och klicka "Add Route"
2. **Sök**: Använd sökfältet för att filtrera rutter
3. **Sortera**: Klicka på kolumnnamn för att sortera
4. **Ta bort**: Klicka på delete-knappen för att ta bort en rutt
5. **Status**: Rutter sparas automatiskt i localStorage

## Design-inspiration

Applikationen är inspirerad av GRD Aeronavs "Manage Routes" med en grid/tabell-layout som gör det enkelt att hantera och organisera flygrutter.
