import {
  SiPhp,
  SiLaravel,
  SiNodedotjs,
  SiReact,
  SiVuedotjs,
  SiMariadb,
  SiMongodb,
  SiRabbitmq,
  SiRedis,
  SiRedux,
  SiGooglecloud,
  SiFortinet,
  SiJunipernetworks,
  SiDotnet,
  SiTypescript,
  SiMysql,
  SiFirebase,
  SiSupabase,
} from "react-icons/si";
import {
  FaCode,
  FaDatabase,
  FaCloud,
  FaNetworkWired,
  FaAws,
  FaJava,
} from "react-icons/fa";
import { TbBrandCSharp } from "react-icons/tb";

type Props = {
  label: string;
  icon?: React.ReactNode;
};

const getTechIcon = (label: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    "PHP 8": <SiPhp className="w-4 h-4" />,
    Laravel: <SiLaravel className="w-4 h-4" />,
    PhalconPHP: <SiPhp className="w-4 h-4" />,
    CodeIgniter: <SiPhp className="w-4 h-4" />,
    NodeJS: <SiNodedotjs className="w-4 h-4" />,
    ReactJS: <SiReact className="w-4 h-4" />,
    VueJS: <SiVuedotjs className="w-4 h-4" />,
    MariaDB: <SiMariadb className="w-4 h-4" />,
    MongoDB: <SiMongodb className="w-4 h-4" />,
    "Microsoft SQL Server": <FaDatabase className="w-4 h-4" />,
    RabbitMQ: <SiRabbitmq className="w-4 h-4" />,
    Redis: <SiRedis className="w-4 h-4" />,
    Redux: <SiRedux className="w-4 h-4" />,
    "Google Cloud Platform": <SiGooglecloud className="w-4 h-4" />,
    "Amazon Web Services": <FaAws className="w-4 h-4" />,
    Fortinet: <SiFortinet className="w-4 h-4" />,
    Ruijie: <FaNetworkWired className="w-4 h-4" />,
    Juniper: <SiJunipernetworks className="w-4 h-4" />,
    "C#": <TbBrandCSharp className="w-4 h-4" />,
    ".NET": <SiDotnet className="w-4 h-4" />,
    TypeScript: <SiTypescript className="w-4 h-4" />,
    MySQL: <SiMysql className="w-4 h-4" />,
    MSSQL: <FaDatabase className="w-4 h-4" />,
    Firebase: <SiFirebase className="w-4 h-4" />,
    Supabase: <SiSupabase className="w-4 h-4" />,
    Java: <FaJava className="w-4 h-4" />,
  };

  return iconMap[label] || <FaCode className="w-4 h-4" />;
};

export default function TechBadge({ label, icon }: Props) {
  return (
    <span className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs bg-white/[0.04] border border-white/10 text-white/80 hover:bg-white/[0.08] transition-colors">
      {icon || getTechIcon(label)}
      {label}
    </span>
  );
}
