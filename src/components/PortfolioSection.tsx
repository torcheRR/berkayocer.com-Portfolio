import SectionCard from "./SectionCard";
import {
  SiReact,
  SiFirebase,
  SiJavascript,
  SiCss3,
  SiDotnet,
  SiTypescript,
  SiTailwindcss,
  SiSupabase,
  SiNextdotjs,
} from "react-icons/si";
import { FaCode, FaJava, FaDatabase } from "react-icons/fa";
import { TbBrandCSharp } from "react-icons/tb";

// Teknoloji iconları ve linklerini tanımla
const getTechIcon = (tech: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    "React Native": <SiReact className="w-4 h-4" />,
    "React.js": <SiReact className="w-4 h-4" />,
    "Next.js": <SiNextdotjs className="w-4 h-4" />,
    Firebase: <SiFirebase className="w-4 h-4" />,
    CSS: <SiCss3 className="w-4 h-4" />,
    Java: <FaJava className="w-4 h-4" />,
    "C#": <TbBrandCSharp className="w-4 h-4" />,
    ".NET": <SiDotnet className="w-4 h-4" />,
    SQL: <FaDatabase className="w-4 h-4" />,
    JavaScript: <SiJavascript className="w-4 h-4" />,
    TypeScript: <SiTypescript className="w-4 h-4" />,
    TailwindCSS: <SiTailwindcss className="w-4 h-4" />,
    Supabase: <SiSupabase className="w-4 h-4" />,
  };
  return iconMap[tech] || <FaCode className="w-4 h-4" />;
};

const getTechLink = (tech: string) => {
  const linkMap: { [key: string]: string } = {
    "React Native": "https://reactnative.dev/",
    "React.js": "https://react.dev/",
    "Next.js": "https://nextjs.org/",
    Firebase: "https://firebase.google.com/",
    CSS: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    Java: "https://www.java.com/",
    "C#": "https://dotnet.microsoft.com/languages/csharp",
    ".NET": "https://dotnet.microsoft.com/",
    SQL: "https://www.microsoft.com/en-us/sql-server",
    JavaScript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    TypeScript: "https://www.typescriptlang.org/",
    TailwindCSS: "https://tailwindcss.com/",
    Supabase: "https://supabase.com/",
  };
  return linkMap[tech] || "#";
};

