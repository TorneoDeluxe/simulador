// src/data/hardcodedCountries.ts

export interface HardcodedTeam {
  name: string;
  media: number;
}

export interface HardcodedLeague {
  id: number;
  nombre: string;
  pais: string;
  categoria: number;
  teams: HardcodedTeam[];
}

export interface HardcodedCountry {
  name: string;
  leagues: HardcodedLeague[];
}

export const HARDCODED_COUNTRIES: HardcodedCountry[] = [
  {
    name: "Torneo Deluxe",
    leagues: [
      {
        id: 1,
        nombre: "Primera División",
        pais: "Torneo Deluxe",
        categoria: 1,
        teams: [
          { name: "Knights of Plate", media: 85 },
          { name: "MHDP", media: 80 },
          { name: "FC Chavista Machado", media: 79 },
          { name: "Concavito FC", media: 74 },
          { name: "Magnum", media: 73 },
          { name: "Fofisanos Artemis", media: 72 },
          { name: "Atlético Nulty", media: 71 },
          { name: "Los Langostos", media: 70 },
          { name: "Manchala FC", media: 70 },
          { name: "Sapos FC", media: 70 },
          { name: "GetaFFe", media: 68 },
          { name: "Las Lobas", media: 67 },
          { name: "Allahu Akbar", media: 65 },
          { name: "Weiss", media: 65 },
          { name: "Powers", media: 62 },
          { name: "Segarro Balompie", media: 59 },
          { name: "Patetico de Mandril", media: 55 },
          { name: "Payo Chabacano", media: 52 }
        ],
      },
    ],
  },
];
