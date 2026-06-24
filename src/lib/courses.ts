export type Unit = {
  id: string;
  title: string;
  videoUrl: string;
  durationMin: number;
  resources: { name: string; url: string }[];
};

export type Course = {
  id: string;
  title: string;
  area: "Odontología" | "Salud General" | "Imagenología";
  level: "Básico" | "Intermedio" | "Avanzado";
  priceClp: number;
  hours: number;
  description: string;
  certified: boolean;
  practicalSession: boolean;
  image?: string;
  units: Unit[];
};

export const AREAS = ["Todas", "Odontología", "Salud General", "Imagenología"] as const;

export const COURSES: Course[] = [
  {
    id: "endodoncia-avanzada",
    title: "Endodoncia Avanzada: Técnicas Rotatorias",
    area: "Odontología",
    level: "Avanzado",
    priceClp: 189000,
    hours: 24,
    certified: true,
    practicalSession: true,
    image: "http://127.0.0.1:54321/storage/v1/object/public/course-images/endodoncia-avanzada.png",
    description:
      "Domina las técnicas rotatorias modernas, instrumentación niquel-titanio y obturación termoplástica con casos clínicos reales.",
    units: [
      {
        id: "u1",
        title: "Unidad 1 · Fundamentos y diagnóstico pulpar",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        durationMin: 42,
        resources: [
          { name: "Paper - Diagnóstico pulpar 2024.pdf", url: "#" },
          { name: "Guía clínica de endodoncia.pdf", url: "#" },
        ],
      },
      {
        id: "u2",
        title: "Unidad 2 · Instrumentación rotatoria NiTi",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        durationMin: 55,
        resources: [
          { name: "Protocolo de instrumentación.pdf", url: "#" },
        ],
      },
      {
        id: "u3",
        title: "Unidad 3 · Obturación termoplástica y casos",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        durationMin: 48,
        resources: [
          { name: "Casos clínicos resueltos.pdf", url: "#" },
          { name: "Checklist de seguimiento.pdf", url: "#" },
        ],
      },
    ],
  },
  {
    id: "implantologia-digital",
    title: "Implantología Digital y Flujo CAD/CAM",
    area: "Odontología",
    level: "Intermedio",
    priceClp: 219000,
    hours: 30,
    certified: true,
    practicalSession: true,
    image: "http://127.0.0.1:54321/storage/v1/object/public/course-images/implantologia-digital-y-flujo-cad-cam.png",
    description:
      "Aprende el flujo digital completo: escaneo intraoral, planificación guiada y rehabilitación CAD/CAM paso a paso.",
    units: [
      {
        id: "u1",
        title: "Unidad 1 · Escaneo intraoral y planificación 3D",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        durationMin: 38,
        resources: [{ name: "Manual de escaneo digital.pdf", url: "#" }],
      },
      {
        id: "u2",
        title: "Unidad 2 · Cirugía guiada con guías 3D",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        durationMin: 51,
        resources: [{ name: "Protocolo cirugía guiada.pdf", url: "#" }],
      },
      {
        id: "u3",
        title: "Unidad 3 · Rehabilitación CAD/CAM",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        durationMin: 47,
        resources: [{ name: "Workflow CAD/CAM.pdf", url: "#" }],
      },
    ],
  },
  {
    id: "bioseguridad-clinica",
    title: "Bioseguridad Clínica para Equipos de Salud",
    area: "Salud General",
    level: "Básico",
    priceClp: 89000,
    hours: 16,
    certified: true,
    practicalSession: false,
    image: "http://127.0.0.1:54321/storage/v1/object/public/course-images/bioseguridad-clinica-para-equipos-de-salud.png",
    description:
      "Norma chilena, control de infecciones, EPP y protocolos actualizados para clínicas dentales y centros de salud.",
    units: [
      {
        id: "u1",
        title: "Unidad 1 · Norma y marco regulatorio",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        durationMin: 28,
        resources: [{ name: "Norma MINSAL resumida.pdf", url: "#" }],
      },
      {
        id: "u2",
        title: "Unidad 2 · EPP y manejo de residuos",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        durationMin: 34,
        resources: [{ name: "Checklist EPP.pdf", url: "#" }],
      },
      {
        id: "u3",
        title: "Unidad 3 · Esterilización y trazabilidad",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        durationMin: 36,
        resources: [{ name: "Trazabilidad de instrumental.pdf", url: "#" }],
      },
    ],
  },
];

export const formatCLP = (n: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

export const getCourse = (id: string) => COURSES.find((c) => c.id === id);