const projects = [
  {
    title: "TravelWise",
    description:
      "Yapay zeka destekli, seyahat bazlı sosyal medya uygulaması. React Native ile geliştirildi.",
    technologies: ["React Native", "Supabase"],
    link: "https://github.com/torcheRR/TravelWise",
    status: "Bitirme Projesi",
  },
  {
    title: "Portfolio",
    description: "Next.js ile geliştirilmiş portfolio uygulaması.",
    technologies: ["Next.js", "TailwindCSS", "TypeScript"],
    link: "https://github.com/torcheRR/berkayocer.com-Portfolio",
    status: "Portfolyo Projesi",
  },
  {
    title: "DisneyPlusClone",
    description: "Disney Plus ana sayfa klonu. React.js ile geliştirildi.",
    technologies: ["React.js", "CSS"],
    link: "https://github.com/torcheRR/disneyPlusClone",
    status: "Tamamlandı",
  },
  {
    title: "chatApp",
    description:
      "Local üzerinde çoklu kullanıcı mesajlaşma. React.js ve Firebase ile geliştirildi.",
    technologies: ["React.js", "Firebase"],
    link: "https://github.com/torcheRR/chatApp-React-v1",
    status: "Tamamlandı",
  },
  {
    title: "SnakeGame",
    description: "Java Frame ve Panel ile geliştirilmiş yılan oyunu.",
    technologies: ["Java"],
    link: "https://github.com/torcheRR/javaSnakeGame",
    status: "Tamamlandı",
  },
  {
    title: "javaWeatherAppGui",
    description:
      "Java ile hava durumu uygulaması. Java Frame ve Panel ile geliştirildi.",
    technologies: ["Java", "JSON"],
    link: "https://github.com/torcheRR/javaWeatherAppGui",
    status: "Tamamlandı",
  },
  {
    title: "javaMp3Project",
    description: "Java ile mp3 oyunu. Java Frame ve Panel ile geliştirildi.",
    technologies: ["Java"],
    link: "https://github.com/torcheRR/javaMp3Project",
    status: "Tamamlandı",
  },
  {
    title: "LogStructureWithAttributes",
    description:
      "Metod parametrelerini ve çıktıyı SQL veritabanında tutan log yapısı. C# ile geliştirildi.",
    technologies: ["C#", ".NET", "SQL"],
    link: "https://github.com/torcheRR/LogStructureWithAttributes",
    status: "Tamamlandı",
  },
  {
    title: "loginGuiHomeWork",
    description: "Login ve Register sayfaları. Java ile geliştirildi.",
    technologies: ["Java"],
    link: "https://github.com/torcheRR/loginGuiHomeWork",
    status: "Tamamlandı",
  },
  {
    title: "GuiHomeWork2",
    description: "Java ile geliştirildi. Okul ödevi için yapıldı.",
    technologies: ["Java"],
    link: "https://github.com/torcheRR/GuiHomeWork2",
    status: "Tamamlandı",
  },
  {
    title: "javaArithmeticalComboBox",
    description: "Java Gui ComboBox ile aritmetik işlemler yapan uygulama.",
    technologies: ["Java"],
    link: "https://github.com/torcheRR/javaArithmeticalComboBox",
    status: "Tamamlandı",
  },
  {
    title: "javaMathematicalOperations",
    description: "Java Gui ders projesi.",
    technologies: ["Java"],
    link: "https://github.com/torcheRR/javaMathematicalOperations",
    status: "Tamamlandı",
  },
  {
    title: "MyJavaLearning",
    description: "Java öğrenmek için yaptığım projeler.",
    technologies: ["Java"],
    link: "https://github.com/torcheRR/MyJavaLearning",
    status: "Aktif",
  },
  {
    title: "myCSharpLearning",
    description: "C# öğrenmek için yaptığım projeler.",
    technologies: ["C#"],
    link: "https://github.com/torcheRR/myCSharpLearning",
    status: "Aktif",
  },
  {
    title: "MyReactLearning",
    description: "React öğrenmek için yaptığım projeler.",
    technologies: [
      "React.js",
      "TypeScript",
      "TailwindCSS",
      "CSS",
      "React Router",
    ],
    link: "https://github.com/torcheRR/MyReactLearning",
    status: "Aktif",
  },
  {
    title: "MyHtmlLearning",
    description: "HTML öğrenmek için yaptığım projeler.",
    technologies: ["HTML", "CSS"],
    link: "https://github.com/torcheRR/MyHtmlLearning",
    status: "Aktif",
  },
  {
    title: "MyBootstrapLearning",
    description: "Bootstrap öğrenmek için yaptığım projeler.",
    technologies: ["Bootstrap", "CSS"],
    link: "https://github.com/torcheRR/MyBootstrapLearning",
    status: "Aktif",
  },
  {
    title: "MyJavaScriptLearning",
    description: "JavaScript öğrenmek için yaptığım projeler.",
    technologies: ["JavaScript", "CSS"],
    link: "https://github.com/torcheRR/MyJavaScriptLearning",
    status: "Aktif",
  },
];

export default function PortfolioSection() {
  return (
    <section id="portfoyum" className="space-y-6 cursor-default">
      <h2 className="text-2xl font-semibold">Portföyüm</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg">{project.title}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  project.status === "Tamamlandı"
                    ? "bg-green-500/10 text-green-400 border border-green-500/30"
                    : project.status === "Aktif"
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                }`}
              >
                {project.status}
              </span>
            </div>

            <p className="text-sm text-white/70 mb-4 leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech, techIndex) => (
                <a
                  key={techIndex}
                  href={getTechLink(tech)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2 py-1 rounded-md text-xs bg-white/[0.04] border border-white/10 text-white/60 hover:bg-white/[0.08] hover:text-white/80 transition-colors cursor-pointer"
                >
                  {getTechIcon(tech)}
                  {tech}
                </a>
              ))}
            </div>
            <a
              href={project.link}
              target="_blank"
              className="text-sm text-yellow-400 hover:underline"
            >
              Kaynağı Gör →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
