// src/components/SelectorEquipos/SelectorEquipos.tsx
import React, { useEffect, useState } from "react";
import "./SelectorEquipos.css";

interface Team {
  name: string;
  logo: string;
  media: number;
}

interface League {
  id: number;
  nombre: string;
  pais: string;
  categoria: number;
  teams?: Team[];
}

interface Country {
  name: string;
  leagues: League[];
}

type Props = {
  onSelectedTeam: (team: Team) => void;
};

const SelectorEquipos: React.FC<Props> = ({ onSelectedTeam }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(2);
  const [selectedLeagueIndex, setSelectedLeagueIndex] = useState(0);

  const selectedCountry = countries[selectedCountryIndex];
  const selectedLeague = selectedCountry?.leagues[selectedLeagueIndex];

  const generateLogoPath = (name: string, format: "png" | "webp" = "png") => {
    const basePath = "src/assets/Escudos";
    const fileName = name.replace(/\s+/g, "_").replace(/[()]/g, "");

    if (format === "webp") {
      return `${basePath}/${fileName}.webp`;
    } else {
      return `${basePath}/${fileName}.png`;
    }
  };

  const hardcodedCountries: Country[] = [
  {
    name: "Argentina",
    leagues: [
      {
        id: 1,
        nombre: "Primera División",
        pais: "Argentina",
        categoria: 1,
        teams: [
          { name: "River Plate", logo: generateLogoPath("River Plate"), media: 85 },
          { name: "Boca Juniors", logo: generateLogoPath("Boca Juniors"), media: 84 },
          { name: "Racing Club", logo: generateLogoPath("Racing_Club"), media: 82 },
          { name: "Independiente", logo: generateLogoPath("Independiente"), media: 81 },
          { name: "San Lorenzo", logo: generateLogoPath("San Lorenzo"), media: 82 },
          { name: "Vélez Sarsfield", logo: generateLogoPath("Vélez Sarsfield"), media: 80 },
          { name: "Gimnasia LP", logo: generateLogoPath("Gimnasia LP"), media: 78 },
          { name: "Estudiantes LP", logo: generateLogoPath("Estudiantes LP"), media: 77 },
          { name: "Rosario Central", logo: generateLogoPath("Rosario Central"), media: 79 },
          { name: "Newell's", logo: generateLogoPath("Newell's"), media: 77 },
          { name: "Huracán", logo: generateLogoPath("Huracán"), media: 76 },
          { name: "Belgrano", logo: generateLogoPath("Belgrano"), media: 75 },
          { name: "Talleres", logo: generateLogoPath("Talleres_C"), media: 76 },
          { name: "Argentinos Juniors", logo: generateLogoPath("Argentinos_Juniors"), media: 75 },
          { name: "Banfield", logo: generateLogoPath("Banfield"), media: 74 },
          { name: "Lanús", logo: generateLogoPath("Lanús"), media: 75 },
          { name: "Unión", logo: generateLogoPath("Unión"), media: 74 },
          { name: "Colón", logo: generateLogoPath("Colón"), media: 75 },
          { name: "Platense", logo: generateLogoPath("Platense"), media: 73 },
          { name: "Godoy Cruz", logo: generateLogoPath("Godoy Cruz"), media: 72 },
        ],
      },
      {
        id: 2,
        nombre: "Primera Nacional",
        pais: "Argentina",
        categoria: 2,
        teams: [
          { name: "Ferro", logo: generateLogoPath("Ferro"), media: 70 },
          { name: "Atlanta", logo: generateLogoPath("Atlanta"), media: 69 },
          { name: "Chacarita", logo: generateLogoPath("Chacarita"), media: 72 },
          { name: "Gimnasia (Jujuy)", logo: generateLogoPath("Gimnasia_de_Jujuy"), media: 71 },
          { name: "Nueva Chicago", logo: generateLogoPath("Nueva Chicago"), media: 71 },
          { name: "Defensa y Justicia", logo: generateLogoPath("Defensa y Justicia"), media: 70 },
          { name: "San Martín (T)", logo: generateLogoPath("San Martín (T)"), media: 70 },
          { name: "San Martín (SJ)", logo: generateLogoPath("San Martín (SJ)"), media: 70 },
          { name: "Aldosivi", logo: generateLogoPath("Aldosivi"), media: 69 },
          { name: "Tigre", logo: generateLogoPath("Tigre"), media: 70 },
          { name: "Ind. Rivadavia", logo: generateLogoPath("Independiente_Rivadavia"), media: 70 },
          { name: "Quilmes", logo: generateLogoPath("Quilmes"), media: 72 },
          { name: "Sarmiento", logo: generateLogoPath("Sarmiento_J"), media: 69 },
          { name: "Instituto", logo: generateLogoPath("Instituto"), media: 71 },
          { name: "Atlético Tucumán", logo: generateLogoPath("Atlético Tucumán"), media: 71 },
          { name: "Olimpo", logo: generateLogoPath("Olimpo"), media: 72 },
          { name: "Patronato", logo: generateLogoPath("Patronato"), media: 68 },
          { name: "Arsenal de Sarandí", logo: generateLogoPath("Arsenal de Sarandí"), media: 72 },
          { name: "Deportivo Morón", logo: generateLogoPath("Deportivo Morón"), media: 68 },
          { name: "Atlético de Rafaela", logo: generateLogoPath("Atlético de Rafaela"), media: 71 },
        ],
      },
      {
        id: 3,
        nombre: "Primera B Metropolitana",
        pais: "Argentina",
        categoria: 3,
        teams: [
          { name: "Flandria", logo: generateLogoPath("Flandria"), media: 65 },
          { name: "Colegiales", logo: generateLogoPath("Colegiales"), media: 65 },
          { name: "Comunicaciones", logo: generateLogoPath("Comunicaciones"), media: 66 },
          { name: "Dep. Armenio", logo: generateLogoPath("Dep_Armenio"), media: 64 },
          { name: "Deportivo Español", logo: generateLogoPath("Deportivo Español"), media: 66 },
          { name: "Tristán Suárez", logo: generateLogoPath("Tristan_Suarez"), media: 66 },
          { name: "San Telmo", logo: generateLogoPath("San_Telmo"), media: 65 },
          { name: "Brown de Adrogué", logo: generateLogoPath("Brown_Adrogue"), media: 65 },
          { name: "Midland", logo: generateLogoPath("Midland"), media: 64 },
          { name: "Villa San Carlos", logo: generateLogoPath("Villa San Carlos"), media: 64 },
          { name: "Cambaceres", logo: generateLogoPath("Cambaceres"), media: 64 },
          { name: "Acassuso", logo: generateLogoPath("Acassuso"), media: 64 },
          { name: "Laferrere", logo: generateLogoPath("Laferrere"), media: 65 },
          { name: "Sportivo Italiano", logo: generateLogoPath("Sportivo Italiano"), media: 65 },
          { name: "Sacachispas", logo: generateLogoPath("Sacachispas"), media: 65 },
          { name: "Def. de Belgrano", logo: generateLogoPath("Defensores_Belgrano"), media: 67 },
          { name: "Almirante Brown", logo: generateLogoPath("Almirante Brown"), media: 67 },
          { name: "Talleres (RdE)", logo: generateLogoPath("Talleres (RdE)"), media: 65 },
          { name: "Temperley", logo: generateLogoPath("Temperley"), media: 68 },
          { name: "All Boys", logo: generateLogoPath("All Boys"), media: 68 },
        ],
      },
    ],
  },
  {
    name: "Argentina 2000/2001",
    leagues: [
      {
        id: 4,
        nombre: "Primera División",
        pais: "Argentina 2000/2001",
        categoria: 1,
        teams: [
          { name: "River Plate", logo: generateLogoPath("River Plate"), media: 83 },
          { name: "Boca Juniors", logo: generateLogoPath("Boca Juniors"), media: 83 },
          { name: "Racing Club", logo: generateLogoPath("Racing Club"), media: 83 },
          { name: "Independiente", logo: generateLogoPath("Independiente"), media: 81 },
          { name: "San Lorenzo", logo: generateLogoPath("San Lorenzo"), media: 82 },
          { name: "Vélez Sarsfield", logo: generateLogoPath("Vélez Sarsfield"), media: 78 },
          { name: "Gimnasia LP", logo: generateLogoPath("Gimnasia LP"), media: 77 },
          { name: "Estudiantes LP", logo: generateLogoPath("Estudiantes LP"), media: 75 },
          { name: "Rosario Central", logo: generateLogoPath("Rosario Central"), media: 78 },
          { name: "Newell's", logo: generateLogoPath("Newell's"), media: 76 },
          { name: "Huracán", logo: generateLogoPath("Huracán"), media: 75 },
          { name: "Belgrano", logo: generateLogoPath("Belgrano"), media: 70 },
          { name: "Talleres", logo: generateLogoPath("Talleres_C"), media: 77 },
          { name: "Argentinos Juniors", logo: generateLogoPath("Argentinos Juniors"), media: 74 },
          { name: "Almagro", logo: generateLogoPath("Almagro"), media: 72 },
          { name: "Lanús", logo: generateLogoPath("Lanús"), media: 71 },
          { name: "Los Andes", logo: generateLogoPath("Los Andes"), media: 66 },
          { name: "Unión", logo: generateLogoPath("Unión"), media: 69 },
          { name: "Colón", logo: generateLogoPath("Colón"), media: 75 },
          { name: "Chacarita", logo: generateLogoPath("Chacarita"), media: 68 },
        ],
      },
      {
        id: 5,
        nombre: "Primera B Nacional",
        pais: "Argentina 2000/2001",
        categoria: 2,
        teams: [
          { name: "All Boys", logo: generateLogoPath("All Boys"), media: 68 },
          { name: "Arsenal de Sarandí", logo: generateLogoPath("Arsenal de Sarandí"), media: 72 },
          { name: "Banfield", logo: generateLogoPath("Banfield"), media: 74 },
          { name: "Central Córdoba (R)", logo: generateLogoPath("Central_Cordoba_R"), media: 66 },
          { name: "Defensa y Justicia", logo: generateLogoPath("Defensa y Justicia"), media: 70 },
          { name: "El Porvenir", logo: generateLogoPath("El_Porvenir"), media: 67 },
          { name: "Estudiantes (BA)", logo: generateLogoPath("Estudiantes (BA)"), media: 68 },
          { name: "Ferro", logo: generateLogoPath("Ferro"), media: 70 },
          { name: "Nueva Chicago", logo: generateLogoPath("Nueva Chicago"), media: 71 },
          { name: "Platense", logo: generateLogoPath("Platense"), media: 73 },
          { name: "Quilmes", logo: generateLogoPath("Quilmes"), media: 72 },
          { name: "San Miguel", logo: generateLogoPath("San_Miguel"), media: 66 },
          { name: "Tigre", logo: generateLogoPath("Tigre"), media: 70 },
          { name: "Almirante Brown", logo: generateLogoPath("Almirante_Brown"), media: 67 },
          { name: "Atlético de Rafaela", logo: generateLogoPath("Atlético_de_Rafaela"), media: 71 },
          { name: "Atlético Tucumán", logo: generateLogoPath("Atlético Tucumán"), media: 71 },
          { name: "Cipolletti", logo: generateLogoPath("Cipolletti"), media: 65 },
          { name: "General Paz Juniors", logo: generateLogoPath("General_Paz_Juniors"), media: 65 },
          { name: "Gimnasia (CdU)", logo: generateLogoPath("Gimnasia (CdU)"), media: 65 },
          { name: "Gimnasia (Jujuy)", logo: generateLogoPath("Gimnasia_de_Jujuy"), media: 71 },
          { name: "Godoy Cruz", logo: generateLogoPath("Godoy Cruz"), media: 72 },
          { name: "Ind. Rivadavia", logo: generateLogoPath("Independiente_Rivadavia"), media: 70 },
          { name: "Instituto", logo: generateLogoPath("Instituto"), media: 71 },
          { name: "Juventud Antoniana", logo: generateLogoPath("Juventud_Antoniana"), media: 68 },
          { name: "Olimpo", logo: generateLogoPath("Olimpo"), media: 72 },
          { name: "Racing (Cba)", logo: generateLogoPath("Racing (Cba)"), media: 68 },
          { name: "San Martín (Mza)", logo: generateLogoPath("San Martin_Mza"), media: 68 },
          { name: "San Martín (SJ)", logo: generateLogoPath("San Martín (SJ)"), media: 70 },
          { name: "San Martín (T)", logo: generateLogoPath("San Martín (T)"), media: 70 },
          { name: "Villa Mitre", logo: generateLogoPath("Villa Mitre"), media: 67 },
        ],
      },
    ],
  },
  {
    name: "Brasil",
    leagues: [
      {
        id: 6,
        nombre: "Brasileirão",
        pais: "Brasil",
        categoria: 1,
        teams: [
          { name: "Flamengo", logo: generateLogoPath("Flamengo"), media: 84 },
          { name: "Palmeiras", logo: generateLogoPath("Palmeiras", "webp"), media: 84 },
          { name: "Sao Paulo", logo: generateLogoPath("Sao Paulo"), media: 82 },
          { name: "Corinthians", logo: generateLogoPath("Corinthians", "webp"), media: 82 },
          { name: "Santos", logo: generateLogoPath("Santos", "webp"), media: 81 },
          { name: "Fluminense", logo: generateLogoPath("Fluminense", "webp"), media: 81 },
          { name: "Botafogo", logo: generateLogoPath("Botafogo"), media: 80 },
          { name: "Atlético Mineiro", logo: generateLogoPath("Atlético Mineiro"), media: 83 },
          { name: "Cruzeiro", logo: generateLogoPath("Cruzeiro"), media: 80 },
          { name: "Athl. Paranaense", logo: generateLogoPath("Athl. Paranaense"), media: 80 },
          { name: "Bahia", logo: generateLogoPath("Bahia"), media: 75 },
          { name: "RB Bragantino", logo: generateLogoPath("RB_Bragantino"), media: 76 },
          { name: "Ceará", logo: generateLogoPath("Ceará", "webp"), media: 74 },
          { name: "Vasco da Gama", logo: generateLogoPath("Vasco_da_Gama", "webp"), media: 76 },
          { name: "Internacional", logo: generateLogoPath("Internacional", "webp"), media: 82 },
          { name: "Gremio", logo: generateLogoPath("Gremio"), media: 81 },
          { name: "Fortaleza", logo: generateLogoPath("Fortaleza"), media: 77 },
          { name: "Sport Recife", logo: generateLogoPath("Sport_Recife", "webp"), media: 74 },
          { name: "Goias", logo: generateLogoPath("Goias", "webp"), media: 73 },
          { name: "Chapecoense", logo: generateLogoPath("Chapecoense"), media: 72 },
        ],
      },
    ],
  },
  {
    name: "España",
    leagues: [
      {
        id: 7,
        nombre: "LaLiga",
        pais: "España",
        categoria: 1,
        teams: [
          { name: "Barcelona", logo: generateLogoPath("Barcelona"), media: 85 },
          { name: "Real Madrid", logo: generateLogoPath("Real Madrid"), media: 85 },
          { name: "Atlético Madrid", logo: generateLogoPath("Atlético Madrid"), media: 84 },
          { name: "Villarreal", logo: generateLogoPath("Villarreal"), media: 80 },
          { name: "Sevilla", logo: generateLogoPath("Sevilla"), media: 80 },
          { name: "Real Betis", logo: generateLogoPath("Real_Betis"), media: 79 },
          { name: "Valencia", logo: generateLogoPath("Valencia"), media: 78 },
          { name: "Espanyol", logo: generateLogoPath("Espanyol"), media: 75 },
          { name: "Getafe", logo: generateLogoPath("Getafe"), media: 74 },
          { name: "Osasuna", logo: generateLogoPath("Osasuna"), media: 75 },
          { name: "Athletic Club", logo: generateLogoPath("Athletic Club"), media: 80 },
          { name: "Real Sociedad", logo: generateLogoPath("Real Sociedad"), media: 81 },
          { name: "Celta de Vigo", logo: generateLogoPath("Celta de Vigo"), media: 75 },
          { name: "Mallorca", logo: generateLogoPath("Mallorca"), media: 74 },
          { name: "Levante", logo: generateLogoPath("Levante"), media: 73 },
          { name: "Girona", logo: generateLogoPath("Girona"), media: 76 },
          { name: "Real Oviedo", logo: generateLogoPath("Real Oviedo"), media: 72 },
          { name: "Rayo Vallecano", logo: generateLogoPath("Rayo Vallecano"), media: 74 },
          { name: "Alavés", logo: generateLogoPath("Alavés"), media: 73 },
          { name: "Elche", logo: generateLogoPath("Elche"), media: 72 },
        ],
      },
    ],
  },
  {
    name: "Inglaterra",
    leagues: [
      {
        id: 9,
        nombre: "Premier League",
        pais: "Inglaterra",
        categoria: 1,
        teams: [
          { name: "Arsenal", logo: generateLogoPath("Arsenal"), media: 84 },
          { name: "Chelsea", logo: generateLogoPath("Chelsea"), media: 84 },
          { name: "Manchester United", logo: generateLogoPath("Manchester United"), media: 84 },
          { name: "Manchester City", logo: generateLogoPath("Manchester City"), media: 85 },
          { name: "Liverpool", logo: generateLogoPath("Liverpool"), media: 85 },
          { name: "Tottenham", logo: generateLogoPath("Tottenham_Hotspur"), media: 82 },
          { name: "Fulham", logo: generateLogoPath("Fulham"), media: 75 },
          { name: "Newcastle", logo: generateLogoPath("Newcastle_United"), media: 81 },
          { name: "Everton", logo: generateLogoPath("Everton"), media: 76 },
          { name: "Aston Villa", logo: generateLogoPath("Aston Villa"), media: 80 },
          { name: "West Ham", logo: generateLogoPath("West_Ham_United"), media: 78 },
          { name: "Nottingham Forest", logo: generateLogoPath("Nottingham Forest"), media: 74 },
          { name: "Brighton", logo: generateLogoPath("Brighton"), media: 80 },
          { name: "Wolves", logo: generateLogoPath("Wolverhampton"), media: 76 },
          { name: "Crystal Palace", logo: generateLogoPath("Crystal Palace"), media: 75 },
          { name: "Leeds United", logo: generateLogoPath("Leeds United"), media: 74 },
          { name: "Sunderland", logo: generateLogoPath("Sunderland"), media: 72 },
          { name: "Bournemouth", logo: generateLogoPath("Bournemouth"), media: 73 },
          { name: "Burnley", logo: generateLogoPath("Burnley"), media: 72 },
          { name: "Brentford", logo: generateLogoPath("Brentford"), media: 77 },
        ],
      },
    ],
  },
  {
    name: "Internacional",
    leagues: [
      {
        id: 10,
        nombre: "Internacional",
        pais: "Internacional",
        categoria: 1,
        teams: [
          { name: "Alemania", logo: generateLogoPath("Alemania"), media: 86 },
          { name: "Argentina", logo: generateLogoPath("Argentina"), media: 87 },
          { name: "Bolivia", logo: generateLogoPath("Bolivia"), media: 72 },
          { name: "Brasil", logo: generateLogoPath("Brasil"), media: 85 },
          { name: "Chile", logo: generateLogoPath("Chile"), media: 78 },
          { name: "Colombia", logo: generateLogoPath("Colombia"), media: 80 },
          { name: "Croacia", logo: generateLogoPath("Croacia"), media: 84 },
          { name: "Ecuador", logo: generateLogoPath("Ecuador"), media: 78 },
          { name: "Paraguay", logo: generateLogoPath("Paraguay"), media: 77 },
          { name: "Perú", logo: generateLogoPath("Perú"), media: 76 },
          { name: "Uruguay", logo: generateLogoPath("Uruguay"), media: 82 },
          { name: "Venezuela", logo: generateLogoPath("Venezuela"), media: 74 },
          { name: "España", logo: generateLogoPath("España"), media: 87 },
          { name: "Francia", logo: generateLogoPath("Francia"), media: 87 },
          { name: "Inglaterra", logo: generateLogoPath("Inglaterra"), media: 86 },
          { name: "Italia", logo: generateLogoPath("Italia"), media: 84 },
          { name: "México", logo: generateLogoPath("México"), media: 81 },
          { name: "Japón", logo: generateLogoPath("Japón"), media: 77 },
          { name: "Estados Unidos", logo: generateLogoPath("Estados Unidos"), media: 78 },
          { name: "Portugal", logo: generateLogoPath("Portugal"), media: 84 },
          { name: "Holanda", logo: generateLogoPath("Holanda"), media: 84 },
          { name: "Bélgica", logo: generateLogoPath("Bélgica"), media: 84 },
          { name: "Arabia Saudita", logo: generateLogoPath("Arabia Saudita"), media: 73 },
          { name: "Costa Rica", logo: generateLogoPath("Costa Rica"), media: 75 },
          { name: "Suiza", logo: generateLogoPath("Suiza"), media: 80 },
          { name: "Polonia", logo: generateLogoPath("Polonia"), media: 78 },
          { name: "Nigeria", logo: generateLogoPath("Nigeria"), media: 77 },
          { name: "Sudáfrica", logo: generateLogoPath("Sudáfrica"), media: 75 },
          { name: "Egipto", logo: generateLogoPath("Egipto"), media: 76 },
          { name: "Marruecos", logo: generateLogoPath("Marruecos"), media: 78 },
          { name: "Senegal", logo: generateLogoPath("Senegal"), media: 79 },
          { name: "Corea del Sur", logo: generateLogoPath("Corea del Sur"), media: 77 },
        ],
      },
    ],
  },
  {
    name: "Italia",
    leagues: [
      {
        id: 11,
        nombre: "Serie A",
        pais: "Italia",
        categoria: 1,
        teams: [
          { name: "Inter", logo: generateLogoPath("Inter"), media: 84 },
          { name: "Milan", logo: generateLogoPath("Milan"), media: 84 },
          { name: "Juventus", logo: generateLogoPath("Juventus"), media: 84 },
          { name: "Roma", logo: generateLogoPath("Roma"), media: 82 },
          { name: "Lazio", logo: generateLogoPath("Lazio"), media: 81 },
          { name: "Fiorentina", logo: generateLogoPath("Fiorentina"), media: 80 },
          { name: "Napoli", logo: generateLogoPath("Napoli"), media: 82 },
          { name: "Sampdoria", logo: generateLogoPath("Sampdoria"), media: 74 },
          { name: "Torino", logo: generateLogoPath("Torino"), media: 75 },
          { name: "Genoa", logo: generateLogoPath("Genoa"), media: 73 },
          { name: "Cagliari", logo: generateLogoPath("Cagliari"), media: 72 },
          { name: "Bologna", logo: generateLogoPath("Bologna"), media: 74 },
          { name: "Udinese", logo: generateLogoPath("Udinese"), media: 75 },
          { name: "Hellas Verona", logo: generateLogoPath("Hellas Verona"), media: 73 },
          { name: "Parma", logo: generateLogoPath("Parma"), media: 74 },
          { name: "Lecce", logo: generateLogoPath("Lecce"), media: 71 },
          { name: "Sassuolo", logo: generateLogoPath("Sassuolo"), media: 74 },
          { name: "Atalanta", logo: generateLogoPath("Atalanta"), media: 81 },
          { name: "Como", logo: generateLogoPath("Como"), media: 70 },
          { name: "Cremonese", logo: generateLogoPath("Cremonese"), media: 70 },
        ],
      },
    ],
  },
  {
    name: "Resto de América",
    leagues: [
      {
        id: 12,
        nombre: "Resto de América",
        pais: "Resto de América",
        categoria: 1,
        teams: [
          { name: "Atlético Nacional", logo: generateLogoPath("Atlético Nacional"), media: 79 },
          { name: "América de Cali", logo: generateLogoPath("América de Cali"), media: 77 },
          { name: "Junior", logo: generateLogoPath("Junior"), media: 76 },
          { name: "Millonarios", logo: generateLogoPath("Millonarios"), media: 78 },
          { name: "Nacional", logo: generateLogoPath("Nacional"), media: 80 },
          { name: "Peñarol", logo: generateLogoPath("Peñarol"), media: 80 },
          { name: "Cerro Porteño", logo: generateLogoPath("Cerro Porteño"), media: 78 },
          { name: "Libertad", logo: generateLogoPath("Libertad"), media: 77 },
          { name: "Olimpia", logo: generateLogoPath("Olimpia"), media: 79 },
          { name: "Colo Colo", logo: generateLogoPath("Colo Colo"), media: 79 },
          { name: "Universidad Católica", logo: generateLogoPath("Universidad Católica"), media: 77 },
          { name: "Universidad de Chile", logo: generateLogoPath("Universidad de Chile"), media: 77 },
          { name: "Universitario", logo: generateLogoPath("Universitario"), media: 76 },
          { name: "Sporting Cristal", logo: generateLogoPath("Sporting Cristal"), media: 76 },
          { name: "Liga de Quito", logo: generateLogoPath("Liga de Quito"), media: 78 },
          { name: "Emelec", logo: generateLogoPath("Emelec"), media: 76 },
          { name: "Barcelona (Ec)", logo: generateLogoPath("Barcelona (Ec)"), media: 77 },
          { name: "Caracas", logo: generateLogoPath("Caracas"), media: 74 },
          { name: "América (Mex)", logo: generateLogoPath("América (Mex)"), media: 82 },
          { name: "Chivas", logo: generateLogoPath("Chivas"), media: 80 },
          { name: "Cruz Azul", logo: generateLogoPath("Cruz Azul"), media: 80 },
          { name: "Monterrey", logo: generateLogoPath("Monterrey"), media: 81 },
          { name: "Tigres", logo: generateLogoPath("Tigres"), media: 81 },
          { name: "Los Angeles Galaxy", logo: generateLogoPath("Los Angeles Galaxy"), media: 76 },
          { name: "Inter Miami", logo: generateLogoPath("Inter Miami"), media: 77 },
          { name: "Independiente del Valle", logo: generateLogoPath("Independiente del Valle"), media: 78 },
          { name: "Alianza Lima", logo: generateLogoPath("Alianza Lima"), media: 75 },
          { name: "Bolívar", logo: generateLogoPath("Bolívar"), media: 74 },
          { name: "The Strongest", logo: generateLogoPath("The Strongest"), media: 74 },
          { name: "Jorge Wilstermann", logo: generateLogoPath("Jorge Wilstermann"), media: 72 },
        ],
      },
    ],
  },
  {
    name: "Resto de Europa",
    leagues: [
      {
        id: 13,
        nombre: "Resto de Europa",
        pais: "Resto de Europa",
        categoria: 1,
        teams: [
          { name: "Bayern Munich", logo: generateLogoPath("Bayern Munich"), media: 85 },
          { name: "Borussia Dortmund", logo: generateLogoPath("Borussia Dortmund"), media: 83 },
          { name: "Bayer Leverkusen", logo: generateLogoPath("Bayer Leverkusen"), media: 82 },
          { name: "PSG", logo: generateLogoPath("Paris_Saint-Germain"), media: 85 },
          { name: "Marsella", logo: generateLogoPath("Marsella"), media: 81 },
          { name: "Mónaco", logo: generateLogoPath("Mónaco"), media: 81 },
          { name: "Lyon", logo: generateLogoPath("Lyon"), media: 80 },
          { name: "Porto", logo: generateLogoPath("Porto"), media: 82 },
          { name: "Benfica", logo: generateLogoPath("Benfica"), media: 82 },
          { name: "Sporting Lisboa", logo: generateLogoPath("Sporting Lisboa"), media: 81 },
          { name: "Celtic", logo: generateLogoPath("Celtic"), media: 79 },
          { name: "Rangers", logo: generateLogoPath("Rangers"), media: 79 },
          { name: "Ajax", logo: generateLogoPath("Ajax"), media: 82 },
          { name: "PSV Eindhoven", logo: generateLogoPath("PSV Eindhoven"), media: 81 },
          { name: "Feyenoord", logo: generateLogoPath("Feyenoord"), media: 80 },
          { name: "Anderlecht", logo: generateLogoPath("Anderlecht"), media: 77 },
          { name: "Fenerbahce", logo: generateLogoPath("Fenerbahce"), media: 78 },
          { name: "Galatasaray", logo: generateLogoPath("Galatasaray"), media: 80 },
          { name: "Olympiakos", logo: generateLogoPath("Olympiakos"), media: 78 },
          { name: "Shakhtar Donetsk", logo: generateLogoPath("Shakhtar Donetsk"), media: 81 },
        ],
      },
    ],
  },
];

  useEffect(() => {
  // en lugar de fetch, uso los hardcodeados
  setCountries(hardcodedCountries);
}, [])

/*   useEffect(() => {
    const fetchData = async () => {
      try {
        const ligasResponse = await fetch("https://localhost:7225/api/ligas");
        const equiposResponse = await fetch("https://localhost:7225/api/equipos");

        const ligas: League[] = await ligasResponse.json();
        const equipos = await equiposResponse.json();

        const ligasConEquipos: League[] = ligas.map((liga) => ({
          ...liga,
          teams: equipos
            .filter((eq: any) => eq.ligaId === liga.id)
            .map((eq: any) => ({
              name: eq.nombre,
              media: eq.media,
              logo: generateLogoPath(eq.nombre),
            })),
        }));

        const agrupadoPorPais: Country[] = [];
        ligasConEquipos.forEach((liga) => {
          const paisExistente = agrupadoPorPais.find((c) => c.name === liga.pais);
          if (paisExistente) {
            paisExistente.leagues.push(liga);
          } else {
            agrupadoPorPais.push({ name: liga.pais, leagues: [liga] });
          }
        });

        agrupadoPorPais.sort((a, b) => a.name.localeCompare(b.name));
        agrupadoPorPais.forEach((pais) => {
          pais.leagues.sort((a, b) => a.categoria - b.categoria);
        });

        setCountries(agrupadoPorPais);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []); */

  const handleSeleccion = (equipo: Team) => {
    onSelectedTeam(equipo);
  };

  const siguientePais = () => {
    setSelectedCountryIndex((prev) => (prev + 1) % countries.length);
    setSelectedLeagueIndex(0);
  };

  const anteriorPais = () => {
    setSelectedCountryIndex((prev) => (prev - 1 + countries.length) % countries.length);
    setSelectedLeagueIndex(0);
  };

  const siguienteLiga = () => {
    if (!selectedCountry) return;
    setSelectedLeagueIndex((prev) => (prev + 1) % selectedCountry.leagues.length);
  };

  const anteriorLiga = () => {
    if (!selectedCountry) return;
    setSelectedLeagueIndex((prev) => (prev - 1 + selectedCountry.leagues.length) % selectedCountry.leagues.length);
  };

  return (
    <div className="selector-equipos">
      {/* Navegación de países */}
      <div className="paises-navegacion">
        <button onClick={anteriorPais} disabled={countries.length <= 1}>{"<"}</button>
        <span>{selectedCountry?.name}</span>
        <button onClick={siguientePais} disabled={countries.length <= 1}>{">"}</button>
      </div>

      {/* Navegación de ligas */}
      <div className="ligas-navegacion">
        <button onClick={anteriorLiga}>{"<"}</button>
        <span>{selectedLeague?.nombre}</span>
        <button onClick={siguienteLiga}>{">"}</button>
      </div>

      {/* Equipos */}
      <div className="equipos-grid">
        {selectedLeague?.teams
          ?.slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((equipo) => (
            <div
              key={equipo.name}
              className="equipo-card"
              onClick={() => handleSeleccion(equipo)}
            >
              <img src={equipo.logo} alt={equipo.name} className="escudos" />
              <span className="text name">{equipo.name}</span>
              <span className="text media">{equipo.media}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SelectorEquipos;
